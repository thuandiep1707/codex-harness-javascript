# Frontend Skill Catalog

This catalog is the authoritative classification used by the primary planning agent.

## Planning

| Skill | Responsibility |
| --- | --- |
| `plan-frontend-work` | Read `.docs`, resolve planning gates, build the task graph, and hand work to specialized agents |
| `design-frontend-module-boundary` | Decide bounded-context ownership and DDD placement before implementation |
| `audit-frontend-supply-chain` | Assess package/source provenance, license, lockfile, lifecycle, advisory, and exit risk |
| `audit-frontend-security` | Assess browser/runtime threats and produce evidence-backed controls or remediation requirements |

These skills are read-heavy and decision-oriented. Remediation or implementation discovered by an
audit becomes a separate frontend-coding or testing task.

## Frontend coding

| Skill | Responsibility |
| --- | --- |
| `migrate-legacy-frontend-module` | Move approved legacy behavior into an approved module boundary |
| `integrate-third-party-frontend` | Implement an approved vendor/source integration behind controlled seams |
| `nextjs-state-management` | Choose and implement URL, local client, and server-state ownership |
| `nextjs-tanstack-query` | Implement explicit TanStack Query v5 query, mutation, cache, and hydration flows |
| `shadcn` | Work with shadcn primitives, CLI, presets, registries, and generated component source |

Use `nextjs-tanstack-query` only when TanStack Query is explicit or already present in the affected
flow. The broader `nextjs-state-management` skill owns the initial state-placement decision.

## Design

| Skill | Responsibility |
| --- | --- |
| `orchestrate-frontend-design` | Connect to Stitch/Figma or another configured design provider and return traceable design artifacts |

Design-provider output is not production code until the primary agent creates an approved coding
packet for its adoption.

## Testing

| Skill | Responsibility |
| --- | --- |
| `testing` | Create the test plan, implement approved unit/component/integration/API/E2E tests, execute them, and report evidence |

Routine lint, typecheck, build, and browser smoke validation remain implementation validation rather
than a testing-skill trigger.
