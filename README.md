# Codex Multi-Agent Delivery System

Hệ thống multi-agent zero-setup cho Codex. Repo này là control repo; project sản phẩm mở song song trong cùng workspace.

```text
workspace/
├── codex-subagent-base/   ← primary / control repo
└── product-project/       ← working repo
```

## 4 nguồn sự thật

```text
Control repo   = Workflow + Agent Behavior Truth
.docs          = Product Truth
Jira           = Work + Execution Context Truth
Product source = Implementation Truth
```

Chat history không phải workflow truth. Product repo không tạo `.plans/`, `.progresses/`, `.agent/` hoặc workflow database khác.

## Public Workflow vs Internal Capability

Đây là thay đổi kiến trúc quan trọng nhất của V1 hiện tại.

### Public workflow — user gọi bằng `$`

Chỉ những package dưới `.agents/skills/` được expose ra Codex picker.

Hiện tại:

```text
$frontend-delivery
$frontend-planning
```

`$frontend-delivery` chạy end-to-end:

```text
.docs/source
   ↓
Brain analysis + stack discovery
   ↓
Orchestrator Jira planning
   ↓
Design / Test Plan khi cần
   ↓
Coding
   ↓
Testing
   ↓
Reconciliation
   ↓
Brain Acceptance
```

Nó không dừng chỉ vì Jira Task/Subtask vừa được tạo. Workflow chỉ dừng khi user pause, thiếu capability, có blocker/approval thật sự, hoặc đã hoàn thành acceptance.

`$frontend-planning` chỉ:

```text
.docs/source
   ↓
Brain analysis
   ↓
Orchestrator
   ↓
Jira Feature / Task / Subtask
   ↓
STOP
```

### Internal capability — agent tự load khi cần

Knowledge nội bộ nằm dưới `.agents/capabilities/`, ví dụ:

```text
.agents/capabilities/common/discover-project-stack/
.agents/capabilities/frontend/plan-frontend-work/
.agents/capabilities/frontend/shadcn/
.agents/capabilities/frontend/nextjs-tanstack-query/
.agents/capabilities/frontend/testing/
```

Các capability này không phải user entry point và không nên xuất hiện trong `$` picker.

Agent chỉ được load capability khi:

1. capability nằm trong allowlist của `manifest.yaml`;
2. Orchestrator/handoff route capability đó cho đúng Subtask.

Không load tất cả capability “cho chắc”.

## Execution intent và lifecycle khác nhau

Hai khái niệm được tách riêng:

```text
Execution intent
├── plan-only
└── deliver

Lifecycle entry
├── NEW
├── RESUME
├── REPLAN
├── PAUSE
└── ACCEPTANCE
```

Ví dụ:

```text
$frontend-delivery + NEW
→ Brain → Jira planning → Coding/Testing → Acceptance

$frontend-planning + NEW
→ Brain → Jira planning → STOP

$frontend-delivery + RESUME
→ skip Brain nếu docs baseline còn hợp lệ → tiếp tục đúng Subtask
```

`planning` của Orchestrator không còn đồng nghĩa với “tạo Jira rồi dừng”. Quyết định dừng hay chạy tiếp do execution intent quyết định.

## Project stack discovery

Brain có internal capability `discover-project-stack` để đọc evidence rẻ trước:

```text
package.json / lockfile
→ framework config
→ UI/component config
→ representative imports khi cần
→ source sâu hơn chỉ khi evidence conflict
```

Brain có thể detect các thông tin như:

```text
framework
UI library
icon library
styling system
client-state library
server-state library
test runner
package manager
```

Ví dụ project hiện tại dùng:

```text
@mui/material
@mui/icons-material
@tanstack/react-query
```

thì Orchestrator route capability phù hợp với MUI/TanStack khi capability tồn tại; Coding không được tự dùng shadcn/Lucide chỉ vì control repo có knowledge đó.

Nếu evidence không đủ:

```text
ui-library: unresolved
```

Không tự mặc định shadcn, Lucide, Zustand, TanStack Query hoặc library nào khác.

Detection ≠ adoption. Việc package đã tồn tại không tự cấp quyền cài mới, upgrade, replace hoặc standardize library.

