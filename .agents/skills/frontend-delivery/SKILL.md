---
name: frontend-delivery
description: Run the complete frontend delivery workflow from authoritative project docs and current source through analysis, Jira planning, specialist execution, testing, reconciliation, runtime cleanup, child-agent closure, and final acceptance. Use when the user wants the frontend work implemented end-to-end without stopping after planning unless a real approval/blocker gate is reached.
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
5. For every specialist execution, reconcile its result, clean owned runtime resources, explicitly close the child agent, and verify closure before dependent work is unblocked.
6. When all required executable Subtasks are complete and no known child/runtime resource remains active, spawn Brain for final acceptance.
7. After Brain acceptance returns, explicitly close and verify the Brain child before reporting the workflow complete.

For `RESUME`, skip Brain analysis and Orchestrator decomposition when Jira validity markers and relevant `.docs` baseline remain valid. Resume only the minimal current Jira chain and required specialist.

For `REPLAN`, revalidate only changed relevant requirements and replan only affected Jira scope.

For `PAUSE`, stop new dispatch and require Orchestrator runtime-resource cleanup, child-agent cleanup, pause reconciliation, and durable Jira `[HANDOFF]` before reporting a safe pause.

## Execution resource lifecycle

A returned child-agent report is not the end of the child lifecycle.

Parent agents must keep transient ownership of every spawned child until explicit close is requested and closure is verified. Long-lived processes created by Coding/Testing or another specialist must be registered when created and released before child close.

Do not intentionally leave child agents, dev/preview servers, watchers, browser processes, or known owned ports active after the workflow stage that created them.

If cleanup cannot be safely completed or verified, return `runtime-cleanup-blocked` instead of reporting successful completion.

## Approval and blocker gates

Interrupt continuous delivery only when progress requires authority that the workflow cannot infer safely, including:

- material requirement ambiguity;
- architecture or dependency adoption not already approved by project evidence;
- destructive or externally sensitive action requiring explicit approval;
- unresolved design choice where multiple valid outcomes require human selection;
- missing required external capability;
- scope change that exceeds the current approved Jira boundary;
- runtime cleanup that cannot be safely completed or verified.

Do not create artificial approval gates between Brain, Jira planning, Coding, Testing, or Acceptance when the current evidence already authorizes continuation.

## Progressive disclosure

Only this workflow is user-facing. Internal agent capabilities live outside `.agents/skills/` and are loaded only by the owning agent when their trigger is satisfied. Do not expose or ask the user to invoke internal capabilities directly.

## Completion

Report `accepted` only after Brain acceptance verifies authoritative `.docs`, Jira context/results, source changes, and validation evidence **and** all known child agents spawned for the workflow have been explicitly closed/verified and all owned runtime resources have been released or safely resolved. Green tests alone are not sufficient.
