# Tessario

## Project Purpose

Tessario is a front-end prototype for a modern internal ticketing workspace. The current demo workspace is configured for iSpring Water Systems so support reps, senior reps, managers, and admins can review realistic water-system tickets, customer history, diagnosis guidance, macros, and follow-up context with fewer clicks.

Tessario is the product. iSpring Water Systems is the default demo workspace/customer used to prove the support workflow. Customer-specific mock values now live behind a workspace configuration layer so future SaaS customers can define their own departments, reps, products, macros, knowledge, rules, channels, and guardrails without rebuilding the core app.

Tessario core should stay workspace-agnostic: ticket queue, ticket detail, customer history, reply composer, macros UI, AI assignment, admin assignment pool, user profile/settings, Tessario Assist, Tessario Knowledge Vault, SLA/follow-up views, and reports/metrics. The active workspace config provides the current iSpring company name, departments, reps, macro library, product/model data, warranty/return rules, review links, ticket categories, source channels, custom fields, guardrails, and workspace-specific queue/status labels. Tessario Knowledge Vault source material now starts empty and is represented by uploaded file metadata in localStorage until backend storage/parsing exists.

This is currently a static mock-data prototype. It does not include backend auth, email sync, databases, order lookup, inventory lookup, or real ticket persistence beyond browser `localStorage`.

## How To Run Locally

From this folder:

```powershell
node server.mjs
```

Then open:

```text
http://127.0.0.1:4173
```

The app has no package install step and no build step. It is plain HTML, CSS, and JavaScript.

## How To Deploy To Vercel

This project is a static site. Deploy the folder root to Vercel.

Current production alias:

```text
https://ispring-support-hub.vercel.app
```

Vercel also creates one-time deployment URLs, such as `https://ispring-support-awyx1p8uy-robbybradley-oss-projects.vercel.app`. Those are snapshots. If an older deployment URL still shows zero metrics, use the production alias above or redeploy.

