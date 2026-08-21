# Frontend agent roles

## Runtime map

| Role | Codex agent | Responsibility |
| --- | --- | --- |
| Primary controller | main chat | Discover target, spawn roles, pass runtime YAML, report outcome |
| Brain | `brain` | Analyze `.docs`, reason about architecture, perform final acceptance |
| Orchestrator | `orchestrator` | Create Vietnamese Jira Task/Subtasks, runtime handoffs, routing, state, and reconciliation |
| Design | `design` | Use a connected design provider and return a design artifact |
| Test plan | `test-plan` | Produce a risk-based test-plan artifact |
| Coding | `coding` | Implement one bounded production-code Subtask with mandatory component decomposition |
| Testing | `testing` | Implement and run one bounded frontend testing Subtask |

The primary controller is intentionally thin. Brain does not create tasks. Orchestrator does not
perform specialist work.

## Jira hierarchy

```text
Task = one bounded functional slice / user-visible outcome
└── Subtask = one executable specialist work unit
```

Every Task created by Orchestrator must contain at least one Subtask. Parent Tasks are never assigned
directly to specialists. Jira is the only durable workflow state; do not mirror task/progress state
into the product repository.

All Jira content created by agents is written in Vietnamese while preserving code identifiers, file
paths, API/framework/library names, and technical terms when needed for precision.

## Context boundary

Brain and Orchestrator may read the working project's `.docs/`. Specialists may not.

| Specialist | Allowed task context |
| --- | --- |
| `design` | one Subtask `issue-handoff.yaml` runtime payload |
| `test-plan` | one Subtask `issue-handoff.yaml` runtime payload |
| `coding` | one Subtask handoff, approved design artifact, necessary source |
| `testing` | one Subtask handoff, approved test-plan artifact, necessary source/build |

Every specialist returns YAML to Orchestrator. Orchestrator alone updates Jira.

## Sequence

1. Brain returns analysis.
2. Orchestrator creates parent Jira Tasks and required Subtasks.
3. Design and Test Plan Subtasks run in the preparation wave when required.
4. Bounded Coding Subtasks run after their required design artifacts are approved.
5. Testing Subtasks run after the test plan and relevant production contract exist.
6. Orchestrator reconciles and updates Jira to match actual evidence.
7. Brain performs acceptance against the original `.docs/`, Jira, runtime artifacts, source changes,
   and validation evidence.

Custom agent TOML files intentionally omit MCP server configuration. External capabilities are
inherited from the user's session and must already be connected.