## Jira hierarchy

```text
Feature context
  └── Task: một Functional Slice
        └── Subtask: một Specialist Execution Unit
```

Orchestrator chia theo:

```text
requirement
→ user outcomes
→ functional slices
→ Tasks
→ specialist Subtasks
```

Không chia feature trước theo agent role hay file/component.

Context inheritance:

- Feature lưu common product/architecture + implementation-environment metadata cần cho routing.
- Task lưu functional-slice delta.
- Subtask lưu specialist delta + capability identifiers cần cho execution/resume.
- Specialist nhận transient `issue-handoff`, không đọc `.docs`.

Jira content hướng tới con người phải bằng tiếng Việt; technical identifiers giữ nguyên khi cần.

## PAUSE / HANDOFF

Khi workflow active, các câu tự nhiên như:

```text
dừng lại
tạm dừng
để mai làm tiếp
bàn giao ở đây
```

được hiểu là `PAUSE`.

Flow:

```text
User pause
  ↓
freeze new dispatch
  ↓
collect available specialist/source evidence
  ↓
reconcile Jira ↔ actual execution
  ↓
persist missing RESULT/status corrections
  ↓
persist HANDOFF
  ↓
status: paused
```

Không được coi việc đổi Jira status là đủ. Nếu Jira không ghi được durable checkpoint thì trả `pause-blocked`.

`[HANDOFF]` chỉ giữ continuation essentials:

```text
Source: repository / branch / commit khi relevant
Đã hoàn thành: ...
Còn lại: ...
Validation: ...
Blocker: ...
Tiếp theo: Jira key / hành động tiếp theo
```

## Agent roles

| Agent | Trách nhiệm |
| --- | --- |
| `brain` | Requirement, architecture reasoning, stack discovery, revalidation, acceptance |
| `orchestrator` | Jira planning/resume/pause, capability routing, specialist coordination, reconciliation |
| `design` | External design-provider execution |
| `test-plan` | Risk-based test-plan evidence |
| `coding` | Bounded implementation với capability được route |
| `testing` | Bounded test implementation/execution với capability được route |

Specialist không được đọc `.docs`, không update Jira và không tự mở rộng scope.

## Coding decomposition guard

Coding luôn load decomposition gate nhỏ. Khi tạo/chỉnh page/screen/component, gate yêu cầu xác định composition root, responsibilities, ownership và public contract trước source write.

Handwritten TSX:

- `>= 300` dòng: bắt buộc decomposition review;
- `>= 500` dòng: không được report complete nếu chưa split hoặc có approved exception.

Line count là alarm, không phải nguyên tắc kiến trúc.

## Repository structure

```text
codex-subagent-base/
├── AGENTS.md
├── README.md
├── .agents/
│   ├── brain/
│   ├── orchestrator/
│   ├── specialists/
│   ├── rules/
│   ├── skills/              # PUBLIC workflows only
│   │   ├── frontend-delivery/
│   │   └── frontend-planning/
│   └── capabilities/        # INTERNAL knowledge
│       ├── common/
│       ├── frontend/
│       └── backend/         # future
├── .protocols/
└── .codex/
```

Kiến trúc này cho phép mở rộng sau này mà không làm `$` picker phình ra:

```text
$frontend-delivery
$frontend-planning
$backend-delivery      # future
$backend-planning      # future
```

trong khi hàng chục capability FE/BE/Design vẫn ẩn và chỉ load theo evidence/trigger.

## External capabilities

Repo không tự cài MCP/plugin, không lưu token và không tự cấu hình Jira/Figma/Stitch. Khi capability bắt buộc không tồn tại, agent trả blocker thay vì giả vờ đã tạo external state.

## Non-goals

- Không có runtime engine/package riêng.
- Không copy agent definitions vào product repo.
- Không dùng chat memory làm persistence contract.
- Không expose internal capability thành user command.
- Không hard-code shadcn/Lucide/TanStack/Zustand thành project policy.

## Version

Hệ thống được version đồng bộ bằng Git tag/GitHub Release, không version riêng từng agent/capability.