If PowerShell blocks the Vercel script or Node has certificate trouble, this worked locally:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
vercel.cmd --prod
```

Recommended Vercel settings:

- Framework preset: Other
- Build command: leave empty
- Output directory: `.`
- Install command: leave empty

The important deployed files are:

- `index.html`
- `styles.css`
- `app.js`
- `assets/tessario-mark.svg`
- `assets/tessario-logo.svg`
- `assets/ispring-logo.png`

`server.mjs` is only for local preview and is not needed for Vercel hosting.

## Current App Structure

- `index.html`: Static app shell. Contains the sidebar, top bar, metric strip, two-screen ticket workspace, queue controls, admin assignment screen, customer-history modal, and create-ticket modal.
- `styles.css`: Desktop-first CRM styling. Defines the dark navy sidebar, compact metric cards, queue/detail screen layouts, card/table queue views, conversation thread, reply dock, and right context panel.
- `app.js`: Main front-end application logic. Contains the `workspaceConfig` demo configuration, mock ticket data, assignment users, fair-routing logic, main support views, screen state, view/filter/sort state, table queue rendering, conversation rendering, smart diagnosis, macros, attachments, guardrails, customer history, admin controls, and create-ticket behavior.
- `assets/tessario-mark.svg`: Tessario icon-only mark used for the left sidebar brand mark and browser favicon.
- `assets/tessario-logo.svg`: Full Tessario logo asset retained for product-brand treatments when needed outside the current workspace header.
- `assets/ispring-logo.png`: Active iSpring workspace logo used in the top header.
- `server.mjs`: Minimal Node static server for local preview.
- `.vercel/`: Vercel project metadata, if linked locally.

## Main Features Already Built

- Desktop-first support workspace with a 220px dark navy sidebar.
- Current Tessario icon-only mark in the left sidebar with fallback text if the image fails. The sidebar mark sits directly on the navy background, and the top header uses the active workspace logo with the active workspace label.
- Official Tessario brand color system in `:root`, including Tessario Navy, Deep Blue, Blue, Bright Blue, Cyan, Violet, soft app background, white cards, light borders, muted text, and restrained brand gradients.
- Compact top bar with Tessario title, global search, New Ticket button, copy ticket link button, clickable user profile control, and the active workspace label.
- Main Dashboard sidebar item for a Tessario support-health dashboard inspired by OST's structure but redesigned around real decisions rather than noisy activity logs.
- Dashboard filters for timeframe, department/team, rep, product family, channel/source, and status, plus a refresh action.
- Dashboard key metrics for new tickets, Open tickets, Closed tickets, customer replies, SLA due soon, overdue SLA, Avg first response, Avg resolution, Reopened, and Needs action with small previous-period trend indicators.
- Dashboard Ticket Activity chart tracks only useful support movement: Created, Closed, Reopened, SLA risk, and Customer replied.
- Dashboard Needs Action section highlights tickets requiring attention because of customer replies, SLA risk, overdue due times, follow-up due, stale updates, or missing required info.
- Dashboard Rep Workload section shows active reps, active ticket load, new assigned today, overdue and due-soon counts, response/resolution estimates, assignment eligibility, and workload bars for AI fair assignment review.
- Dashboard Product and Issue Trends section groups the current iSpring demo tickets by product family, model number, and issue type to help spot support/product patterns.
- Dashboard SLA / Response Health and Stuck Tickets sections summarize due-soon, overdue, wait-time, no-response, stale, frustrated-tone, and warranty/replacement risk signals.
- Admin-only Tessario Assist launch access from the Admin screen and top bar. These open Global mode as a general assistant with no selected ticket context.
- Upload-based Tessario Knowledge Vault page for approved workspace source files used by Tessario Assist once backend parsing is connected.
- Workspace configuration layer for the active iSpring Water Systems demo workspace, including departments, reps, macros, product/model data, warranty/return/review rules, ticket categories, source channels, custom fields, and brand guardrails.
- Saved queue filter definitions, workspace-specific waiting status labels, source channels, create-ticket placeholders, and product defaults now come from `workspaceConfig` rather than the generic queue or modal rendering code.
- Compact metric strip calculated from mock ticket data.
- Two-screen workflow:
  - Ticket Queue: default landing screen for scanning open tickets with a search-first table, collapsible filters, sort controls, and New Ticket access from the workspace header.
  - Ticket Detail: focused ticket workspace with Back to queue, full thread, internal notes, reply editor, macros, Next Best Step guidance, customer/order/warranty/product context, attachments, checklist, guardrails, manager view, and similar tickets.
- Sleeker icon-led sidebar with Dashboard, Tickets, Admin, and Settings, plus a polished workspace switcher footer.
- Clean Tickets page focused on the ticket table, with Open and Assigned To Me count badges, an unbadged Closed tab, the active queue title, search bar, Closed-tab date range dropdown with counts, and no saved-view chip showcase.
- Modern table view inspired by OST-style support queues without cloning them, with sticky headers, sortable columns, compact alternating rows, hover/selected states, visible Ticket #, Last Updated, Emails, Subject, From, Assigned To, and Status columns, and CSS icon sort indicators with no direction-word label text.
- Queue screen includes a right selected-ticket preview panel with ticket number, status, subject, customer/contact, assignment, model/order, purchase source, receipt, warranty, last updated, and a clean Open ticket action, without displaying the latest email/message body.
- Mock Tessario AI purchase-source detection scans new/imported ticket subject, customer text, order/source fields, and attachment metadata for Amazon, iSpring direct, Home Depot, Lowe's, Walmart, eBay, or Unknown and records detected sources in the ticket timeline.
- Customer account mock state stores receipt metadata, purchase source, order/model, warranty registration status/date, and notes by customer email so future tickets can show receipt or warranty already on file.
- Customer History uses one compact single-page account view with Customer profile, Ticket history, Receipts & warranty, and Account notes sections, plus an Edit customer action for account contact details.
- Customer History Add receipt opens an upload modal for PDF, PNG, JPG, or JPEG receipts with file picker, drag-and-drop, and pasted screenshot support; saved receipt cards include upload metadata, purchase source, order/model, receipt status, linked warranty status, and actions to verify, register/unregister warranty, or apply the receipt to the current ticket.
- Detail-screen status control for three statuses: Open; Closed, Waiting On Response; and Closed. Legacy/mock Waiting Customer and Waiting On Response statuses display as Closed, Waiting On Response; Closed/Resolved display as Closed; and other legacy active statuses display as Open.
- Status changes persist to mock state/localStorage, write timeline events, and update ticket tabs, sidebar badges, and queue counts immediately.
- Ticket thread system activity now renders as compact timeline rows so created, assigned, status-changed, reassigned, and AI-assignment events do not compete with customer/staff messages.
- Ticket Detail includes a small Tessario Assist panel with a Use Tessario AI button so reps can ask ticket-aware questions without leaving the ticket.
- Built-in mock Tessario assignment for new tickets: manual tickets assign to the creating rep, incoming-email style assignment checks subject-mentioned reps and customer history first, then randomly assigns unowned emails to an eligible active rep.
- Built-in mock Tessario AI support copilot for summaries, likely issue, next troubleshooting step, customer-safe draft replies, tone rewrites, product/model identification, missing-info checks, macro suggestions, and general support questions.
- Tessario Assist uses one shared conversational chat UI for Global and Ticket modes. Global mode shows "General assistant" and never inherits ticket context; Ticket mode shows "Using Ticket #[number] context" and uses the selected ticket details, thread, customer, model, notes, and approved Knowledge Vault sources.
- Tessario Assist includes natural message bubbles, subtle suggested prompts behind a Suggestions disclosure, a bottom composer with Enter-to-send and Shift+Enter line breaks, Copy response, Ticket-mode Insert draft, Clear chat, a collapsible Sources area, and a visible rep-review safety note.
- Tessario Knowledge Vault starts empty and accepts local metadata uploads for PDF, DOCX, TXT, CSV, XLSX, PNG, and JPG files.
- Uploaded Tessario Knowledge Vault file metadata includes file name, type, size, upload date, uploaded by, category, status, Approved for Tessario Assist, Internal only, Customer-facing allowed, owner, description, and review date.
- Admins can upload files, answer the post-upload "Approve this file for Tessario Assist?" prompt, edit metadata, remove files, approve files for Tessario Assist, and mark files Draft, Needs Review, Approved, or Outdated.
- Tessario Assist detects approved Tessario Knowledge Vault files and shows source availability separately from ticket context in the collapsible Sources area.
- If an approved source filename includes "iSpring" or "Master Support," Tessario Assist treats it as the approved iSpring support source for mock MVP grounding.
- Real PDF/DOCX parsing will require backend file storage and text extraction before Tessario Assist can answer from document contents.
- Assignment workload counts active Open tickets while excluding Closed tickets. Legacy Resolved data displays as Closed.
- Admin-only assignment pool screen for CS14 Robert with mock user roles, workload counts, enable/disable controls, add-rep flow, removal warnings, and manual reassignment actions.
- My Profile settings modal with Account, Preferences, Signature, Notifications, Assist, and Workspace tabs, seeded for CS14 Robert as an Admin.
- Profile settings persist to `localStorage`, show a success toast on save, update the top-right display name, and apply practical preferences for queue mode, compact/density, metrics visibility, theme, accent color, sidebar default, default landing view, and default sort.
- Signature settings include a personal signature editor, department signature preview, default signature option, and optional signature insertion into customer replies.
- Assist settings include mock toggles for enabling Tessario Assist, ticket context, draft insertion, and required rep review before sending.
- Workspace profile tab shows the active iSpring Water Systems workspace, 3-CS department, Support queue, assignment eligibility, AI assignment workload count, and an admin-only link to the assignment pool.
- Mock assignment users: CS14 Robert, CS1 Nick, CS2 Julius, CS3 Sean, CS4 Jonathan, and CS5 Michelle.
- Customer History modal from Ticket Detail and queue customer links, matched by customer email address only, with compact counts, clickable history tickets, and email-change confirmation because email is the history key.
- Collapsed sidebar has a pinned left-edge reopen control with an "Expand sidebar" tooltip.
- Buttons use subtle tactile hover/click motion for primary queue and ticket-work actions.
- Primary actions use Tessario Blue with Bright Blue hover, positive states use Tessario Cyan or Blue, focus rings use Tessario Cyan, important Tessario AI accents use Violet, and queue/table hover/selected states use soft blue/violet-tinted treatments.
- Production-polish pass keeps the top bar focused on essentials, moves secondary visibility controls closer to the queue, and uses a more consistent visual system for buttons, inputs, tables, modals, cards, empty states, thread messages, and the reply composer.
- Hundreds of realistic iSpring mock tickets across multiple customer emails for Customer History, assignment, attachment, and long-thread testing.
- Example support rep is CS14 Robert across mock assignees, user profile, timelines, metrics, and macro signatures.
- Default queue view shows open active mock tickets so first load does not filter the queue empty.
- Mock ticket data is schema-validated before reusing `localStorage`; invalid or stale local data is replaced with the default 10-ticket dataset.
- Macro search, category filters, pinned macros, insert/copy actions, and variable replacement.
- iSpring-specific macros, product guidance, replacement-part copy, review links, and guardrails are read from the active workspace config rather than hardcoded into generic Tessario UI sections.
- Reply composer uses a helpdesk-style Tessario layout with From, Recipients, canned response selector, formatting toolbar, large editor, attachment drop zone, signature options, Save Draft, Attach, and Send Reply/Add Note actions.
- Macro categories: Warranty / Receipt, Replacement Parts, RO Troubleshooting, Tankless RO, Whole House, Returns, Reviews, and Water Tests.
- Strong daily iSpring-style support macros for receipt requests, warranty registration completed, replacement parts plus review request, tank pressure reset, tankless reset/rinse, whole-house pressure drop, returns, review follow-up, and water-test follow-up.
- Suggested macros are surfaced as quick actions, with the full macro list tucked into an expandable drawer.
- Clear filters empty state.
- Create Ticket X and Cancel buttons close without submitting or triggering required-field validation.
- Strong search across ticket number, subject, customer, email, model, order number, assigned rep, internal issue tags, missing info, and conversation message text.
- Create Ticket shows only required customer name, customer email, subject, and message/reason fields by default, with phone, model, order number, purchase source, and issue type tucked into Advanced details.
- Create Ticket assigns the next available persisted six-digit ticket number, displays it as `Ticket #100001`, assigns manual tickets to the creating rep, prepares an outbound customer notification from `support@ispringfilters.com`, closes the modal, and opens the new ticket.
- Create Ticket uses optional Issue type instead of a visible Tags field; internal issue/category tags remain available for search and diagnosis.
- Keyboard shortcut hint: `/` focuses global search.
- `localStorage` persistence for the mock ticket workspace.

