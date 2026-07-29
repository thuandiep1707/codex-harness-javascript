# Frontend skill ownership

Skill discovery is global to the repository, but skill permission is local to each agent manifest.
An agent must not load a skill outside its allowlist.

## Brain

| Skill | Responsibility |
| --- | --- |
| `analyze-frontend-requirements` | Create analysis and final acceptance contracts |
| `design-frontend-module-boundary` | Decide bounded-context ownership and DDD placement |
| `audit-frontend-supply-chain` | Assess dependency/source adoption risk |
| `audit-frontend-security` | Assess browser/runtime threat surfaces |

## Orchestrator

| Skill | Responsibility |
| --- | --- |
| `plan-frontend-work` | Create Jira-backed task graph, handoffs, execution waves, state, and reconciliation |

## Design

| Skill | Responsibility |
| --- | --- |
| `orchestrate-frontend-design` | Use a connected provider and return a traceable design artifact |

## Test plan

| Skill | Responsibility |
| --- | --- |
| `plan-frontend-testing` | Convert one issue handoff into a risk-based test-plan artifact |

## Coding

| Skill | Responsibility |
| --- | --- |
| `migrate-legacy-frontend-module` | Migrate approved legacy behavior |
| `integrate-third-party-frontend` | Implement an approved external integration |
| `nextjs-state-management` | Implement approved URL/local/client/server state ownership |
| `nextjs-tanstack-query` | Implement explicit TanStack Query flows |
| `shadcn` | Work with approved shadcn primitives and source |

## Testing

| Skill | Responsibility |
| --- | --- |
| `testing` | Implement, run, debug, and report bounded frontend tests |

Routine lint, typecheck, build, or browser validation does not trigger the testing skill by itself.
Test planning and test implementation are separate responsibilities.
