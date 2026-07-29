# Frontend agent roles

## Runtime map

| Role | Codex agent | Responsibility |
| --- | --- | --- |
| Primary controller | main chat | Discover target, spawn roles, persist returned YAML, report outcome |
| Brain | `brain` | Analyze `.docs`, reason about architecture, perform final acceptance |
| Orchestrator | `orchestrator` | Create Jira tasks, handoffs, state, routing, and reconciliation |
| Design | `design` | Use a connected design provider and return a design artifact |
| Test plan | `test-plan` | Produce a risk-based test-plan artifact |
| Coding | `coding` | Implement bounded production code |
| Testing | `testing` | Implement and run bounded frontend tests |

The primary controller is intentionally thin. Brain does not create tasks. Orchestrator does not
perform specialist work.

## Context boundary

Brain and Orchestrator may read the working project's `.docs/`. Specialists may not.

| Specialist | Allowed task context |
| --- | --- |
| `design` | `issue-handoff.yaml` |
| `test-plan` | `issue-handoff.yaml` |
| `coding` | issue handoff, approved design artifact, necessary source |
| `testing` | issue handoff, approved test-plan artifact, necessary source/build |

Every specialist returns YAML to Orchestrator. Orchestrator alone updates Jira and workflow state.

## Sequence

1. Brain returns analysis.
2. Orchestrator creates Jira issues and handoffs.
3. Design and Test Plan run in the preparation wave when required.
4. Coding runs after the required design artifact is approved.
5. Testing runs after the test plan and production contract exist.
6. Orchestrator reconciles.
7. Brain performs acceptance against the original `.docs/`.

Custom agent TOML files intentionally omit MCP server configuration. External capabilities are
inherited from the user's session and must already be connected.
