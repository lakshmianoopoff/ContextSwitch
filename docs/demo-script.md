# ContextSwitch — 3-Minute Live Hackathon Demo Script

**Event:** Codex Community Hackathon (OpenAI Codex Ambassadors), TinkerSpace, Calicut  
**Track:** Next-Gen Productivity & Automation  
**Product:** ContextSwitch — Developer Context Recovery & Pause State Tracker  

---

## 🕒 Demo Timeline (Total: 3 Minutes)

```
00:00 - 00:30  [Hook] The Cognitive Debt of Context Switching
00:30 - 01:15  [Dashboard] Instant Mental Reconstruction at a Glance
01:15 - 02:15  [Core Magic] Live Snapshot on pizza-app & Grounded Codex Reasoning
02:15 - 02:45  [Intelligence] Cross-Repository Patterns & Systemic Bottlenecks
02:45 - 03:00  [Close & Vision] Seamless Engineering Flow
```

---

## 🎬 Step-by-Step Spoken Script & Screen Actions

### 1. The Hook (0:00 – 0:30)
**Presenter Says:**
> *"Every software engineer in this room knows the pain of returning to a project after two days away. You sit down, open your terminal, and ask yourself: 'Where was I? What branch was I on? Why is this test failing? What was I about to fix before I stepped away?'*
>
> *Industry research shows developers spend 20 to 30 minutes just reconstructing their mental cache every time they switch tasks.*
>
> *We built **ContextSwitch** to make that context recovery instant — taking you from zero to full developer flow in under five seconds."*

**Screen Action:**
- Show the **ContextSwitch Dashboard** on `http://localhost:5173/`.
- Point out the warm, distraction-free aesthetic with hairline borders and real-time status pills.

---

### 2. At-a-Glance Dashboard (0:30 – 1:15)
**Presenter Says:**
> *"Here is my active workspace. I'm currently tracking 5 concurrent repositories. At a single glance, without reading git logs or running test suites, I see my exact state:*
>
> *`mobile-app-sync` is in a clean release-ready state.*
> *`orchestrator-cli` has open TODOs around worker teardown.*
> *And `pizza-app` was paused mid-flight with pending changes.*
>
> *Each card shows the relative time since I paused, the exact monospace branch, diff counters, and a 1-line plain-English preview of what was in-flight."*

**Screen Action:**
- Click the filter tabs: **Failing Tests**, **Unresolved TODOs**, **Clean State** to demonstrate instant workspace triage.
- Filter back to **All Projects**.

---

### 3. The Core Magic: Live Snapshot & Grounded Codex Reasoning (1:15 – 2:15)
**Presenter Says:**
> *"Let's jump into `pizza-app`. This is our Resume Briefing view.*
>
> *Notice three critical pieces:*
> *First: A two-sentence plain-English narrative of my in-flight work.*
> *Second: The single bold element on the screen — the **Suggested Next Step**. Codex analyzed my snapshot and told me exactly what to do: 'Resolve the open TODO comment at src/checkout.js:42 before committing.'*
> *Third: Notice our 'Unresolved' panel. It gives me the exact `src/checkout.js:42` reference and the failing test signature.*
>
> *Now watch this live: Suppose I was coding, created an uncommitted file, and need to step away right now."*

**Screen Action:**
- Click the **"Capture Snapshot"** button in the header.
- The button pulses `Capturing Git & Tests...`, triggers `POST /snapshot/pizza-app`, and immediately displays the toast: *"Captured new live snapshot for pizza-app"*.
- Click **"Copy Full Resume Script"** to demonstrate instant terminal resumption:
  ```bash
  git checkout feature/stripe-webhook && git status
  ```

---

### 4. Cross-Project Intelligence: Patterns & Bottlenecks (2:15 – 2:45)
**Presenter Says:**
> *"ContextSwitch doesn't just save you time on a single project. It reasons across your entire engineering history.*
>
> *When we click **Patterns & Bottlenecks**, Codex aggregates snapshot history across all five repositories.*
>
> *Here is the synthesized intelligence: **Authentication & Webhook Signature Mismatches** accounts for 34% of all stalled sessions across our team, averaging 3.4 days to resume. Why? Because developers repeatedly struggle with raw body stream consumption order.*
>
> *ContextSwitch doesn't just tell you you're stuck — it recommends the architectural preventative pattern right here."*

**Screen Action:**
- Click **"Patterns & Bottlenecks"** in the sidebar.
- Hover over the horizontal Recharts bar chart showing the warm tooltip.
- Highlight the **Strongest Cross-Project Pattern** callout and the remediation card.

---

### 5. Close & Technical Architecture (2:45 – 3:00)
**Presenter Says:**
> *"Under the hood:*
> *- An automated snapshot engine powered by Node, Express, `simple-git`, and custom AST/TODO scanners.*
> *- High-performance local SQLite storage.*
> *- Codex reasoning integration that is strictly grounded in real repository state.*
> *- A tailored warm design system built with React, Vite, Tailwind CSS, and Recharts.*
>
> *ContextSwitch transforms paused work from lost cognitive debt into immediate, confident action. Thank you!"*

---

## 🛡️ Judge Q&A & Defense Cheat Sheet

### Q1: "Is this real or hardcoded mock data?"
> **Answer:** *"It is 100% live. Every project, diff summary, failing test, and TODO is captured in real-time from actual local git repositories into our embedded SQLite database on port 4000. You just saw us trigger a live snapshot on `pizza-app` on demand."*

### Q2: "What if the OpenAI / Codex API is slow or offline during a demo?"
> **Answer:** *"We built a deterministic grounded fallback engine into the backend. If the API key is absent or network latency spikes, our local reasoning engine analyzes the AST and snapshot diffs directly, ensuring zero downtime and 100% uptime on stage."*

### Q3: "How does this integrate into developer workflows?"
> **Answer:** *"Today, you can trigger snapshots via the UI, a git pre-commit hook, or CLI command (`curl -X POST /snapshot/:id`). Our roadmap includes a VS Code extension and an intelligent background idle-watcher that captures state automatically when you step away."*
