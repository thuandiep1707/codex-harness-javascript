# Jira work control

Apply this rule to every Scrum Master Jira operation.

- Jira is the only durable work and execution-context state. Never create `.plans/`, `.progresses/`, `.agent/`, workflow-state files, local task mirrors, or report stores in the product repository.
- Write human-facing Jira titles, descriptions, scope, acceptance criteria, blockers, results, revisions, and handoff notes in Vietnamese. Keep technical identifiers unchanged when required.
- Sprint enforcement is disabled unless the user explicitly requests a sprint operation. Missing/null Sprint evidence must not block planning, replanning, resume-sync, or durable progress updates.
- When creating a Jira Task, use the authenticated initiating Jira user as reporter and default assignee unless explicitly overridden.
- Use context inheritance: Feature owns common context, Task owns functional-slice delta, Subtask owns specialist execution delta. Do not duplicate full parent context at lower levels.
- Persist only durable boundaries: final `[RESULT]`, real `[BLOCKER]`, material `[REVISION]`, `[HANDOFF]`, or confirmed scope/status changes.
- Never persist hidden reasoning, routine triage, retries, intermediate test counts, self-corrected test-only mismatches, runtime-resource state, or child-agent lifecycle state.
- During `resume-sync`, read only the requested Subtask, parent Task, Feature context, direct dependencies, latest durable result/handoff evidence, and required validity markers. Do not rebuild the work graph.
- During `progress-sync`, mutate Jira only from confirmed evidence supplied by Main. Never infer specialist completion, validation, cleanup, source state, or acceptance.
- During `pause`, write exactly the durable continuation state required by the supplied pause checkpoint. Do not invent progress or create a new Task merely to represent the pause.
- During `finalize`, only a current Brain acceptance report with `status: accepted` authorizes final completion mutations. Completed Subtasks alone never authorize parent Done.
- Jira assignee plus workflow status remains durable execution ownership. Do not invent a second durable lock or ownership database.
- If a Jira mutation fails or returns an ambiguous outcome, report the exact failure in `jira-work-report`. Never claim a mutation succeeded without connector confirmation.
