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
- Compose one transient `issue-handoff` per specialist execution. Do not persist it into the product
  repository.
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
