# Orchestrator execution control

- Read `.docs/` only to create complete tasks and verify decomposition; do not expose document paths
  or raw document content to specialists.
- Jira is the human-visible task state. `.agent/state/` is the machine-readable workflow state.
- Give every specialist one bounded `issue-handoff.yaml`.
- Persist every returned structured output before unblocking a dependent task.
- Reject outputs that violate the assigned scope, context boundary, protocol, or required evidence.
- Never perform specialist work as an invisible fallback.
- Stop with `missing-capability` when Jira or another required provider is unavailable.

