# Frontend Agent System

Hệ thống multi-agent zero-setup cho Frontend, trước mắt tập trung vào Next.js + Codex.

Không cần cài package, chạy CLI, copy agent vào project sản phẩm hay tạo workflow folder trong source.
Mở repository này cùng project cần triển khai trong một Codex Project/Workspace và chọn repository này
làm primary.

```text
workspace/
├── subagent-for-frontend-base/   ← primary / control repo
└── my-nextjs-project/            ← working product repo
```

## 4 nguồn sự thật

```text
Control repo   = Agent Behavior Truth
.docs          = Product Truth
Jira           = Work + Execution Context Truth
Product source = Implementation Truth
```

Chat history không phải workflow truth. Việc xóa chat, đổi máy hoặc đổi developer không được khiến hệ
thống phải phân tích lại từ đầu nếu Jira context vẫn hợp lệ.

Project sản phẩm chỉ cần source/config bình thường và `.docs/`:

```text
my-nextjs-project/
├── .docs/
├── src/
└── package.json
```

Hệ thống không tạo `.plans/`, `.progresses/`, `.agent/` hoặc workflow database khác trong project sản
phẩm.

## Workflow entry

Trước khi gọi Brain, primary controller xác định điểm vào nhỏ nhất từ Jira:

```text
NEW        → Brain analysis → Orchestrator planning
RESUME     → Orchestrator resume → specialist cần thiết
REPLAN     → Brain revalidation → Orchestrator replan phần bị ảnh hưởng
ACCEPTANCE → Brain acceptance
```

Một tab chat mới hoặc một developer tiếp quản công việc đang làm là `RESUME`, không phải `NEW`.

### Resume tối thiểu

Khi resume một Subtask, chỉ dựng lại context từ:

```text
Feature context
   ↓
Parent Functional Task
   ↓
Current Specialist Subtask

+ direct dependency results
+ latest HANDOFF/RESULT
+ relevant current source
```

Không đọc lại toàn bộ Jira project/sprint/comment history. Trước khi resume, hệ thống dùng
`docs-baseline` và danh sách relevant documents để kiểm tra bằng Git metadata xem requirement liên
quan có thay đổi hay không. Không đổi → skip Brain. Có thay đổi material → REPLAN.

## Jira hierarchy

```text
Feature context
  └── Task: một Functional Slice
        └── Subtask: một Specialist Execution Unit
```

Ví dụ:

```text
Feature: Quản lý người dùng

Task: Lọc người dùng theo vai trò
├── Thiết kế trạng thái bộ lọc       # chỉ khi cần
├── Lập kế hoạch kiểm thử bộ lọc     # chỉ khi cần
├── Triển khai bộ lọc người dùng
└── Kiểm thử bộ lọc người dùng
```

Parent Task là scope/acceptance boundary, không phải execution unit. Specialist chỉ thực thi Subtask.
Không bắt buộc mọi Task phải có đủ Design + Test Plan + Coding + Testing.

Orchestrator luôn chia theo thứ tự:

```text
requirement
→ user outcomes
→ functional slices
→ Tasks
→ specialist Subtasks
```

Không chia feature trước theo agent role.

## Jira context inheritance

Để giảm token và tránh duplicate:

- Feature lưu common product/architecture context.
- Task chỉ lưu functional-slice delta.
- Subtask chỉ lưu specialist execution delta.
- Orchestrator ghép ba lớp + direct dependency evidence thành một transient `issue-handoff` khi spawn
  specialist.

Handoff/report YAML là communication object giữa agent, không phải runtime file cần commit hay lưu vào
product repo.

Tất cả Jira content hướng tới con người như title, description, scope, acceptance criteria, blocker,
result và handoff note phải dùng tiếng Việt. Technical identifiers như path, API, component name,
command, Jira key và machine metadata giữ nguyên khi cần.

## Durable execution notes

Không ghi nhật ký reasoning từng bước lên Jira. Chỉ dùng các checkpoint ngắn khi cần:

- `[BLOCKER]`: thiếu context/capability làm dừng Subtask.
- `[RESULT]`: kết quả hoàn thành + validation evidence.
- `[REVISION]`: yêu cầu sửa sau review/reconciliation.
- `[HANDOFF]`: checkpoint để developer/session khác tiếp tục Subtask đang làm.

`[HANDOFF]` chỉ cần branch/source identity khi relevant, phần đã xong, phần còn lại, validation state và
blocker. Assignee + Jira status là execution ownership; không có lock system thứ hai.

## Agent roles

| Agent | Trách nhiệm |
| --- | --- |
| `brain` | Phân tích requirement, architecture, ambiguity; revalidate khi docs đổi; nghiệm thu cuối |
| `orchestrator` | Planning/resume Jira context, decomposition, specialist routing, reconciliation |
| `design` | Tạo design evidence qua provider đã kết nối |
| `test-plan` | Tạo risk-based test-plan evidence |
| `coding` | Implement một bounded Coding Subtask |
| `testing` | Viết/chạy test cho một bounded Testing Subtask |

Brain và Orchestrator có thể đọc `.docs/` theo mode được phép. Specialist tuyệt đối không đọc `.docs/`;
chúng chỉ nhận transient handoff + dependency evidence + source/provider state được allow.

## Coding decomposition guard

Coding luôn load một decomposition gate nhỏ. Khi task tạo/chỉnh page, screen hoặc component, gate mới
load full Atomic component rule và yêu cầu xác định composition root, presentation responsibilities,
ownership, target files và public contracts trước source write.

Handwritten TSX từ 300 dòng phải decomposition review; từ 500 dòng không được report `completed` nếu
chưa split theo responsibility hoặc có developer-approved exception. Đây là safety alarm, không phải
lý do tách component máy móc theo line count.

## Repository structure

```text
subagent-for-frontend-base/
├── AGENTS.md
├── README.md
├── .agents/
│   ├── brain/
│   ├── orchestrator/
│   ├── specialists/
│   ├── rules/
│   └── skills/
├── .protocols/
└── .codex/
    ├── config.toml
    └── agents/
```

- `AGENTS.md`: bootstrap + workflow entry contract của primary controller.
- `.agents/<agent>/`: role, manifest và local rules.
- `.agents/skills/`: reusable workflows được manifest allow.
- `.agents/rules/`: domain coding/testing rules.
- `.protocols/`: YAML schemas cho transient communication objects.
- `.codex/agents/`: Codex custom-agent bootstrap.

## External capabilities

Repo không cài MCP/plugin, không lưu token và không tự cấu hình Jira/Figma/Stitch. Khi capability bắt
buộc không tồn tại, agent trả `missing-capability` thay vì giả vờ đã tạo external state.

## Prompt examples

New work:

```text
Trong project my-nextjs-project, triển khai user story quản lý người dùng dựa trên .docs.
```

Resume rõ Jira key:

```text
Trong project my-nextjs-project, tiếp tục FE-115.
```

Nếu workspace có nhiều product repo, luôn ghi rõ project đích.

## Non-goals

- Không có `workspace:init` hoặc `workspace.yaml`.
- Không có runtime engine/package riêng.
- Không copy agent definitions vào product repo.
- Không tạo `.plans/`, `.progresses/`, `.agent/`.
- Không dùng chat memory làm persistence contract.
- Không quản lý MCP/token/authentication thay người dùng.

## Version

Không version riêng từng agent trong YAML. Hệ thống được version đồng bộ bằng Git tag và GitHub
Release.
