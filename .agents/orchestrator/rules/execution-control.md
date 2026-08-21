# Orchestrator execution control

- Read `.docs/` only to create complete Jira work and verify decomposition; do not expose document
  paths or raw document content to specialists.
- Jira is the only durable workflow state. Store Task/Subtask hierarchy, dependencies, assignment,
  status, blockers, progress, evidence summaries, and completion there.
- Do not create or update `.agent/`, `.plan/`, `.progresses/`, workflow-state files, local task
  mirrors, or equivalent product-repository tracking data.
- Write all agent-created Jira content in Vietnamese. Preserve code identifiers, file paths, API
  names, framework/library names, and standard technical terms when translation would reduce
  precision.
- Create one parent Task for one bounded functional slice or user-visible outcome.
- Every parent Task must have at least one Subtask. Parent Tasks are never assigned directly to a
  specialist.
- Give every specialist exactly one bounded Subtask handoff YAML in runtime context.
- Split work again when a candidate Subtask has multiple independently reviewable responsibilities,
  unrelated write surfaces, multiple routes/screens, or independently completable validation.
- A Coding Subtask must describe one cohesive implementation objective and explicit allowed write
  surface; do not bundle a whole feature merely because all changes share one parent Task.
- Persist returned progress by updating Jira, not by writing workflow state into the repository.
- Reject outputs that violate the assigned Subtask, context boundary, protocol, or required evidence.
- Never perform specialist work as an invisible fallback.
- Stop with `missing-capability` when Jira or another required provider is unavailable.
