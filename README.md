# Frontend Agent System

Hệ thống multi-agent zero-setup dành cho công việc Frontend, trước mắt tập trung vào Next.js và
Codex.

Bạn không cần cài package, chạy CLI, khởi tạo workspace hay copy agent vào repository sản phẩm.
Chỉ cần mở repository này cùng project cần làm việc và chọn repository này làm primary.

## Bắt đầu trong 3 bước

1. Clone repository agent system và project sản phẩm.
2. Mở cả hai trong cùng một Codex Project/Workspace.
3. Chọn repository agent system làm primary rồi bắt đầu chat.

```text
workspace/
├── frontend-agent-system/   ← primary
└── my-nextjs-project/       ← working project
```

Khi repository này là primary, root `AGENTS.md` được dùng làm instruction bền vững cho các chat mới.
Project sản phẩm không cần chứa `.agents/`, `.codex/` hay package của hệ thống.

## Project sản phẩm cần gì?

Project chỉ cần tài liệu dùng chung trong `.docs/`, source và test của chính sản phẩm:

```text
my-nextjs-project/
├── .docs/
│   ├── brd/
│   ├── erd/
│   ├── user-stories/
│   ├── use-cases/
│   ├── acceptance-criteria/
│   └── architecture/
├── src/
└── package.json
```

`.docs/` thuộc project, được commit và là nguồn sự thật về requirement/architecture cho Brain và
Orchestrator.

Hệ thống không tạo `.agent/`, `.plan/`, `.progresses/` hoặc bất kỳ folder nào để lưu kế hoạch, task,
progress hay workflow state trong project sản phẩm. Jira là nguồn trạng thái công việc duy nhất.

## Cách hệ thống hoạt động

```text
Human documents
      ↓
Brain
      ↓
analysis-package.yaml (runtime)
      ↓
Orchestrator
      ↓
Jira Task -> Subtasks
      ↓
Design + Test Plan
      ↓
Coding + Testing
      ↓
Orchestrator reconciliation
      ↓
Brain acceptance
```

### Brain

- Đọc `.docs/` và source evidence cần thiết.
- Phân tích requirement, kiến trúc, ambiguity, contradiction, risk.
- Tạo `analysis-package.yaml` trong workflow context.
- Nghiệm thu cuối theo document gốc, Jira và implementation evidence.
- Không quản lý Jira hay specialist.

### Orchestrator

- Đọc analysis package và `.docs/`.
- Chia functional slice thành Jira Task và các Subtask thực thi.
- Tạo YAML handoff đủ chi tiết cho từng Subtask trong runtime context.
- Chạy specialist theo dependency.
- Quản lý toàn bộ trạng thái, dependency, blocker và completion trên Jira.
- Thu thập artifact/report trong workflow context và tạo reconciliation report.
- Không lưu bản sao Task/Subtask/progress vào repository sản phẩm.
- Không tự làm thay specialist.

### Jira Task/Subtask

```text
Task = một functional slice / user-visible outcome
└── Subtask = một đơn vị công việc có thể thực thi và review độc lập
```

- Mọi Task do agent tạo đều phải có ít nhất một Subtask.
- Specialist chỉ nhận Subtask, không nhận trực tiếp parent Task.
- Một Coding Subtask chỉ chứa một implementation objective thống nhất và write surface rõ ràng.
- Nếu một scope chứa nhiều route/screen, nhiều trách nhiệm độc lập hoặc nhiều phần có thể validate
  riêng, Orchestrator phải chia thành nhiều Subtask.
- Parent Task chỉ hoàn thành khi các Subtask bắt buộc và acceptance criteria đã hoàn thành.

Toàn bộ nội dung Jira do agent tạo phải dùng tiếng Việt: title, description, scope, acceptance
criteria, dependency, blocker, progress comment và completion summary. Giữ nguyên code identifier,
file path, API/framework/library name và thuật ngữ kỹ thuật khi dịch sẽ làm giảm độ chính xác.

### Specialists

| Agent | Trách nhiệm | Đầu vào |
| --- | --- | --- |
| `design` | Làm việc với Figma/Stitch hoặc design provider đã kết nối | Subtask handoff YAML |
| `test-plan` | Tạo test plan theo risk và acceptance criteria | Subtask handoff YAML |
| `coding` | Implement production code trong scope nhỏ đã được phân rã | Subtask handoff YAML + design artifact + source cần thiết |
| `testing` | Viết và chạy unit/component/integration test | Subtask handoff YAML + test-plan artifact + source/build cần thiết |

