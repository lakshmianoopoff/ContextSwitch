# ContextSwitch — Backend PRD

*Backend scope only — snapshot engine, storage, API, and Codex reasoning integration*

**Project:** ContextSwitch
**Event:** Codex Community Hackathon (OpenAI Codex Ambassadors), TinkerSpace, Calicut
**Track:** Next-Gen Productivity & Automation
**Scope of this document:** Backend implementation only — the frontend is complete and documented separately; this covers everything the frontend currently calls with mock data and will eventually call for real
**Status:** Completed & Deployed (Running on Port 4000)

---

## 1. Purpose of This Document

This PRD defines the backend of ContextSwitch: how project state gets captured, stored, and turned into the resume briefings and pattern insights the frontend already displays. The frontend is built against mock data shaped exactly like the objects this backend will return, so this document exists to make that swap a drop-in replacement rather than a rebuild.

## 2. What the Backend Needs to Replace

The frontend currently reads from `src/data/mockData.js`. This backend must serve equivalent data through real endpoints:

| Frontend needs | Backend must provide |
|---|---|
| List of tracked projects + status | `GET /projects` |
| One project's full snapshot | `GET /snapshots/:projectId` (history, for timeline) |
| Trigger a new snapshot | `POST /snapshot/:projectId` |
| Resume briefing narrative | Codex call, returned via `GET /resume/:projectId` |
| Patterns chart + insight | Codex call, returned via `GET /patterns` |

## 3. Backend Scope

**In scope for this document:**
- Snapshot capture engine (git state, test results, TODOs)
- Local persistent storage of snapshot history
- REST API serving the frontend's data needs
- Codex API integration for both reasoning tasks (resume briefing, pattern detection)

**Out of scope for this document:**
- Frontend components and styling (already built)
- Authentication or multi-user support
- Automatic idle/pause detection (manual trigger only, for demo reliability)
- Browser tab tracking

## 4. Snapshot Data Model

The single source of truth passed between every layer:

```json
{
  "project": "pizza-app",
  "timestamp": "2026-09-19T14:00:00Z",
  "git": {
    "branch": "feature/stripe-webhook",
    "diffSummary": "checkout.js (+42/-3), webhook.js (+15/-0)",
    "lastCommitMessage": "wip",
    "uncommittedFiles": ["checkout.js", "webhook.js"]
  },
  "tests": { "failing": ["webhook_signature_test"], "passing": 12 },
  "todos": [{ "file": "checkout.js", "line": 42, "text": "fix signature validation" }]
}
```

This exact shape is what the frontend's mock data already mirrors — no field renaming needed on the frontend side when this goes live.

## 5. Snapshot Engine

### 5.1 Git Capture
Using `simple-git` against a given repo path:
- Current branch name
- Diff summary (files changed, lines added/removed) — via `git diff --stat`
- Last commit message
- List of currently uncommitted files

### 5.2 Test Result Capture
Parses `npm test` output (Jest-style format assumed for MVP) to extract:
- Names of failing tests
- Count of passing tests

### 5.3 TODO Scanner
Walks source files in the project (excluding `node_modules`, `.git`) and regex-matches `// TODO:` / `# TODO:` style comments, capturing file, line number, and comment text.

### 5.4 Trigger Model
Snapshot capture is **manually triggered** (via API call or CLI command) rather than auto-detected from idle time — chosen deliberately for demo reliability over cleverness.

## 6. Storage

- **SQLite** via `better-sqlite3` — single local file, zero external dependency, ideal for hackathon deployment.
- One `snapshots` table, each row a full snapshot record with project ID and timestamp, enabling both "latest snapshot per project" (Dashboard) and "full history per project" (Timeline, Patterns) queries.

