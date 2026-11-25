# SurStor Dashboard

A standalone dashboard for AI usage, token counts, and costs, extracted from the SurStor website. Licensed under Apache 2.0.

## Features

- Email/password accounts and private workspaces backed by Supabase.
- Usage grouped by provider, model, and tool, with 7- and 30-day reporting periods.
- Separate reported costs and estimates for each currency.
- Named, revocable upload tokens with last-used timestamps.
- Metadata-only reporting API, duplicate protection, field-specific errors, and connection checks.
- Recent-event deletion and a fictional sample dashboard.
- Integration instructions for Claude Code, Cursor, Claude Desktop, and direct HTTPS.

The root `/` opens your workspace. `/dashboard` shows fictional sample data; `/dashboard/personal` remains a supported workspace URL. This repository contains the hosted dashboard and API, not the SurStor memory engine or Python bridge source. The guide links to the publicly downloadable bridge.

## Run the sample locally

Requires Node.js 22.12+ and npm.

```sh
git clone https://github.com/SurStor/SurStor_Dashboard.git
cd SurStor_Dashboard
npm ci
npm run dev
```

Open http://localhost:3000/dashboard. Vite alone serves the interface and sample; account login and reporting require the server functions and Supabase described below.

## Deploy your own dashboard

1. Create a Supabase project. Apply every SQL file in `supabase/migrations/` in filename order using the SQL editor or Supabase CLI. Use a new project for an independent deployment; do not mix it with another installation's accounts accidentally.
2. Enable the Email authentication provider and email/password sign-in. The current create-account screen expects an immediate session: disable **Confirm email** to match it. This allows signup without proving inbox ownership. If you retain confirmation, confirm the email first and then sign in; the current signup message is generic. Anonymous sign-in is not required for new installations (the schema retains compatibility with older anonymous workspaces).
3. Import this repository into Vercel. Use the repository root, Vite framework, `npm run build`, and output directory `dist` (also specified in `vercel.json`). The `api/` directory supplies server functions; static-only hosting does not run them.
4. Add the server environment settings from `.env.example`: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`. Legacy `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` names are also accepted. Never put a secret/service-role key in browser code or a `VITE_` variable.
5. Set Supabase's Site URL to your deployment origin and allow your `/dashboard/personal` URL in its redirect settings. Deploy, create an account, and create an upload token.

For local full-stack development, configure a local `.env.local` using `.env.example` and run `npx vercel dev` after linking a Vercel project. Use a development Supabase project. Do not commit environment files.

## Connect an agent

Open the dashboard's **Connect an AI agent or IDE** section. Its instructions use the current deployment's origin. Set both `SURSTOR_USAGE_URL` (your HTTPS origin) and `SURSTOR_USAGE_TOKEN` (a token created in that installation). Tokens belong to the Supabase project that issued them.

The Python bridge is separately distributed at:
https://www.surstor.net/downloads/surstor_usage_mcp-0.2.0-py3-none-any.whl

MCP alone does not collect host usage. The bridge includes a Claude Code hook; other integrations must supply actual per-request counts. Automatic collection has synthetic-fixture tests; an actual Claude Code session is still a separate integration verification step.

## API

- `GET /api/dashboard-config`: public Supabase URL and publishable key only.
- `POST /api/check-connection`: checks a Bearer upload token without creating an event.
- `POST /api/events`: accepts one allowlisted metadata event with Bearer authentication.
- `POST /api/agent-session`: legacy email/password reporting-session exchange; new integrations should use upload tokens.

See [the event contract](public/downloads/event-contract.md) and [JSON Schema](public/downloads/event-schema.json). Successful new events return 201; identical retries return 200 with `duplicate: true`; conflicting IDs return 409. Invalid fields return 422, invalid credentials 401.

No prompts, responses, file contents, or tool arguments belong in reporting events. Supabase row ownership and restricted database functions isolate workspaces. Deployers remain responsible for abuse controls, backups, retention policies, and their own operating environment.

## Development checks

```sh
npm test
npm run build
```

Tests cover validation, duplicate/conflict responses, database permissions, account isolation, revocation, and migration behavior using an in-memory PostgreSQL-compatible database. No production account is needed. GitHub Actions runs tests and the build.

## Project layout

- `src/pages/`: real workspace and sample dashboard.
- `src/components/`: upload tokens, recent usage, integration guide.
- `api/`, `lib-api.js`, `lib-upload-session.js`: Vercel reporting functions.
- `supabase/migrations/`: ordered database setup.
- `public/downloads/`: event contract and JSON Schema.
- `tests/`: API and database regression tests.

## License and provenance

[Apache License 2.0](LICENSE). Copyright 2026 SurStor contributors. Extracted from `Sebpereira33/SurStor_EU_Act` at commit `b1afd37`, with standalone routing, build configuration, styles, and deployment-aware connection instructions. The marketing website and its deployment remain separate. Dependency licenses remain with their authors; see [NOTICE](NOTICE).