Mọi specialist tuyệt đối không được đọc `.docs/`. Khi handoff thiếu thông tin, specialist trả blocker
cho Orchestrator thay vì tự tìm tài liệu gốc hoặc tự sáng tác requirement.

## Component decomposition trong Coding

Coding specialist bắt buộc áp dụng component decomposition khi tạo hoặc sửa TSX/component.
Route/page/screen phải đóng vai trò composition boundary thay vì chứa toàn bộ UI của feature trong một
file lớn.

Các section hoặc presentation responsibility có state, interaction, contract hoặc khả năng review
độc lập phải được tách thành component/module-owned file phù hợp trước khi feature được coi là hoàn
thành. File TSX project-authored vượt 300 dòng là structural-review trigger; vượt 500 dòng không được
coi là hoàn thành trừ generated/upstream source hoặc có phê duyệt rõ ràng của developer kèm lý do.
Line count chỉ là guardrail: việc tách vẫn phải dựa trên ownership và responsibility, không tách máy móc
từng đoạn JSX.

## Context isolation

```text
.docs/
   ├── Brain
   └── Orchestrator

Orchestrator
   ├── Subtask handoff ──> Design
   ├── Subtask handoff ──> Test Plan
   ├── handoff + design ─> Coding
   └── handoff + test plan -> Testing
```

Các agent phụ thuộc vào artifact runtime của nhau, không đọc prompt, rule, skill hay hidden reasoning
của agent khác.

## Cấu trúc repository

```text
frontend-agent-system/
├── AGENTS.md
├── README.md
├── .agents/
│   ├── brain/
│   ├── orchestrator/
│   ├── specialists/
│   │   ├── design/
│   │   ├── test-plan/
│   │   ├── coding/
│   │   └── testing/
│   ├── rules/
│   └── skills/
├── .protocols/
└── .codex/
    ├── config.toml
    └── agents/
```

- `AGENTS.md`: bootstrap và workflow của primary controller.
- `.agents/<agent>/`: module, manifest và rule cục bộ của từng agent.
- `.agents/skills/`: vị trí chuẩn để Codex tự nhận diện skill.
- `.agents/rules/`: rule chuyên môn dùng theo allowlist của agent.
- `.protocols/`: template YAML cho communication contract và report runtime.
- `.codex/agents/`: custom agent configuration của Codex.

## Protocol YAML

Structured communication dùng YAML:

- `analysis-package.yaml`
- `issue-handoff.yaml`
- `agent-report.yaml`
- `design-artifact.yaml`
- `test-plan-artifact.yaml`
- `implementation-report.yaml`
- `test-report.yaml`
- `reconciliation-report.yaml`
- `acceptance-report.yaml`

Các YAML này là runtime contract để truyền context giữa agent, không phải workflow storage trong
product repo. Jira là durable workflow state.

## MCP và plugin

Repository không cài đặt, lưu token hay tự kết nối MCP/plugin. Mỗi người dùng tự kết nối Jira,
Figma, Stitch hoặc provider khác trong AI CLI/IDE của họ.

Khi thiếu capability bắt buộc, agent phải dừng:

```yaml
status: blocked
reason:
  code: missing-capability
  capability: figma-mcp
  message: I cannot complete this task because the required Figma MCP is not connected.
```

Agent không được giả vờ đã tạo Jira issue, design file hoặc external artifact.

## Prompt bắt đầu

Ví dụ:

```text
Trong project my-nextjs-project, hãy triển khai user story quản lý người dùng dựa trên .docs.
Chạy đầy đủ Brain → Orchestrator → Specialists → Brain acceptance.
```

Nếu workspace có nhiều project sản phẩm, luôn ghi rõ tên project đích.

## Những gì hệ thống không làm

- Không có `workspace:init`.
- Không có `workspace.yaml`.
- Không có runtime engine riêng.
- Không yêu cầu npm/package cho agent system.
- Không copy agent definitions vào project sản phẩm.
- Không tạo local plan/progress/workflow-state trong project sản phẩm.
- Không quản lý MCP/token/authentication thay người dùng.

## Version

Không version riêng từng agent trong YAML. Toàn bộ hệ thống được version đồng bộ bằng Git tag và
GitHub Release.
