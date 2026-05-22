import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const port = 4199;
const dataDir = await mkdtemp(join(tmpdir(), "tessario-smoke-"));
const dataFile = join(dataDir, "state.json");
const server = spawn(process.execPath, ["server.mjs"], {
  env: {
    ...process.env,
    PORT: String(port),
    TESSARIO_DATA_FILE: dataFile
  },
  stdio: "pipe"
});

try {
  await waitForHealth(port);

  const profile = { displayName: "Smoke Test", role: "Admin" };
  const update = await fetch(`http://127.0.0.1:${port}/api/state/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });
  if (!update.ok) throw new Error(`Profile update failed: ${update.status}`);

  const read = await fetch(`http://127.0.0.1:${port}/api/state/profile`);
  const payload = await read.json();
  if (payload.value?.displayName !== profile.displayName) {
    throw new Error("Profile readback did not match written value.");
  }

  console.log("Backend smoke test passed.");
} finally {
  server.kill();
}

async function waitForHealth(targetPort) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${targetPort}/api/health`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw new Error("Server did not become healthy in time.");
}
