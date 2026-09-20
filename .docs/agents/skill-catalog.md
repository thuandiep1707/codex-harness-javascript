# Workflow and internal capability catalog

## Public workflows

Chỉ các entry point dưới `.agents/skills/` được expose cho user qua `$`.

| Workflow | Responsibility |
| --- | --- |
| `frontend-delivery` | Chạy frontend end-to-end từ analysis/Jira đến specialist execution, testing và acceptance |
| `frontend-planning` | Phân tích + tạo/reconcile Jira work graph rồi dừng trước specialist execution |

## Common internal capabilities

| Capability | Owner | Responsibility |
| --- | --- | --- |
| `discover-project-stack` | Brain | Detect framework/library/testing environment từ source/config evidence mà không tự chọn technology |

## Frontend internal capabilities

### Brain

| Capability | Responsibility |
| --- | --- |
| `analyze-frontend-requirements` | Create resumable analysis/revalidation/final acceptance contracts |
| `design-frontend-module-boundary` | Decide bounded-context ownership and DDD placement from product evidence |
| `audit-frontend-supply-chain` | Assess dependency/source adoption risk |
| `audit-frontend-security` | Assess browser/runtime threat surfaces |

### Scrum Master

| Capability | Responsibility |
| --- | --- |
| `manage-jira-work` | Discover current Jira schema, create/reconcile semantic work graphs, synchronize compact Jira state, and persist authorized durable Jira updates |

### Design

| Capability | Responsibility |
| --- | --- |
| `orchestrate-frontend-design` | Use a connected provider and return traceable design evidence |

### Test Plan

| Capability | Responsibility |
| --- | --- |
| `plan-frontend-testing` | Decide the smallest developer self-verification route/scope from bounded relevant docs + actual Coding source change |

### Coding

| Capability | Responsibility |
| --- | --- |
| `migrate-legacy-frontend-module` | Migrate approved legacy behavior within one bounded Coding execution unit |
| `integrate-third-party-frontend` | Implement an approved external integration within one bounded Coding execution unit |
| `nextjs-state-management` | Apply approved state-ownership reasoning when routed |
| `nextjs-tanstack-query` | Implement explicit approved TanStack Query flows when project evidence supports them |
| `shadcn` | Work with shadcn primitives/source mechanics only when shadcn is detected/approved and routed |

### Testing Logic

| Capability | Responsibility |
| --- | --- |
| `testing` | Implement, run, debug, and report bounded non-browser self-tests for the owning Coding work item |

### Testing UI

No internal capability package; the `testing-ui` role uses its configured browser/runtime capabilities and shared testing rules.

## Routing rule

Internal capability availability does not mean it should be loaded.

```text
project evidence
+ approved architecture/dependency direction
+ current execution-unit trigger
+ specialist manifest allowlist
→ smallest routed internal capability set
```

Main chỉ route capability nằm trong specialist manifest allowlist và được current evidence + execution-unit trigger yêu cầu. Capability không được route thì specialist không load. Nếu stack evidence thiếu/conflict thì giữ unresolved thay vì default sang shadcn/Lucide/TanStack/Zustand hoặc library khác.

Test Plan, Testing Logic và Testing UI là transient developer self-verification; chúng không tạo Jira execution unit. Test Plan quyết định `none|logic|ui|both`; Main chỉ dispatch mechanically.
