---
name: frontend-delivery
description: Run the complete frontend delivery workflow from authoritative project docs and current source through analysis, Jira planning, specialist execution, testing, reconciliation, runtime cleanup, child-agent closure, and final acceptance. Use when the user wants the frontend work implemented end-to-end without stopping after planning unless a real approval/blocker gate is reached.
---

# Frontend Delivery Workflow

This is a user-facing workflow entry point. Main is the runtime Orchestrator; this workflow does not contain specialist implementation knowledge.

## Intent

Run continuously from the smallest valid workflow entry until acceptance, pause, or a real blocker. Do not stop merely because the Jira work graph was created.

## Entry resolution

Main resolves the current entry before dispatching children:

- `NEW`: no valid Jira workflow exists for the requested work.
- `RESUME`: valid Jira work state exists and relevant requirements are unchanged.
- `REPLAN`: relevant requirements or approved architecture changed materially.
- `PAUSE`: the user explicitly asks to stop/pause active work.
- `ACCEPTANCE`: required executable work is complete and final acceptance is due.

Natural-language pause intent such as `dừng lại`, `tạm dừng`, `để mai làm tiếp`, or equivalent must route to `PAUSE`.

## Main orchestration rule

Main owns workflow decisions and runtime transport:

- lifecycle and execution-intent resolution;
- dependency-ready work selection;
- specialist and internal-capability routing;
- native child-agent spawn/retry/interrupt/close/verification;
- write-scope leases and source-diff verification;
- cross-agent runtime-resource cleanup supervision;
- specialist result reconciliation;
- compact transient workflow state.

Scrum Master owns Jira schema discovery, work-graph creation/reconciliation, Jira reads required by its assigned operation, and authorized durable Jira mutations.

## Continuous delivery

### NEW

1. Main dispatches Brain for bounded requirement analysis, authority readiness, and project-stack discovery.
2. Capture Brain `analysis-package`, close/verify Brain, and continue only when both `analysis-status: ready` and `authority.status: ready`.
3. Main dispatches Scrum Master `planning` with execution intent `deliver` and the approved analysis.
4. Scrum Master discovers the current Jira project schema, maps semantic work roles to supported Jira work types/fields/workflow states, creates or reconciles the Jira work graph, and returns compact `jira-work-report`.
5. Main closes/verifies Scrum Master and selects dependency-ready execution units from confirmed Jira state.
6. Main routes the smallest allowed internal-capability set for each selected execution unit and composes bounded `issue-handoff` objects.
7. Before writable specialist dispatch, Main captures the working-project source baseline, reserves exact allowed write scope, and prevents overlapping writable leases.
8. Main dispatches dependency-ready specialists within runtime/write-scope capacity. A retry is allowed only after proving the prior attempt had no spawn side effect.
9. For each returned specialist result, Main verifies assigned scope, required evidence, source diff, runtime cleanup, and child closure before accepting the result.
10. When confirmed execution evidence crosses a durable Jira boundary, Main dispatches Scrum Master `progress-sync` with only the confirmed result/blocker/revision/workflow-state evidence. Close/verify Scrum Master after its report returns.
11. Repeat dependency routing until the affected functional-slice scope is acceptance-ready.
12. Main dispatches Brain for final acceptance and closes/verifies Brain after the acceptance report returns.
13. If Brain returns `blocked` or `revision-required`, keep the functional-slice boundary non-terminal and route only the affected scope through revalidation/replan/revision.
14. If Brain returns `accepted`, Main dispatches Scrum Master `finalize` with the current acceptance report.
15. Report workflow completion only after Scrum Master confirms the project-valid terminal/completed Jira transition and all child/runtime cleanup is resolved.

### RESUME

1. Resolve compact current Jira state; use Scrum Master `resume-sync` when fresh Jira state is required.
2. Verify Jira validity markers, authority readiness, and the relevant documentation baseline.
3. Run targeted Brain revalidation only when relevant authority/contract evidence is stale or changed.
4. Main selects the next dependency-ready execution unit from confirmed Jira state.
5. Continue specialist routing, reconciliation, and durable Jira synchronization through the same Main/Scrum Master boundaries as normal delivery.

A new chat or developer handoff is not a reason to rerun Brain or planning when durable context remains valid.

### REPLAN

1. Brain revalidates only changed relevant requirements and authority for the affected scope.
2. Main invalidates only affected Test Plan/validation evidence.
3. Main dispatches Scrum Master `replan` with the approved revised analysis.
4. Scrum Master reconciles only the affected Jira graph delta.
5. Main resumes dependency routing from the confirmed revised work state.

### PAUSE

1. Main stops new specialist dispatch immediately.
2. Main collects available specialist evidence and cleans/closes active execution where safely possible.
3. Main derives the proven continuation checkpoint from confirmed runtime/source/execution state.
4. Main dispatches Scrum Master `pause` with the checkpoint and only confirmed durable evidence.
5. Scrum Master persists required `[RESULT]`, workflow-state correction, and `[HANDOFF]` data and returns `jira-work-report`.
6. Main closes/verifies Scrum Master.
7. Report `paused` only after durable Jira persistence plus runtime/child cleanup are confirmed.

If Jira handoff persistence fails, return `pause-blocked`. If runtime or child cleanup remains unresolved, return `runtime-cleanup-blocked`.

## Execution resource lifecycle

A returned child-agent report is not the end of the child lifecycle.

Main keeps transient ownership of every spawned child until explicit close is requested and closure is verified. Long-lived resources created by Coding/Testing or another specialist must be registered when created and released before child close.

Do not intentionally leave child agents, dev/preview servers, watchers, browser processes, or known owned ports active after the workflow stage that created them.

If cleanup cannot be safely completed or verified, return `runtime-cleanup-blocked`.

## Approval and blocker gates

Interrupt continuous delivery only when progress requires authority that the workflow cannot infer safely, including:

- material requirement ambiguity;
- architecture or dependency adoption not already approved by project evidence;
- destructive or externally sensitive action requiring explicit approval;
- unresolved design choice where multiple valid outcomes require human selection;
- missing required external capability;
- scope change that exceeds the current approved Jira boundary;
- Jira schema/workflow ambiguity that Scrum Master cannot resolve safely;
- runtime cleanup that cannot be safely completed or verified.

Do not create artificial approval gates between Brain, Jira planning, Coding, Testing, or Acceptance when current evidence already authorizes continuation.

## Progressive disclosure

Only this workflow is user-facing. Internal capabilities live outside `.agents/skills/` and are loaded only by the owning role when their trigger is satisfied. Do not expose or ask the user to invoke internal capabilities directly.

## Completion

Jira stores durable workflow state, not routine execution traces. Persist only scope/decision changes, real blockers/revisions, final specialist results, and pause handoffs; keep ordinary triage/retry/intermediate test counts transient.

Report `accepted` only after:

- Brain acceptance verifies authoritative product truth, approved Jira context/results, source changes, and validation evidence;
- Scrum Master confirms the project-valid terminal/completed transition for the accepted functional-slice boundary;
- all known child agents are closed/verified;
- owned runtime resources are released.

Green tests or completed execution units alone are not sufficient.
