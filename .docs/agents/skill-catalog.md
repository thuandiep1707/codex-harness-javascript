# Frontend skill ownership

Skill discovery is global to the repository, but skill permission is local to each agent manifest.
An agent must not load a skill outside its allowlist.

## Brain

| Skill | Responsibility |
| --- | --- |
| `analyze-frontend-requirements` | Create resumable analysis/revalidation/final acceptance contracts |
| `design-frontend-module-boundary` | Decide bounded-context ownership and DDD placement from product evidence |
| `audit-frontend-supply-chain` | Assess dependency/source adoption risk |
| `audit-frontend-security` | Assess browser/runtime threat surfaces |

## Orchestrator

| Skill | Responsibility |
| --- | --- |
| `plan-frontend-work` | Plan/resume/pause Jira-backed Functional Tasks and specialist Subtasks, compose transient handoffs/pause checkpoints, reconcile results |

## Design

| Skill | Responsibility |
| --- | --- |
| `orchestrate-frontend-design` | Use a connected provider and return traceable design evidence |

## Test plan

| Skill | Responsibility |
| --- | --- |
| `plan-frontend-testing` | Convert one transient specialist handoff into a risk-based test-plan artifact |

## Coding

| Skill | Responsibility |
| --- | --- |
| `migrate-legacy-frontend-module` | Migrate approved legacy behavior within one bounded Coding Subtask |
| `integrate-third-party-frontend` | Implement an approved external integration within one bounded Coding Subtask |
| `nextjs-state-management` | Implement approved state ownership |
| `nextjs-tanstack-query` | Implement explicit approved TanStack Query flows |
| `shadcn` | Work with approved shadcn primitives/source mechanics |

## Testing

| Skill | Responsibility |
| --- | --- |
| `testing` | Implement, run, debug, and report one bounded Testing Subtask |

Routine lint, typecheck, build, or browser validation does not trigger Testing by itself. Test planning
and test implementation remain separate specialist responsibilities. No skill creates `.plans/`,
`.progresses/`, `.agent/`, or another product-repository workflow store.
