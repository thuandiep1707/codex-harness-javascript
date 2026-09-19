---
name: frontend-delivery
description: Run the complete frontend delivery workflow from authoritative project docs and current source through analysis, Jira planning, specialist execution, testing, reconciliation, runtime cleanup, child-agent closure, and final acceptance. Use when the user wants the frontend work implemented end-to-end without stopping after planning unless a real approval/blocker gate is reached.
---

# Frontend Delivery Workflow

This is a user-facing workflow entry point. It coordinates agents; it does not contain implementation knowledge.

## Intent

Run continuously from the smallest valid workflow entry until acceptance, pause, or a real blocker. Do not stop merely because the Jira work graph was created.

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

Orchestrator owns workflow decisions. It must not call native agent lifecycle APIs or Jira directly. It returns stable-ID `controller-actions`; the Primary Controller executes them exactly and retains confirmed results.

Orchestrator state is workflow-lived, but an Orchestrator child process is disposable. A later Orchestrator turn is rehydrated from the latest reconciliation report, minimal Jira context, and confirmed controller-action results. Do not reserve a native child slot merely to keep Orchestrator memory alive.

## Continuous delivery

For `NEW`:

1. Primary Controller spawns Brain for bounded requirement analysis, authority readiness, and project-stack discovery.
2. Capture Brain result, then explicitly close and verify the Brain child. Continue only when both `analysis-status: ready` and `authority.status: ready`; otherwise stop before Orchestrator planning/execution with the reported blocker.
3. Primary Controller spawns one Orchestrator child in planning mode with execution intent `deliver` and supplies the approved analysis/Jira context.
4. Orchestrator returns `status: awaiting-controller` with one deterministic action batch up to the next decision boundary. Action IDs remain stable across retry/rehydration; independent actions may be batched, while result-dependent actions wait for the next Orchestrator decision.
5. Primary Controller executes the batch without changing intent/payload. For writable specialist dispatch, capture the Git baseline, reserve exact allowed write scope, prevent overlapping writable leases, and verify the resulting diff stays inside scope.
6. For `dispatch-specialist`, retry only after proving a failed/timeout attempt had no spawn side effect; never blind-spawn a duplicate. Collect result/resource evidence, close/verify the specialist child, and retain confirmed action results.
7. Capture the Orchestrator report and close/verify its child after each decision turn. Rehydrate a fresh Orchestrator when confirmed action results reach the next decision boundary.
8. Repeat until Orchestrator returns `acceptance-ready` with complete Brain acceptance inputs. The functional-slice acceptance boundary remains in a project-defined non-terminal Jira workflow state at this point.
9. Spawn Brain for final acceptance and close/verify the Brain child. If it returns `blocked` or `revision-required`, route only the affected scope back through replan/revision; do not close the parent Task.
10. If Brain returns `accepted`, spawn one Orchestrator `finalize` decision turn with that acceptance report. Execute its exact final Jira actions, including the valid transition of the accepted functional-slice boundary to the project-defined terminal/completed workflow state when appropriate, and report workflow completion only after confirmation.

For `RESUME`, skip Brain analysis and Orchestrator decomposition only when Jira validity markers, authority readiness, and the relevant `.docs` baseline remain valid. If authority or relevant contract evidence is stale, run targeted Brain revalidation before any specialist dispatch. Rehydrate Orchestrator decision turns from confirmed state instead of requiring one long-lived child.

For `REPLAN`, revalidate only changed relevant requirements and authority for the affected scope. Invalidate only affected Test-plan/validation evidence, replan only that Jira delta, then continue through the same controller-action loop.

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

Jira stores durable workflow state, not routine execution traces. Persist only scope/decision changes, real blockers/revisions, final specialist results, and pause handoffs; keep ordinary triage/retry/intermediate test counts transient.

Report `accepted` only after Brain acceptance verifies authoritative `.docs`, Jira context/results, source changes, and validation evidence, all known child agents are closed/verified, owned runtime resources are released, **and** the post-acceptance Orchestrator finalization has confirmed the project-valid terminal/completed transition for the accepted functional-slice boundary. Green tests or completed execution units alone are not sufficient.
