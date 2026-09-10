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

## Controller execution rule

The Primary Controller owns runtime transport for the whole workflow:

- native child-agent spawn/retry/interrupt/close/verification;
- Jira connector calls requested by Orchestrator;
- cross-agent runtime-resource cleanup supervision.

Orchestrator owns workflow decisions. It must not call native agent lifecycle APIs or Jira directly. It returns `controller-actions`; the Primary Controller executes them exactly and returns confirmed results to the same Orchestrator child.

Keep one Orchestrator child alive across the active delivery workflow. Do not restart it after every Coding/Testing result.

## Continuous delivery

For `NEW`:

1. Primary Controller spawns Brain for bounded requirement analysis and project-stack discovery.
2. Capture Brain result, then explicitly close and verify the Brain child.
3. Primary Controller spawns one Orchestrator child in planning mode with execution intent `deliver` and supplies the approved analysis/Jira context.
4. Orchestrator returns `status: awaiting-controller` with exact `jira-call` and/or `dispatch-specialist` actions as needed.
5. Primary Controller executes those actions without changing their intent/payload and sends confirmed action results back to the same Orchestrator child.
6. For `dispatch-specialist`, Primary Controller applies the native retry policy, collects the specialist result/runtime-resource evidence, ensures owned resources are cleaned, explicitly closes/verifies the specialist child, then returns the result to Orchestrator.
7. Repeat the controller-action loop until Orchestrator returns a terminal reconciliation result with acceptance inputs ready.
8. Close and verify the Orchestrator child.
9. Spawn Brain for final acceptance, then close/verify the Brain acceptance child before reporting the workflow complete.

For `RESUME`, skip Brain analysis and Orchestrator decomposition when Jira validity markers and relevant `.docs` baseline remain valid. Spawn/keep one Orchestrator child for the resumed workflow and continue through the same controller-action loop.

For `REPLAN`, revalidate only changed relevant requirements and replan only affected Jira scope, then continue through the same controller-action loop.

For `PAUSE`, stop new specialist dispatch, let the Primary Controller collect/clean active runtime execution, then use the active Orchestrator (or spawn one in pause mode if none is usable) to decide required Jira result/handoff calls. Report a safe pause only after those calls and cleanup are confirmed.

## Execution resource lifecycle

A returned child-agent report is not the end of the child lifecycle.

Primary Controller keeps transient ownership of every spawned child until explicit close is requested and closure is verified. Long-lived processes created by Coding/Testing or another specialist must be registered when created and released before child close.

Do not intentionally leave child agents, dev/preview servers, watchers, browser processes, or known owned ports active after the workflow stage that created them.

If cleanup cannot be safely completed or verified, return `runtime-cleanup-blocked` instead of reporting successful completion.

## Approval and blocker gates

Interrupt continuous delivery only when progress requires authority that the workflow cannot infer safely, including:

- material requirement ambiguity;
- architecture or dependency adoption not already approved by project evidence;
- destructive or externally sensitive action requiring explicit approval;
- unresolved design choice where multiple valid outcomes require human selection;
- missing required external capability confirmed at the Primary Controller transport layer;
- scope change that exceeds the current approved Jira boundary;
- runtime cleanup that cannot be safely completed or verified.

Do not create artificial approval gates between Brain, Jira planning, Coding, Testing, or Acceptance when the current evidence already authorizes continuation.

## Progressive disclosure

Only this workflow is user-facing. Internal agent capabilities live outside `.agents/skills/` and are loaded only by the owning agent when their trigger is satisfied. Do not expose or ask the user to invoke internal capabilities directly.

## Completion

Report `accepted` only after Brain acceptance verifies authoritative `.docs`, Jira context/results, source changes, and validation evidence **and** all known child agents spawned for the workflow have been explicitly closed/verified and all owned runtime resources have been released or safely resolved. Green tests alone are not sufficient.
