# ContextSwitch — Frontend PRD

*Frontend scope only — Dashboard, Resume Briefing, and Patterns views*

**Project:** ContextSwitch
**Event:** Codex Community Hackathon (OpenAI Codex Ambassadors), TinkerSpace, Calicut
**Track:** Next-Gen Productivity & Automation
**Scope of this document:** Frontend implementation only — backend and Codex API integration are covered in a separate document
**Status:** Completed & Integrated (Connected to Live Backend API)

---

## 1. Purpose of This Document

This PRD defines the frontend of ContextSwitch: what it looks like, what it shows, how it's structured, and what data it needs — independent of backend or AI integration, which are tracked separately. This scope is intentionally isolated so frontend work can proceed against realistic mock data before the backend and Codex reasoning layer exist.

## 2. Problem Being Visualized

Developers juggling multiple concurrent projects lose time reconstructing context every time they return to paused work. The frontend's job is to make that context immediately visible and legible — at a glance from the dashboard, and in depth from the resume briefing — without requiring the user to dig through raw files or git history themselves.

## 3. Frontend Scope

**In scope for this document:**
- Dashboard (home view) — grid of tracked projects
- Resume Briefing view — per-project detail screen
- Patterns view — cross-project chart and insight
- Sidebar — persistent project switcher and navigation
- Mock data layer — realistic stand-in data matching the real snapshot shape

**Out of scope for this document:**
- Express API / backend server
- Snapshot capture engine (git, test, TODO parsing)
- Codex API calls and prompt design
- Authentication or multi-user support

## 4. Design System

### 4.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background | `#FFF8ED` | App background — bright warm ivory |
| Panel | `#FFFFFF` | Cards, panels, sidebar |
| Border | `#EDE0CC` | Hairline borders between elements |
| Text | `#2B2118` | Primary text — warm near-black |
| Muted text | `#8F7D68` | Secondary/meta text |
| Accent | `#F2542D` | Single bold focal element per screen only |
| Status — Clean | `#3FA34D` | Status pill / clean state |
| Status — Warning | `#E8A93B` | Status pill / unresolved TODOs |
| Status — Failing | `#D93F3F` | Status pill / failing tests |

### 4.2 Typography

- **Inter** — all UI text, headings, body copy
- **JetBrains Mono** — code references only: file names, branch names, diff stats, test names

### 4.3 Layout Principles

- Flat panels with hairline borders — no uniform rounded-card sameness, no heavy shadows
- One bold highlighted element per screen (the accent-filled callout) — everything else stays quiet
- Persistent left sidebar for navigation and project switching

## 5. Screens & Components

### 5.1 Sidebar (persistent)

Always visible on the left. Contains:
- App name and short tagline
- Navigation: Dashboard, Patterns
- Scrollable list of tracked projects, each with a status pill
- Clicking a project opens its Resume Briefing view

### 5.2 Dashboard (home view)

A grid of project cards. Each card shows:
- Project name
- Status pill (Clean / Unresolved TODOs / Failing tests)
- One-line preview of what was last happening
- Last-paused relative time and branch name (monospace)

Clicking a card opens that project's Resume Briefing view.

### 5.3 Resume Briefing View

The core screen, opened per project. Contains:
- Project name and branch
- A short narrative summary (2–3 sentences) of what was in progress
- A bold "Suggested Next Step" callout — the one visually bold element on the page
- An "Unresolved" panel — failing tests and open TODOs, each with a file:line reference
- A "Files Touched" panel — filenames with added/removed line counts
- A vertical session timeline — past paused sessions for this project, each with date and short note

### 5.4 Patterns View

Contains:
- A horizontal bar chart (Recharts) of recurring "stuck" themes across all tracked projects
- A highlighted insight callout — one to two sentences describing the strongest pattern

## 6. Mock Data Requirements

Until the backend exists, the frontend runs against mock data shaped identically to the real snapshot object, so swapping in live data later requires no structural changes. Mock data should include:
- At least 3 example projects with varied, realistic states (one with a failing test, one with minor TODOs only, one clean)
- A 3–4 entry session timeline per project
- Believable aggregate data for the Patterns view across all mock projects

## 7. Frontend Tech Stack

| Layer | Tool |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS with custom theme tokens |
| Charts | Recharts |
| State | Local component state (no router/state library needed at this scope) |
| Build assistance | Antigravity (agentic IDE scaffolding) |

## 8. Success Criteria for Frontend Milestone

- App runs cleanly with `npm install && npm run dev`, no console errors
- All three views (Dashboard, Resume Briefing, Patterns) are navigable and populated with realistic mock data
- Visual design reads as intentional and warm/bright — not a generic dark SaaS dashboard or AI-gradient default
- Component structure is clean enough that mock data can be swapped for live API responses without restructuring components

## 9. Next Steps (outside this document's scope)

Once the frontend milestone is complete: backend snapshot engine (git/test/TODO capture, SQLite storage, REST endpoints), then Codex API integration for the resume briefing and pattern-detection reasoning calls.

## 10. Implementation & Verification Summary

- **App Root & Orchestrator:** [App.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/App.tsx) — Zero-fallback live state orchestration, connected to `http://localhost:4000`, live badge indicator, clean empty-state fallback.
- **Design System & Layout:** [index.css](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/index.css), [tailwind.config.js](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/tailwind.config.js) — Warm Ivory (`#FFF8ED`), Terracotta accent (`#F2542D`), Inter and JetBrains Mono typography, status pills.
- **Components:**
  - [Sidebar.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/layout/Sidebar.tsx) — Persistent navigation, live project list with status indicators.
  - [DashboardView.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/dashboard/DashboardView.tsx) — Responsive project cards grid, quick search, status filtering, one-line context preview.
  - [BriefingView.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/briefing/BriefingView.tsx) — Codex-driven resume narrative, instant snapshot capture trigger, copyable terminal commands.
  - [NextStepCallout.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/briefing/NextStepCallout.tsx) — Terracotta focal element with 1-click clipboard copy and toast feedback.
  - [UnresolvedPanel.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/briefing/UnresolvedPanel.tsx) — Failing tests and source TODOs with line numbers.
  - [FilesTouchedPanel.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/briefing/FilesTouchedPanel.tsx) — Changed files with additions/deletions diff counts.
  - [SessionTimeline.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/briefing/SessionTimeline.tsx) — Vertical session history fetched from `GET /snapshots/:projectId`.
  - [PatternsView.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/patterns/PatternsView.tsx) — Cross-project bottleneck themes, Recharts horizontal breakdown, and Codex recommendations.
  - [LoadingSkeleton.tsx](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/components/common/LoadingSkeleton.tsx) — Subtle shimmering placeholders matching the ivory theme.
- **Live API Service:** [api.ts](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/src/services/api.ts) — Typed fetch client for `GET /projects`, `GET /resume/:id`, `GET /snapshots/:id`, `GET /patterns`, and `POST /snapshot/:id`.

