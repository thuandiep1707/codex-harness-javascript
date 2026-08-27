# Orchestrator execution control

- Jira is the only durable work and execution-context state. Never create `.plans/`, `.progresses/`,
  `.agent/`, workflow-state files, local task mirrors, or report stores in the product repository.
- Write human-facing Jira titles, descriptions, scope, acceptance criteria, blockers, results, and
  handoff notes in Vietnamese. Keep technical identifiers unchanged when required.
- During planning, read only relevant `.docs/` needed to create executable functional Tasks and
  specialist Subtasks. Never expose document paths or raw document content to specialists.
- During resume, do not repeat decomposition and do not read all `.docs/`. Reconstruct only the
  current Subtask, parent Task, Feature context, direct dependencies, latest durable checkpoint/result,
  and relevant current source state.
- During pause, freeze new specialist dispatch immediately. Do not start Brain, planning, or unrelated
  validation work merely to make the checkpoint look complete.
- A user pause/stop intent is a durable workflow checkpoint when active Jira-backed work exists. Do
  not treat it as only a status change or a request to stop responding.
- Before finalizing pause, reconcile proven execution evidence against Jira: collect available
  specialist reports, inspect relevant current source identity/state, persist missing `[RESULT]`
  evidence, and correct stale statuses only when evidence supports the correction.
- If an active specialist can return a bounded current-state report, collect it. Do not wait
  indefinitely for an unresponsive specialist; use only evidence already available after cancellation
  or timeout and mark unknowns explicitly.
- When unfinished scope remains, persist exactly one concise latest `[HANDOFF]` checkpoint at the
  continuation point. It must contain source repository/branch/commit when relevant, completed scope,
  remaining scope, validation state, blockers, and the next Jira work item/action.
- Do not report `status: paused` until the handoff is durably confirmed in Jira. If Jira is unavailable
  or the checkpoint cannot be persisted, stop new work but return `pause-blocked` instead of claiming a
  safe pause.
- Compose one transient `issue-handoff` per specialist execution. Do not persist it into the product
  repository.
- Dispatch Brain, Orchestrator, and specialist execution only through Codex native subagent/multi-agent
  delegation. Internal agent execution must remain a private child-agent execution surface.
- Never use a user-visible conversation, new-chat action, thread creation, or thread fork as a fallback
  transport for internal delegation. Do not substitute `create_thread`, `fork_thread`, or equivalent
  conversation APIs for native subagent dispatch.
- When native subagent delegation fails or is temporarily unavailable, retry the same native dispatch
  up to **5 total attempts**. Preserve the intended agent role, Jira Subtask, bounded handoff, and routed
  capabilities across retries. Do not broaden scope or change transport between attempts.
- A failed native dispatch attempt must not authorize product work in the primary chat, visible chat/thread
  creation, unrelated Jira mutation, or source mutation. Treat it only as a runtime transport failure.
- Return `runtime-capability-blocked` only after all 5 native delegation attempts fail. Never perform the
  delegated work in the primary chat and never create a visible chat/thread to bypass the exhausted runtime capability.
- A Codex UI regression may expose a legitimate native child thread in Recent. Treat that as runtime/UI
  behavior; the harness must still never intentionally create an independent user-visible conversation
  for internal agent execution.
- Use Jira context inheritance: Feature owns common context, Task owns functional-slice delta, Subtask
  owns specialist delta. Do not duplicate the full parent context at lower levels.
- Use only concise durable Jira execution notes: `[BLOCKER]`, `[RESULT]`, `[REVISION]`, `[HANDOFF]`.
  Never store hidden reasoning or routine step-by-step activity.
- Persist a specialist result to Jira before unblocking dependent work. Reject output that violates
  assigned scope, context boundary, protocol, or required evidence.
- Jira assignee plus workflow status is execution ownership. Do not invent a second lock or ownership
  database.
- Never perform specialist work as an invisible fallback. Stop with `missing-capability` when Jira or
  another required provider is unavailable.
