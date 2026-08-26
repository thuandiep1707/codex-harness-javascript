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

### Orchestrator

| Capability | Responsibility |
| --- | --- |
| `plan-frontend-work` | Plan/resume/pause Jira-backed Functional Tasks/Subtasks, capability routing, handoff composition, reconciliation |

### Design

| Capability | Responsibility |
| --- | --- |
| `orchestrate-frontend-design` | Use a connected provider and return traceable design evidence |

### Test Plan

| Capability | Responsibility |
| --- | --- |
| `plan-frontend-testing` | Convert one bounded handoff into a risk-based test-plan artifact |

### Coding

| Capability | Responsibility |
| --- | --- |
| `migrate-legacy-frontend-module` | Migrate approved legacy behavior within one bounded Coding Subtask |
| `integrate-third-party-frontend` | Implement an approved external integration within one bounded Coding Subtask |
| `nextjs-state-management` | Apply approved state-ownership reasoning when routed |
| `nextjs-tanstack-query` | Implement explicit approved TanStack Query flows when project evidence supports them |
| `shadcn` | Work with shadcn primitives/source mechanics only when shadcn is detected/approved and routed |

### Testing

| Capability | Responsibility |
| --- | --- |
| `testing` | Implement, run, debug, and report one bounded Testing Subtask |

## Routing rule

Internal capability availability does not mean it should be loaded.

```text
project evidence
+ approved architecture/dependency direction
+ current Subtask trigger
+ specialist manifest allowlist
→ smallest routed internal capability set
```

Capability không được route thì specialist không load. Nếu stack evidence thiếu/conflict thì giữ unresolved thay vì default sang shadcn/Lucide/TanStack/Zustand hoặc library khác.

Routine lint/typecheck/build/browser validation không tự tạo Testing Subtask. Test planning và test implementation vẫn là specialist responsibilities riêng.
