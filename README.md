# ContextSwitch ⚡

> **Developer Context Recovery Engine**  
> *Turn 20 minutes of mental reconstruction into a 15-second resume briefing.*

[![Hackathon](https://img.shields.io/badge/Codex%20Community%20Hackathon-TinkerSpace%20Calicut-orange?style=flat-square)](https://openai.com)
[![Track](https://img.shields.io/badge/Track-Next--Gen%20Productivity%20%26%20Automation-red?style=flat-square)]()
[![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Node%20Express%20%7C%20SQLite%20%7C%20Codex-amber?style=flat-square)]()
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)]()

---

## 🎯 Executive Summary & Problem

Software engineers spend up to **30% of their workday context switching** between microservices, client repositories, and unmerged feature branches. Every pause leaves behind a wake of half-remembered intentions:
- *What branch was I on?*
- *Why is this test suite failing?*
- *Which uncommitted file contains my in-flight work?*
- *What was the exact next step I intended to execute?*

Existing tools (stash managers, browser tabs, manual markdown notes) either provide **too much raw noise** (unfiltered `git diff` outputs) or **too little synthesis**.

**ContextSwitch** solves this through a 3-layer architecture:
1. **Deterministic Grounded Snapshot Capture:** Tracks uncommitted git diffs, failing test suites, and line-specific `// TODO:` comments across local repositories.
2. **Codex AI Reasoning Layer:** Synthesizes raw snapshot telemetry into a high-signal 3-sentence narrative, extracts the exact blocking test or TODO, and prescribes a **single copyable terminal command** to get back to flow.
3. **Cross-Project Pattern Intelligence:** Detects systemic bottlenecks across multi-repo workflows (e.g., recurring webhook HMAC serialization issues, missing Redis fixtures) to help teams eliminate recurring friction.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend (React 18 + Vite · Port 5173)"]
        UI_Dash["Dashboard View<br/>(Tracked Repos & Health)"]
        UI_Brief["Resume Briefing View<br/>(AI Narrative & Next Step)"]
        UI_Pat["Patterns View<br/>(Cross-Project Bottlenecks)"]
        API_Client["Typed API Service (src/services/api.ts)"]
    end

    subgraph Server ["Backend (Node Express + TypeScript · Port 4000)"]
        Routes["REST Endpoints (/projects, /resume, /patterns)"]
        GitCap["Git Capture (simple-git)"]
        TestCap["Test Parser (Jest / Mocha output)"]
        TodoScan["Source TODO Scanner"]
        Codex["Codex Reasoning Engine (Structured JSON)"]
        DB[(SQLite Persistent Store<br/>better-sqlite3)]
    end

    subgraph Repos ["Live Local Testbeds"]
        PizzaApp["pizza-app/<br/>(feat/stripe-webhook · failing tests · line 42 TODO)"]
        DemoRepo["demo-repo/<br/>(clean repository for live capture demos)"]
    end

    UI_Dash --> API_Client
    UI_Brief --> API_Client
    UI_Pat --> API_Client
    API_Client <-->|REST JSON| Routes

    Routes --> GitCap
    Routes --> TestCap
    Routes --> TodoScan
    Routes <--> DB
    Routes <--> Codex

    GitCap --> Repos
    TestCap --> Repos
    TodoScan --> Repos
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Installed and available on system path

### 1. Installation
Clone the repository and install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configuration
Copy the sample environment file in `server/`:

```bash
cp server/.env.example server/.env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend Express API port | `4000` |
| `OPENAI_API_KEY` | Optional OpenAI key for Codex reasoning | *(Optional)* |
| `OPENAI_MODEL` | Codex / GPT reasoning model | `gpt-4o` |
| `DATABASE_PATH` | Path to SQLite database file | `./data/contextswitch.db` |

> 💡 **Demo-Safe Architecture:** If `OPENAI_API_KEY` is not provided, ContextSwitch automatically switches to a deterministic grounded reasoning fallback. This guarantees **100% demo safety on stage** with zero network dropouts or rate-limit failures.

### 3. Initialize Database
Seed the local SQLite database with realistic developer pause histories across 6 active services:

```bash
npm run seed
```

### 4. Start Development Servers
You can run the backend and frontend in separate terminals:

```bash
# Terminal 1: Start Backend (Port 4000)
npm run server

# Terminal 2: Start Frontend (Port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Live Testbed Repositories

ContextSwitch includes two pre-configured local git repositories ready for live capture demonstrations:

### 1. `pizza-app/` — Realistic Developer In-Flight Pause
- **Active Branch:** `feature/stripe-webhook`
- **Uncommitted Files:** `checkout.js`, `webhook.js`
- **Diff Stat:** `checkout.js (+42/-3), webhook.js (+15/-0)`
- **Failing Test:** `webhook signature verification on chunked payload`
- **Source Code Anchor:** Line 42 of `checkout.js`:
  ```javascript
  // TODO: fix signature validation before bodyParser consumes raw stream
  ```

### 2. `demo-repo/` — Clean Testbed for Real-Time Snapshots
- Ideal for demonstrating live snapshot capture during an interview or pitch.
- Edit any file, add a `// TODO:`, and press **"Take Snapshot"** in the UI to watch the timeline and briefing update in real-time.

---

## 📡 REST API Reference

The backend exposes a clean, typed REST API on port `4000`:

| Method | Endpoint | Description | Sample Response |
|---|---|---|---|
| `GET` | `/health` | Healthcheck & server uptime | `{"status":"healthy","uptime":312}` |
| `GET` | `/projects` | Get all tracked projects with latest status | `[{"id":"proj-1","name":"payment-service",...}]` |
| `GET` | `/snapshots/:projectId` | Full session timeline for a project | `{"projectId":"pizza-app","timeline":[...]}` |
| `GET` | `/resume/:projectId` | Codex-generated resume briefing & next step | `{"briefing":{"summary":"...","nextStep":"..."}}` |
| `GET` | `/patterns` | Cross-project bottleneck themes & insights | `{"topPatterns":[...],"insight":"..."}` |
| `POST` | `/snapshot/:projectId` | Trigger instant git/test/TODO capture | `{"success":true,"snapshot":{...}}` |

---

## 🎨 Design System & Aesthetics

ContextSwitch rejects generic SaaS dark modes and low-contrast AI gradients in favor of an **editorial, human-centric design system**:

- **Warm Ivory Canvas (`#FFF8ED`):** High-legibility, warm background inspired by physical notebooks and print typography.
- **Pure Terracotta Accent (`#F2542D`):** Strictly reserved for the single most important action per view (**Suggested Next Step**).
- **Hairline Micro-Borders (`#EDE0CC`):** Crisp structural division without heavy box shadows.
- **Dual Typography:**
  - **Inter:** UI labels, narratives, descriptions, and headings.
  - **JetBrains Mono:** Code paths, git branches, diff stats (`+42/-3`), and copyable terminal commands.
- **1-Click Command Copying:** Interactive code callouts with instant clipboard copy and visual toast feedback.

---

## 📦 Project Directory Structure

```text
ContextSwitch/
├── .gitignore                    # Git exclusions (build, logs, caches)
├── ContextSwitch-Frontend-PRD.md # Frontend Product Requirements Document
├── ContextSwitch-Backend-PRD.md  # Backend Product Requirements Document
├── ContextSwitch-Integration-PRD.md # Integration & Verification Document
├── DEMO_SCRIPT.md                # 3-Minute Live Hackathon Pitch Script
├── README.md                     # Root Project Documentation (You are here)
├── package.json                  # Root scripts (dev, build, server, seed)
├── tsconfig.json                 # TypeScript project configuration
├── vite.config.ts                # Vite frontend bundler configuration
│
├── src/                          # Frontend Application (React 18 + TS)
│   ├── App.tsx                   # Live state coordinator & routing
│   ├── main.tsx                  # React DOM entrypoint
│   ├── index.css                 # Custom design tokens & base styling
│   ├── components/
│   │   ├── layout/Sidebar.tsx    # Persistent navigation & project switcher
│   │   ├── dashboard/DashboardView.tsx # Project card grid & health search
│   │   ├── briefing/             # Resume Briefing Detail View
│   │   │   ├── BriefingView.tsx  # Main briefing coordinator
│   │   │   ├── NextStepCallout.tsx # Terracotta single action callout
│   │   │   ├── UnresolvedPanel.tsx # Failing tests & source TODOs
│   │   │   ├── FilesTouchedPanel.tsx # Changed files & diff stats
│   │   │   └── SessionTimeline.tsx # Historical session log
│   │   ├── patterns/PatternsView.tsx # Cross-project bottleneck analytics
│   │   └── common/LoadingSkeleton.tsx # Warm ivory loading skeletons
│   ├── services/api.ts           # Typed live fetch client (0 mock fallbacks)
│   └── types/index.ts            # Shared TypeScript interfaces
│
├── server/                       # Backend Application (Node + Express + TS)
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend scripts & dependencies
│   ├── tsconfig.json             # Backend TypeScript configuration
│   ├── data/
│   │   └── contextswitch.db      # SQLite persistent snapshot database
│   └── src/
│       ├── server.ts             # Express server setup (Port 4000)
│       ├── types.ts              # Backend data contracts
│       ├── db/
│       │   ├── db.ts             # SQLite connection & schema initialization
│       │   └── seed.ts           # Historical developer pause seed fixture
│       ├── engine/
│       │   ├── gitCapture.ts     # simple-git diff, branch, & commit reader
│       │   ├── testCapture.ts    # Test suite parser
│       │   ├── todoCapture.ts    # Recursive AST/Regex source code TODO scanner
│       │   └── captureEngine.ts  # Master snapshot capture orchestrator
│       ├── reasoning/
│       │   └── codexClient.ts    # Codex prompt engineering & structured JSON
│       └── routes/
│           └── snapshots.ts      # REST route handlers
│
├── pizza-app/                    # Live testbed with uncommitted changes & failing tests
└── demo-repo/                    # Live testbed for real-time snapshot captures
```

---

## 🎤 Hackathon Demo & Pitch Guide

For the live presentation in front of judges at TinkerSpace, Calicut, refer to our comprehensive script:

👉 **[DEMO_SCRIPT.md](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/DEMO_SCRIPT.md)**

Includes:
- **Exact 3-Minute Presentation Flow** with time-stamped visual cues.
- **Narrative Hook:** The real cost of multi-tasking and cognitive overload.
- **Live Action Choreography:** From paused terminal state to the instant 15-second resume briefing.
- **Judge Defense Cheat Sheet:** Answers to questions on privacy, token efficiency, IDE extensions, and capture overhead.

---

## 📄 Documentation Index

- [Frontend PRD](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/ContextSwitch-Frontend-PRD.md)
- [Backend PRD](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/ContextSwitch-Backend-PRD.md)
- [Integration PRD](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/ContextSwitch-Integration-PRD.md)
- [Live Hackathon Pitch Script](file:///c:/Users/dell/OneDrive/Desktop/ContextSwitch/DEMO_SCRIPT.md)

---

## 👥 Authors & Acknowledgments

- **Event:** OpenAI Codex Community Hackathon, TinkerSpace, Calicut
- **Track:** Next-Gen Productivity & Automation
- Built with **OpenAI Codex Reasoning**, **React 18**, **Express**, **SQLite**, and **Antigravity**.
