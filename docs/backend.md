# Tessario Backend MVP

This backend pass keeps Tessario simple to run while moving the app away from browser-only persistence and toward normalized server data.

## What It Provides

- Static hosting for the current Tessario frontend.
- JSON API endpoints under `/api`.
- Server-side persistence in `.data/tessario-state.json` by default.
- Optional Postgres persistence when `DATABASE_URL` is set.
- Bootstrap loading so the frontend can hydrate from backend state.
- Sync endpoints for tickets, users, profile settings, notifications, Knowledge Vault metadata, product links, customer accounts, and the last ticket number.
- Normalized ticket endpoints for ticket creation, updates, reads, messages, and notes.
- Development placeholder session endpoint for future auth work.

## Run Locally

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:4173
```

## API Endpoints

- `GET /api/health`
- `GET /api/session`
- `GET /api/bootstrap`
- `GET /api/state/:resource`
- `PUT /api/state/:resource`
- `GET /api/tickets?status=Open&assignee=CS14%20Robert&search=RCC7&limit=50&offset=0`
- `POST /api/tickets`
- `GET /api/tickets/:id`
- `PATCH /api/tickets/:id`
- `POST /api/tickets/:id/messages`
- `POST /api/tickets/:id/notes`
- `POST /api/reset`

Supported resources:

- `tickets`
- `users`
- `profile`
- `notifications`
- `knowledgeDocs`
- `productLinks`
- `customerAccounts`
- `lastTicketNumber`

## Postgres Mode

Set `DATABASE_URL` before starting the server:

```powershell
$env:DATABASE_URL='postgres://user:password@localhost:5432/tessario'
npm.cmd run dev
```

By default, the server runs the schema in `db/schema.sql` on startup. Set `TESSARIO_AUTO_MIGRATE=0` to disable automatic schema creation.

Postgres mode creates:

- `app_state` for compatibility with the current frontend sync contract.
- `tickets` for normalized ticket records.
- `ticket_messages` for normalized ticket message/note records.

## Next Backend Upgrades

- Add real authentication and role checks.
- Add normalized tables for customers, users, assignments, macros, Knowledge Vault documents, and activity history.
- Add real file upload storage for receipts, screenshots, and Knowledge Vault documents.
- Add PDF/DOCX text extraction and searchable Knowledge Vault content.
- Add email ingestion and outbound email integration.
