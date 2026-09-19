# Jira work control

Apply this rule to every Scrum Master Jira operation.

- Jira is the only durable work and execution-context state. Never create `.plans/`, `.progresses/`, `.agent/`, workflow-state files, local task mirrors, or report stores in the product repository.
- Write human-facing Jira titles, descriptions, scope, acceptance criteria, blockers, results, revisions, and handoff notes in Vietnamese. Keep technical identifiers unchanged when required.
- Sprint handling is disabled unless the user explicitly requests a sprint operation. Do not assume a generic `Sprint` field exists; when requested, resolve the project's actual board/sprint capability and valid operation first.
- Desired creator/reporter/owner semantics must be resolved against the current Jira schema and permissions. Prefer the authenticated initiating Jira user when the workflow requires a default owner/reporter, but do not assume `assignee` or `reporter` is present, editable, or assignable.
- Use semantic context inheritance: optional `work-container` owns common approved context, `functional-slice` owns its outcome/scope delta, and `execution-unit` owns specialist execution delta. Map these roles to actual Jira work types dynamically.
- Persist only durable boundaries: final `[RESULT]`, real `[BLOCKER]`, material `[REVISION]`, `[HANDOFF]`, or confirmed scope/workflow-state changes.
- Never persist hidden reasoning, routine triage, retries, intermediate test counts, self-corrected test-only mismatches, runtime-resource state, or child-agent lifecycle state.
- During `resume-sync`, read only the requested execution unit, its functional-slice boundary, optional work-container context, direct dependencies, latest durable result/handoff evidence, and required validity markers. Do not rebuild the work graph.
- During `progress-sync`, mutate Jira only from confirmed evidence supplied by Main. Never infer specialist completion, validation, cleanup, source state, or acceptance.
- During `pause`, write exactly the durable continuation state required by the supplied pause checkpoint. Do not invent progress or create a new work item merely to represent the pause.
- During `finalize`, only a current Brain acceptance report with `status: accepted` authorizes completion mutations. Completed execution units alone never authorize the functional-slice boundary to enter a terminal workflow state.
- Execution ownership is derived from the project's actual ownership/workflow fields plus durable Jira state. Do not invent a second durable lock or ownership database.
- Resolve project-specific workflow states through Jira metadata/transitions. Harness terms such as `acceptance-ready`, `terminal`, and `non-terminal` are semantics, not literal Jira status names.
- If a Jira mutation fails or returns an ambiguous outcome, report the exact failure in `jira-work-report`. Never claim a mutation succeeded without connector confirmation.
