# Tessario Backend MVP

This first backend pass keeps Tessario simple to run while moving the app away from browser-only persistence.

## What It Provides

- Static hosting for the current Tessario frontend.
- JSON API endpoints under `/api`.
- Server-side persistence in `.data/tessario-state.json`.
- Bootstrap loading so the frontend can hydrate from backend state.
- Sync endpoints for tickets, users, profile settings, notifications, Knowledge Vault metadata, product links, customer accounts, and the last ticket number.
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

## Next Backend Upgrades

- Replace JSON-file persistence with Postgres.
- Add real authentication and role checks.
- Add normalized tables for tickets, customers, messages, notes, assignments, macros, and activity history.
- Add real file upload storage for receipts, screenshots, and Knowledge Vault documents.
- Add PDF/DOCX text extraction and searchable Knowledge Vault content.
- Add email ingestion and outbound email integration.
