---
name: frontend-delivery
description: Run the complete frontend delivery workflow from authoritative project docs and current source through analysis, Jira planning, specialist execution, testing, reconciliation, and final acceptance. Use when the user wants the frontend work implemented end-to-end without stopping after planning unless a real approval/blocker gate is reached.
---

# Frontend Delivery Workflow

This is a user-facing workflow entry point. It coordinates agents; it does not contain implementation knowledge.

## Intent

Run continuously from the smallest valid workflow entry until acceptance, pause, or a real blocker. Do not stop merely because Jira Tasks/Subtasks were created.

## Entry resolution

Resolve the current entry before spawning agents:

- `NEW`: no valid Jira workflow exists for the requested work.
- `RESUME`: valid Jira analysis/task tree exists and relevant requirements are unchanged.
- `REPLAN`: relevant requirements or approved architecture changed materially.
- `PAUSE`: the user explicitly asks to stop/pause an active workflow.
- `ACCEPTANCE`: executable work is complete and final acceptance is due.

Natural-language pause intent such as `dừng lại`, `tạm dừng`, `để mai làm tiếp`, or equivalent must route to `PAUSE`.

## Continuous delivery

For `NEW`:

1. Spawn Brain for bounded requirement analysis and project-stack discovery.
2. Pass the approved analysis package to Orchestrator in planning mode.
3. Orchestrator creates Jira Feature/Task/Subtask context and selects only evidence-backed internal capabilities needed by each specialist Subtask.
4. Continue automatically into dependency-ready specialist Subtasks. Do not ask for confirmation merely because planning finished.
5. Reconcile every specialist result into Jira before downstream work is unblocked.
6. When all required executable Subtasks are complete, spawn Brain for final acceptance.

For `RESUME`, skip Brain analysis and Orchestrator decomposition when Jira validity markers and relevant `.docs` baseline remain valid. Resume only the minimal current Jira chain and required specialist.

For `REPLAN`, revalidate only changed relevant requirements and replan only affected Jira scope.

For `PAUSE`, stop new dispatch and require Orchestrator pause reconciliation plus durable Jira `[HANDOFF]` before reporting a safe pause.

## Approval and blocker gates

Interrupt continuous delivery only when progress requires authority that the workflow cannot infer safely, including:

- material requirement ambiguity;
- architecture or dependency adoption not already approved by project evidence;
- destructive or externally sensitive action requiring explicit approval;
- unresolved design choice where multiple valid outcomes require human selection;
- missing required external capability;
- scope change that exceeds the current approved Jira boundary.

Do not create artificial approval gates between Brain, Jira planning, Coding, Testing, or Acceptance when the current evidence already authorizes continuation.

## Progressive disclosure

Only this workflow is user-facing. Internal agent capabilities live outside `.agents/skills/` and are loaded only by the owning agent when their trigger is satisfied. Do not expose or ask the user to invoke internal capabilities directly.

## Completion

Report `accepted` only after Brain acceptance verifies authoritative `.docs`, Jira context/results, source changes, and validation evidence. Green tests alone are not sufficient.
