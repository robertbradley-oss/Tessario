// Tessario local server: static app hosting plus MVP JSON API persistence.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createJsonStore } from "./lib/json-store.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const dataFile = process.env.TESSARIO_DATA_FILE || join(root, ".data", "tessario-state.json");
const schemaPath = join(root, "db", "schema.sql");
const maxJsonBytes = 12 * 1024 * 1024;

const staticTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const resourceValidators = {
  tickets: Array.isArray,
  users: Array.isArray,
  profile: isPlainObject,
  notifications: Array.isArray,
  knowledgeDocs: Array.isArray,
  productLinks: Array.isArray,
  customerAccounts: Array.isArray,
  lastTicketNumber: (value) => Number.isInteger(value) && value >= 0
};

const store = await createStore();

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    await serveStatic(response, url.pathname);
  } catch (error) {
    sendJson(response, 500, {
      error: "internal_error",
      message: error instanceof Error ? error.message : "Unknown server error"
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Tessario (iSpring Model) running at http://127.0.0.1:${port}`);
  console.log(`Persistence: ${store.mode}`);
});

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      app: "Tessario (iSpring Model)",
      mode: "mvp-backend",
      persistence: store.mode
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/session") {
    const state = await store.loadState();
    sendJson(response, 200, {
      user: {
        name: state.profile?.displayName || "CS14 Robert",
        role: state.profile?.role || "Admin"
      },
      authMode: "development-placeholder"
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/bootstrap") {
    sendJson(response, 200, {
      state: await store.loadState()
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/tickets") {
    sendJson(response, 200, {
      tickets: await store.listTickets(Object.fromEntries(url.searchParams.entries()))
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/tickets") {
    const input = await readJsonBody(request);
    if (!isPlainObject(input) || !String(input.subject || "").trim()) {
      sendJson(response, 400, { error: "invalid_ticket_payload" });
      return;
    }
    sendJson(response, 201, { ticket: await store.createTicket(input) });
    return;
  }

  const ticketRoute = url.pathname.match(/^\/api\/tickets\/([^/]+)(?:\/(messages|notes))?$/);
  if (ticketRoute) {
    const ticketId = decodeURIComponent(ticketRoute[1]);
    const childRoute = ticketRoute[2] || "";

    if (request.method === "GET" && !childRoute) {
      const ticket = await store.getTicket(ticketId);
      sendJson(response, ticket ? 200 : 404, ticket ? { ticket } : { error: "ticket_not_found" });
      return;
    }

    if (request.method === "PATCH" && !childRoute) {
      const patch = await readJsonBody(request);
      if (!isPlainObject(patch)) {
        sendJson(response, 400, { error: "invalid_ticket_patch" });
        return;
      }
      const ticket = await store.patchTicket(ticketId, patch);
      sendJson(response, ticket ? 200 : 404, ticket ? { ticket } : { error: "ticket_not_found" });
      return;
    }

    if (request.method === "POST" && (childRoute === "messages" || childRoute === "notes")) {
      const input = await readJsonBody(request);
      if (!isPlainObject(input) || !String(input.body || "").trim()) {
        sendJson(response, 400, { error: "invalid_message_payload" });
        return;
      }
      const result = await store.appendTicketMessage(ticketId, {
        ...input,
        type: childRoute === "notes" ? "note" : input.type || "rep"
      });
      sendJson(response, result ? 201 : 404, result || { error: "ticket_not_found" });
      return;
    }
  }

  const stateMatch = url.pathname.match(/^\/api\/state\/([A-Za-z0-9_-]+)$/);
  if (stateMatch) {
    const resource = stateMatch[1];
    if (!resourceValidators[resource]) {
      sendJson(response, 404, { error: "unknown_resource" });
      return;
    }

    if (request.method === "GET") {
      sendJson(response, 200, { resource, value: await store.getResource(resource) });
      return;
    }

    if (request.method === "PUT") {
      const value = await readJsonBody(request);
      if (!resourceValidators[resource](value)) {
        sendJson(response, 400, { error: "invalid_resource_payload", resource });
        return;
      }
      const updatedAt = await store.setResource(resource, value);
      sendJson(response, 200, { ok: true, resource, updatedAt });
      return;
    }
  }

  if (request.method === "POST" && url.pathname === "/api/reset") {
    sendJson(response, 200, { ok: true, state: await store.resetState() });
    return;
  }

  sendJson(response, 404, { error: "not_found" });
}

async function serveStatic(response, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const normalized = normalize(decodeURIComponent(requestedPath)).replace(/^[/\\]+/, "");
  const filePath = resolve(root, normalized);

  if (!filePath.startsWith(resolve(root))) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": staticTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

function defaultState() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tickets: null,
    users: null,
    profile: null,
    notifications: null,
    knowledgeDocs: null,
    productLinks: null,
    customerAccounts: null,
    lastTicketNumber: null
  };
}

async function createStore() {
  if (process.env.DATABASE_URL) {
    const { createPostgresStore } = await import("./lib/postgres-store.mjs");
    return createPostgresStore({
      databaseUrl: process.env.DATABASE_URL,
      schemaPath,
      defaultState
    });
  }
  return createJsonStore({ dataFile, defaultState });
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxJsonBytes) {
      throw new Error("JSON body is too large");
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return null;
  return JSON.parse(raw);
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
