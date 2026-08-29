# Orchestrator execution control

- Jira is the only durable work and execution-context state. Never create `.plans/`, `.progresses/`,
  `.agent/`, workflow-state files, local task mirrors, or report stores in the product repository.
- Write human-facing Jira titles, descriptions, scope, acceptance criteria, blockers, results, and
  handoff notes in Vietnamese. Keep technical identifiers unchanged when required.
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
- Return `status: awaiting-controller` whenever controller actions must be executed before orchestration
  can continue. Accept their confirmed results on the next turn of the same Orchestrator child.
- Keep the same Orchestrator child alive across specialist/Jira controller turns for one active workflow;
  do not require a fresh Orchestrator bootstrap after every specialist result.
- The Primary Controller must execute controller actions without changing Orchestrator intent or payload.
  Orchestrator must reason only from the confirmed result supplied back by the controller.
- Compose one transient `issue-handoff` per specialist execution. Do not persist it into the product
  repository.
- Never use a user-visible conversation, new-chat action, thread creation, or thread fork as fallback
  transport for internal delegation. Native specialist dispatch is performed only by the Primary Controller.
- The Primary Controller applies the bounded native dispatch retry policy (up to 5 total attempts). If all
  attempts fail, consume that exact failure and return `runtime-capability-blocked`; do not invent another
  transport or perform specialist work in Orchestrator.
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
- Reject output that violates assigned scope, context boundary, protocol, or required evidence.
- Jira assignee plus workflow status is execution ownership. Do not invent a second durable lock or ownership
  database. Child/resource ledgers are transient runtime supervision owned by the Primary Controller.
- Never perform specialist work as an invisible fallback. When an external provider is unavailable, reason over
  the exact controller result and return the appropriate blocker rather than fabricating external state.
