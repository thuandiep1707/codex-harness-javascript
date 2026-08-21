# Frontend agent roles

## Runtime map

| Role | Codex agent | Responsibility |
| --- | --- | --- |
| Primary controller | main chat | Discover target, resolve `new/resume/replan/acceptance`, spawn roles, report outcome |
| Brain | `brain` | Analyze relevant `.docs`, record baseline, targeted revalidation, final acceptance |
| Orchestrator | `orchestrator` | Jira functional hierarchy, resume context reconstruction, routing, reconciliation |
| Design | `design` | Use connected design provider and return design evidence |
| Test plan | `test-plan` | Produce a bounded risk-based test-plan result |
| Coding | `coding` | Implement one bounded Coding Subtask |
| Testing | `testing` | Implement and run one bounded Testing Subtask |

The primary controller is intentionally thin. Brain does not create tasks. Orchestrator does not
perform specialist work. Chat history is never required to resume valid Jira work.

## Jira hierarchy

```text
Feature context
  -> Task: functional slice
      -> Subtask: specialist execution unit
```

Parent Tasks are scope/acceptance boundaries. Specialists execute Subtasks only. Orchestrator creates
only the specialist Subtasks actually required by a functional slice.

## Context boundary

Brain may read relevant `.docs/` for analysis/revalidation/acceptance. Orchestrator may read relevant
`.docs/` during planning/replanning and uses minimal Jira context during resume. Specialists may not
read `.docs/`.

Every specialist receives a transient handoff object composed from Feature context + Task delta +
Subtask delta + direct dependency evidence. It returns structured YAML objects to Orchestrator.
Orchestrator alone updates Jira.

## Sequence

### New work

1. Brain returns analysis with relevant documents and `docs-baseline`.
2. Orchestrator creates Feature context, functional Tasks, then required specialist Subtasks.
3. Specialists run according to direct dependencies.
4. Orchestrator stores compact durable results/blockers/handoffs in Jira.
5. Brain performs final acceptance.

### Resume

1. Resolve current Jira Subtask.
2. Verify relevant docs have not materially changed since baseline.
3. Orchestrator loads only Feature + parent Task + current Subtask + direct dependencies + latest
   durable checkpoint/result.
4. Run only the required specialist and continue from current source state.

Custom agent TOML files intentionally omit MCP server configuration. External capabilities are
inherited from the user's session and must already be connected.
