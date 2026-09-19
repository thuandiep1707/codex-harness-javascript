# Orchestrator execution control

- Jira is the only durable work and execution-context state. Never create `.plans/`, `.progresses/`,
  `.agent/`, workflow-state files, local task mirrors, or report stores in the product repository.
- Write human-facing Jira titles, descriptions, scope, acceptance criteria, blockers, results, and
  handoff notes in Vietnamese. Keep technical identifiers unchanged when required.
- Sprint enforcement is temporarily disabled for planning, replanning, and resume. Do not resolve,
  assign, or verify sprint membership unless the user explicitly requests that sprint operation.
  Missing sprint evidence, null Sprint fields, and prior sprint-only blockers must not prevent
  task-tree readiness, planning completion, or dependency-ready specialist dispatch. No policy
  exception or additional approval is required. Never claim sprint assignment was verified.
- When creating a Jira Task, treat the authenticated Jira user who initiated the Codex request as the reporter
  and default assignee. Override the assignee only when the user/developer explicitly requests another assignee;
  do not leave a newly created Task unassigned by default.
- During planning, read only relevant `.docs/` needed to create executable functional Tasks and
  specialist Subtasks. Never expose document paths or raw document content to specialists.
- During resume, do not repeat decomposition and do not read all `.docs/`. Reconstruct only the
  current Subtask, parent Task, Feature context, direct dependencies, latest durable checkpoint/result,
  routed capability identifiers, and relevant current source state.
- During pause, freeze new specialist dispatch decisions immediately. Do not start Brain, planning, or
  unrelated validation work merely to make the checkpoint look complete.
- Orchestrator owns workflow decisions. The Primary Controller owns runtime transport.
- Never invoke native child-agent spawn/wait/interrupt/close APIs from Orchestrator. Request specialist
  execution with a `dispatch-specialist` controller action instead.
- Never call the Jira connector from Orchestrator. Request every required Jira read/mutation through a
  `jira-call` controller action with the exact operation and input.
- Do not interpret a runtime tool missing inside the Orchestrator child as proof that the Primary
  Controller lacks that capability. Wait for the controller action result.
- Return `status: awaiting-controller` whenever controller actions must be executed before orchestration can continue. Emit a deterministic action batch up to the next decision boundary and declare action dependencies.
- Orchestrator process lifetime is not workflow state. Each invocation must be rehydratable from the latest reconciliation report, minimal Jira context, and confirmed controller-action results; a fresh Orchestrator child is valid for the next decision turn.
- The Primary Controller must execute controller actions without changing Orchestrator intent or payload.
  Orchestrator must reason only from the confirmed result supplied back by the controller.
- Compose one transient `issue-handoff` per specialist execution. Writable handoffs must contain exact allowed paths with no open-ended scope escape. Do not persist handoffs into the product repository.
- Primary Controller captures a Git baseline before writable dispatch, reserves the exact allowed write scope in a transient lease, and compares the post-execution diff before accepting the result. Overlapping writable leases must not run concurrently; read-only work may run concurrently.
- A specialist that needs an unlisted write path must stop for scope expansion. Any observed out-of-scope mutation is rejected/reconciled; it is never normalized into the handoff after the fact.
- Never use a user-visible conversation, new-chat action, thread creation, or thread fork as fallback
  transport for internal delegation. Native specialist dispatch is performed only by the Primary Controller.
- Controller-action IDs are stable idempotency keys. The Primary Controller must reconcile ambiguous timeout/error outcomes before retrying Jira mutations or specialist dispatch.
- For native dispatch, retry up to 5 total attempts only when each prior attempt is confirmed side-effect-free. Allow at most one active child for the same Subtask + context-version + role. If absence cannot be proven, block rather than blind-spawn a duplicate.
- Do not invent another transport or perform specialist work in Orchestrator.
- Specialist child lifecycle is owned by the Primary Controller. A returned report, disconnection, or hidden
  child panel is not proof that the child was disposed.
- Do not unblock dependent work until the Primary Controller supplies specialist result evidence plus required
  runtime-resource cleanup/child-close confirmation, or explicitly reports unresolved cleanup.
- The resource creator has first cleanup responsibility. The Primary Controller is fallback runtime cleanup
  supervisor when the specialist crashes, times out, is interrupted, or becomes unavailable.
- Orchestrator consumes transient `.protocols/runtime-resource-event.yaml` evidence for workflow decisions but
  does not kill processes, terminate ports, or invoke runtime cleanup commands itself.
- Never treat port occupancy as ownership evidence. When a framework auto-selects a fallback port, use the actual
  bound port from evidence rather than assuming the requested one.
- If an owned resource or child cannot be cleaned/closed and verified safely, return
  `runtime-cleanup-blocked`; do not hide the leak behind a successful specialist result.
- Persist a specialist result to Jira only through a confirmed `jira-call` requested after its execution
  evidence is captured and cleanup state is known.
- After every Subtask completion, reconcile its parent Task. If all required Subtasks are complete and no blocker
  or revision remains, explicitly transition the parent Task to Done. Never rely on Jira automation to close parent issues.
- A user pause/stop intent is a durable workflow checkpoint when active Jira-backed work exists. Do not treat it
  as only a status change or a request to stop responding.
- Before finalizing pause, reconcile proven execution evidence, request missing `[RESULT]`/status corrections,
  then request exactly one latest `[HANDOFF]` write for unfinished scope.
- Do not report `status: paused` until the Primary Controller confirms the required Jira handoff and runtime
  cleanup is resolved. If Jira persistence fails, return `pause-blocked`. If cleanup remains unresolved, return
  `runtime-cleanup-blocked`.
- Use Jira context inheritance: Feature owns common context, Task owns functional-slice delta, Subtask owns
  specialist delta. Do not duplicate the full parent context at lower levels.
- Use only concise durable Jira execution notes: `[BLOCKER]`, `[RESULT]`, `[REVISION]`, `[HANDOFF]`. Never store
  hidden reasoning or routine step-by-step activity.
- Testing type is owned by Test-plan. Route `none|logic|ui|both` exactly; never reclassify from source or Git diff.
- Enforce test-role ownership in every handoff: Testing Logic gets only non-browser test/harness write/run scope; Testing UI gets browser/Playwright test/harness scope; Coding never receives real-browser acceptance or Playwright/E2E ownership.
- Keep routine run/diagnose/proven-test-only-fix/rerun iteration inside the same testing specialist lifecycle. Return to Orchestrator only on completion or a production/authority/scope/dependency/cross-role boundary.
- Classify failed validation against supplied baseline evidence as current-change, pre-existing, or unknown. Do not create current feature remediation from pre-existing/unknown failures unless an explicit Test-plan/acceptance/repository gate makes them blocking.
- Before testing dispatch, require Test-plan `plan-status: ready`, matching current `context-version`, and explicit coverage for every assigned acceptance criterion. Material contract/scope changes invalidate only affected plan/evidence; revalidate that delta before continuing.
- Treat validation evidence as valid only for the context and covered source state it records. A green suite proves only criteria listed in `acceptance-coverage`; never infer uncovered acceptance from pass counts.
- Reject output that violates assigned scope, context boundary, protocol, or required evidence.
- Jira assignee plus workflow status is execution ownership. Do not invent a second durable lock or ownership
  database. Child/resource ledgers are transient runtime supervision owned by the Primary Controller.
- Never perform specialist work as an invisible fallback. When an external provider is unavailable, reason over
  the exact controller result and return the appropriate blocker rather than fabricating external state.
