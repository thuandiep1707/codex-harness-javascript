# Frontend Agent System

Hệ thống multi-agent zero-setup dành cho công việc Frontend, trước mắt tập trung vào Next.js và
Codex.

Bạn không cần cài package, chạy CLI, khởi tạo workspace hay copy agent vào repository sản phẩm.
Chỉ cần mở repository này cùng project cần làm việc và chọn repository này làm primary.

## Bắt đầu trong 3 bước

1. Clone repository agent system và project sản phẩm.
2. Mở cả hai trong cùng một Codex Project/Workspace.
3. Chọn `frontend-agent-system` làm primary rồi bắt đầu chat.

```text
workspace/
├── frontend-agent-system/   ← primary
└── my-nextjs-project/       ← working project
```

Khi repository này là primary, root `AGENTS.md` được dùng làm instruction bền vững cho các chat mới.
Project sản phẩm không cần chứa `.agents/`, `.codex/` hay package của hệ thống.

## Project sản phẩm cần gì?

Project chỉ cần tài liệu dùng chung trong `.docs/`:

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

`.docs/` thuộc project, được commit và là nguồn sự thật cho con người lẫn mọi AI agent.

Trong lần chạy đầu tiên, hệ thống tạo dữ liệu local:

```text
my-nextjs-project/
└── .agent/
    ├── artifacts/
    ├── state/
    ├── tasks/
    └── reports/
```

Để `.agent/` không xuất hiện trong Git mà không sửa `.gitignore` dùng chung, thêm dòng sau vào
`my-nextjs-project/.git/info/exclude`:

```gitignore
/.agent/
```

## Cách hệ thống hoạt động

```text
Human documents
      ↓
Brain
      ↓
analysis-package.yaml
      ↓
Orchestrator
      ↓
Jira issues + issue-handoff.yaml
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
- Tạo `analysis-package.yaml`.
- Nghiệm thu cuối theo document gốc.
- Không quản lý Jira, task, cache hay specialist.

### Orchestrator

- Đọc analysis package và `.docs/`.
- Chia task, xây dependency graph và tạo Jira issue.
- Tạo YAML handoff đủ chi tiết cho từng specialist.
- Chạy specialist theo dependency.
- Quản lý Jira và `.agent/state/`.
- Thu thập artifact và tạo reconciliation report.
- Không tự làm thay specialist.

### Specialists

| Agent | Trách nhiệm | Đầu vào |
| --- | --- | --- |
| `design` | Làm việc với Figma/Stitch hoặc design provider đã kết nối | Jira issue YAML |
| `test-plan` | Tạo test plan theo risk và acceptance criteria | Jira issue YAML |
| `coding` | Implement production code trong scope | Jira issue YAML + design artifact + source cần thiết |
| `testing` | Viết và chạy unit/component/integration test | Jira issue YAML + test-plan artifact + source/build cần thiết |

Mọi specialist tuyệt đối không được đọc `.docs/`. Khi handoff thiếu thông tin, specialist trả blocker
cho Orchestrator thay vì tự tìm tài liệu gốc hoặc tự sáng tác requirement.

## Context isolation

```text
.docs/
   ├── Brain
   └── Orchestrator

Orchestrator
   ├── issue-handoff.yaml ──> Design
   ├── issue-handoff.yaml ──> Test Plan
   ├── issue + design ──────> Coding
   └── issue + test plan ───> Testing
```

Các agent phụ thuộc vào artifact của nhau, không đọc prompt, rule, skill hay hidden reasoning của
agent khác.

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
- `.protocols/`: template YAML cho mọi handoff, artifact, report và state.
- `.codex/agents/`: custom agent configuration của Codex.

## Protocol YAML

Tất cả structured communication dùng YAML:

- `analysis-package.yaml`
- `issue-handoff.yaml`
- `agent-report.yaml`
- `design-artifact.yaml`
- `test-plan-artifact.yaml`
- `implementation-report.yaml`
- `test-report.yaml`
- `reconciliation-report.yaml`
- `acceptance-report.yaml`
- `workflow-state.yaml`

Markdown chỉ được dùng bên trong multiline YAML field khi cần nội dung dài. Tên agent, file, folder,
ID và YAML key dùng `kebab-case`.

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
- Không sửa shared `.gitignore` nếu người dùng không yêu cầu.
- Không quản lý MCP/token/authentication thay người dùng.

## Version

Không version riêng từng agent trong YAML. Toàn bộ hệ thống được version đồng bộ bằng Git tag và
GitHub Release.