## 7. API Endpoints

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/snapshot/:projectId` | Runs the capture engine against a given repo path, stores the result, returns it |
| `GET` | `/projects` | Returns the latest snapshot for every tracked project (Dashboard data) |
| `GET` | `/snapshots/:projectId` | Returns full snapshot history for one project (Timeline data) |
| `GET` | `/resume/:projectId` | Fetches the latest snapshot, calls Codex, returns the structured briefing |
| `GET` | `/patterns` | Fetches snapshot history across projects, calls Codex, returns chart data + insight |

CORS enabled for local dev so the Vite frontend (port 5173) can call this API (assumed to run on port 4000).

## 8. Codex Reasoning Integration

Two distinct calls — this is the core "agentic" part of the project and what differentiates it from a static session-restore tool.

### 8.1 Resume Briefing Call
**Input:** one snapshot object.
**Output (structured JSON):**
```json
{
  "summary": "2-3 sentence plain-English summary of what was in progress",
  "unresolvedNote": "what's currently broken or incomplete",
  "nextStep": "one concrete, specific suggested next action"
}
```
Constrained to reason only from the given snapshot data — no invented details.

### 8.2 Pattern Detection Call
**Input:** an array of snapshots across time and/or projects.
**Output (structured JSON):**
```json
{
  "topPatterns": [{ "theme": "short label", "count": 3 }],
  "insight": "one to two sentence actionable observation"
}
```
Identifies recurring stuck points across sessions rather than analyzing any single snapshot in isolation.

## 9. Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js |
| Server | Express |
| Git interaction | `simple-git` |
| File watching | `chokidar` |
| Storage | SQLite (`better-sqlite3`) |
| LLM reasoning | Codex API |
| Build assistance | Antigravity (agentic IDE scaffolding) |

## 10. Success Criteria for Backend Milestone

- `POST /snapshot/:projectId` correctly captures real git/test/TODO state from an actual local repo
- `GET /projects` and `GET /snapshots/:projectId` return data in the exact shape the frontend's mock data already uses, requiring no frontend refactor
- `GET /resume/:projectId` returns a Codex-generated briefing that is specific and grounded in the snapshot (not generic or hallucinated)
- `GET /patterns` returns a coherent insight once enough historical snapshots exist (seed 5–6 realistic historical snapshots before the demo if real history is too thin)
- Full loop demoable live: pause a real project, trigger a snapshot, view the resume briefing in the already-built frontend

## 11. Risks

- **Codex API latency during live demo** — mitigate with a pre-warmed call before presenting, or a cached fallback response if the API is slow/unavailable on stage.
- **Test-output parsing brittleness** — scope parsing to one test runner format (whatever the demo repo actually uses) rather than trying to generalize.
- **Thin real snapshot history** — seed historical data ahead of time so the Patterns view has something meaningful to show without waiting days for organic data.

## 12. Next Steps

Once the backend milestone is complete: connect the frontend's data layer to these live endpoints in place of `mockData.js`, then rehearse the full end-to-end demo flow on a real repo before the event.

## 13. Implementation & Delivery Summary

- **Server Entrypoint:** [server.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/server.ts) — Express HTTP API listening on port 4000 with CORS and JSON middleware.
- **Persistent Storage:** [db.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/db/db.ts) — SQLite powered by `better-sqlite3` storing historical snapshots in `server/data/contextswitch.db`.
- **Seed Fixture:** [seed.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/db/seed.ts) — Seeds 19 realistic developer pause snapshots across 6 projects (`analytics-pipeline`, `demo-repo`, `mobile-app-sync`, `orchestrator-cli`, `payment-service`, `pizza-app`).
- **Capture Engine:**
  - [gitCapture.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/engine/gitCapture.ts) — Captures branch name, diff stats (`+ins/-del`), last commit message, and uncommitted files via `simple-git`.
  - [testCapture.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/engine/testCapture.ts) — Runs and parses Jest / Mocha test outputs for failing and passing test counts.
  - [todoCapture.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/engine/todoCapture.ts) — Scans source code tree for `// TODO:` and `# TODO:` markers with line numbers.
  - [captureEngine.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/engine/captureEngine.ts) — Coordinates git, test, and TODO captures into a unified snapshot.
- **Codex Reasoning Service:** [codexClient.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/reasoning/codexClient.ts) — Structured JSON reasoning for Resume Briefings and Cross-Project Pattern Detection with deterministic grounded fallback.
- **REST Routes:** [snapshots.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/server/src/routes/snapshots.ts) — Serves `GET /projects`, `GET /snapshots/:projectId`, `GET /resume/:projectId`, `GET /patterns`, `POST /snapshot/:projectId`, and `GET /health`.