## Known Issues

- No real backend, database, auth, email ingestion, or role permissions yet.
- `localStorage` is used for persistence. The app now validates the saved mock-ticket schema and reseeds default data when stale data is detected.
- Attachment previews use mock inline/modal rendering until real backend file storage and downloads exist.
- Copy actions use `navigator.clipboard` and may silently do nothing if the browser blocks clipboard access.
- The app is optimized for desktop. Smaller screens are not the current priority.
- Next Best Step guidance is rule/mock-data based. AI Assignment is currently mock fair-routing logic, not a real AI service.
- Vercel deployment should serve static files, but `server.mjs` is local-only.

## Next Planned Upgrades

- Split `app.js` into smaller modules for mock data, rendering, macros, and utilities.
- Add a manual reset/demo data button for support demos.
- Add a richer ticket creation/editing flow with product/order/warranty fields.
- Add saved custom views and visible column preferences.
- Add richer AI routing rules for specialized queues, PTO/coverage, language skills, product specialization, and manager overrides.
- Add admin audit history for assignment pool changes.
- Add a real macro drawer with categories, favorites, previews, and personal/team/admin macro types.
- Add better attachment preview modals for photos and PDFs.
- Expand the Dashboard with richer manager views for workload forecasting, SLA breach causes, oldest tickets, and escalation coaching.
- Add mock order/warranty lookup panels before wiring real integrations.
- Add tests or scripted browser checks for core UI flows.

