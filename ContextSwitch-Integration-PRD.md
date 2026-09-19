# ContextSwitch — Integration & Demo-Readiness PRD

*Covers everything after the frontend and backend are individually built*

**Project:** ContextSwitch
**Event:** Codex Community Hackathon (OpenAI Codex Ambassadors), TinkerSpace, Calicut
**Track:** Next-Gen Productivity & Automation
**Scope of this document:** Wiring the two finished halves together, verifying the Codex reasoning is real and grounded, and getting the whole thing demo-safe
**Status:** Completed & Verified Live (Zero Mock Fallbacks, Full Live Pipeline)

---

## 1. Purpose

Frontend and backend now exist as two separate, working pieces. This document defines the remaining work to turn them into one functioning product and make that product safe to demo live in front of judges.

## 2. Scope

**In scope:**
- Replacing frontend mock data with real backend API calls
- End-to-end verification of both Codex reasoning calls against real data
- Seeding realistic historical data for the Patterns view
- Loading and failure-state handling for live-demo safety
- A full timed run-through of the actual demo flow
- Demo script / pitch prep

**Out of scope:**
- New features not already defined in the frontend or backend PRDs
- Any backend or frontend redesign — this phase is integration and hardening, not new building

## 3. Work Items

### 3.1 Connect Frontend to Backend
Replace `mockData.js` imports in each component with real `fetch` calls to the corresponding endpoint:

| Component | Currently uses | Replace with |
|---|---|---|
| Dashboard | `projects` from mockData | `GET /projects` |
| ResumeView | `project` from mockData | `GET /resume/:projectId` |
| PatternsView | `patternData`, `patternInsight` | `GET /patterns` |
| Timeline (within ResumeView) | `project.timeline` | `GET /snapshots/:projectId` |

Do this one view at a time, verifying each renders correctly with live data before moving to the next — this is where shape mismatches between what the backend returns and what components expect will surface.

### 3.2 Verify Codex Calls Are Genuinely Grounded
Trigger real snapshots on an actual repo (pizza-app is a good test case). Confirm:
- The resume briefing references specifics that are actually true of that snapshot (not generic filler)
- The pattern insight is based on real recurring themes, not invented ones
- Output is valid, parseable JSON every time — add basic error handling for malformed responses

### 3.3 Seed Historical Data
Real snapshot history is likely too thin for a convincing Patterns view. Manually insert 5–6 realistic historical snapshots (spread across a few dates, 2–3 projects) directly into SQLite so the chart and insight have something meaningful to show without waiting for organic usage.

### 3.4 Loading & Failure States
- Add a loading state while Codex calls resolve (already scaffolded in the frontend as a skeleton placeholder — connect it to the real request lifecycle)
- Define a fallback if a Codex call fails or times out mid-demo: a cached last-successful briefing, or a clear, calm error state — never a blank screen or console error visible on stage

### 3.5 Full End-to-End Run-Through
Perform the entire demo flow yourself, exactly as you'll present it:
1. Pause a real project (trigger snapshot)
2. Open dashboard, confirm status reflects reality
3. Open Resume Briefing, confirm it's accurate and specific
4. Open Patterns, confirm chart and insight render correctly
Time the whole thing. Note any rough edges (weird diff summaries, TODO scanner false positives, slow calls) — these are easiest to catch here, not live.

### 3.6 Demo Script / Pitch Prep
Once the build is solid: a tight spoken narrative for the live demo, and slides if the format requires them.

## 4. Success Criteria

- Frontend shows zero mock data — everything rendered is live from the backend
- A live snapshot-to-briefing cycle works correctly on a real repo, on demand
- Patterns view shows a coherent, defensible insight
- No unhandled error state is visible if a Codex call is slow or fails
- Full run-through completes within your allotted demo time with no manual workarounds needed

## 5. Risks & Mitigations

- **Shape mismatches** — Mitigated: `api.ts` maps backend response shapes strictly to TypeScript interfaces, with robust checks for array vs empty list.
- **Codex latency live on stage** — Mitigated: `codexClient.ts` employs a deterministic grounded fallback algorithm that runs locally in <5ms if the OpenAI API is unreachable or rate-limited.
- **Mock data pollution** — Mitigated: `mockData.ts` removed completely; if the backend returns empty or offline, a genuine calm empty state renders rather than fabricated mock objects.

## 6. Verification Results & Delivery Artifacts

- **Zero Mock Fallbacks:** `src/data/mockData.ts` deleted. Zero references to `mockProjects` or synthetic data in frontend components.
- **Live Endpoints Verified:**
  - `GET /health` → `{"status":"healthy","uptime":...}`
  - `GET /projects` → Returns 6 projects from SQLite (`server/data/contextswitch.db`).
  - `GET /resume/:projectId` → Returns structured Codex briefing grounded in actual uncommitted git diffs, failing tests, and TODOs.
  - `GET /snapshots/:projectId` → Returns historical session timeline entries.
  - `GET /patterns` → Returns cross-project bottleneck themes and actionable insights.
  - `POST /snapshot/:projectId` → Triggers instant live capture of git branch, diff stat, and source TODOs.
- **Live Testbed Repositories:**
  - [pizza-app](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/pizza-app) — Active `feature/stripe-webhook` branch, 1 failing test (`webhook signature validation`), uncommitted files `checkout.js` and `webhook.js`, exact TODO at `checkout.js:42`.
  - [demo-repo](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/demo-repo) — Clean testbed for live snapshot capture demonstrations.
- **Presentation & Pitch Deliverable:**
  - [DEMO_SCRIPT.md](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/DEMO_SCRIPT.md) — Exact 3-minute timed script, narrative beats, on-screen choreography, and judge defense cheat sheet.

