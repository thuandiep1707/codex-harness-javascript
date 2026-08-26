# Workflow and capability architecture

## Taxonomy

- **Workflow**: user-facing orchestration entry point. Đây là thứ user gọi bằng `$`.
- **Internal capability**: reusable knowledge/workflow fragment của một agent. Không expose bằng `$`.
- **Rule**: mandatory behavior/convention.
- **Protocol**: structured contract giữa controller/agent.

## Public workflow discovery

Codex chỉ discover public workflow trong:

```text
.agents/skills/<workflow-name>/SKILL.md
```

Vì vậy `.agents/skills/` phải được giữ nhỏ và chỉ chứa entry point mà user thực sự cần nhìn thấy.

Current public workflows:

```text
frontend-delivery
frontend-planning
```

Public workflow package:

```text
.agents/skills/<workflow-name>/
├── SKILL.md
└── agents/
    └── openai.yaml
```

`agents/openai.yaml` chỉ là UI metadata, không cấp execution authority.

## Internal capabilities

Knowledge nội bộ nằm ngoài discovery root:

```text
.agents/capabilities/
├── common/
└── frontend/
```

Ví dụ:

```text
.agents/capabilities/common/discover-project-stack/CAPABILITY.md
.agents/capabilities/frontend/plan-frontend-work/SKILL.md
.agents/capabilities/frontend/shadcn/SKILL.md
.agents/capabilities/frontend/testing/SKILL.md
```

Tên file `SKILL.md` còn tồn tại trong một số capability package do lịch sử repo, nhưng directory `.agents/capabilities/` mới là authority phân loại: các package này không phải public Codex skill và không được user invoke trực tiếp.

Agent manifest dùng `internal-capabilities:` làm allowlist path. Specialist chỉ load capability khi capability đó vừa nằm trong manifest allowlist vừa được Orchestrator route trong `issue-handoff`.

## Progressive disclosure

Public side:

1. Codex discover workflow name/description.
2. User hoặc intent routing chọn một workflow.
3. Chỉ workflow đó được load.

Internal side:

1. Workflow spawn đúng agent.
2. Agent đọc manifest/rules.
3. Brain detect project stack bằng evidence rẻ khi cần.
4. Orchestrator route smallest internal-capability set cho từng Subtask.
5. Specialist chỉ load capability được route.
6. Capability chỉ load reference cần cho nhánh hiện tại.

Không scan toàn bộ `.agents/capabilities/**` và không load toàn bộ references “cho chắc”.

## Detection vs decision

`discover-project-stack` được phép detect:

```text
framework
UI library
icon library
styling system
state/data libraries
test runner
```

nhưng detection không phải adoption authority.

Ví dụ `@mui/material` xuất hiện trong project là evidence để route capability phù hợp; nó không tự cho phép upgrade MUI hoặc thay toàn project sang MUI. Nếu không có evidence rõ thì giữ `unresolved`, không default sang shadcn/Lucide/TanStack/Zustand.

## Context isolation

- Brain có thể đọc relevant `.docs` và bounded source/config evidence cho stack discovery.
- Orchestrator đọc relevant `.docs` trong planning/replanning; resume/pause ưu tiên minimal Jira/source evidence.
- Specialist tuyệt đối không đọc `.docs`.
- Internal capability không mở rộng context authority của agent owner.

Agent trao đổi bằng transient protocol objects. Product repo không lưu `.plans/`, `.progresses/`, `.agent/` hoặc workflow state mirror.

## Khi thêm public workflow

1. Xác định user outcome rõ ràng.
2. Tạo package dưới `.agents/skills/`.
3. Giữ workflow ở orchestration level; không nhét implementation knowledge vào đó.
4. Chỉ expose workflow nếu user có lý do thực tế để gọi trực tiếp bằng `$`.
5. Cập nhật public workflow catalog.

Ví dụ future:

```text
$backend-delivery
$backend-planning
```

## Khi thêm internal capability

1. Xác định domain và agent owner.
2. Đặt dưới `.agents/capabilities/<domain>/...`.
3. Viết trigger + negative boundary rõ ràng.
4. Thêm path vào đúng `internal-capabilities:` allowlist của manifest.
5. Chỉ route capability từ Orchestrator khi project evidence + Subtask trigger phù hợp.
6. Không tạo `agents/openai.yaml` nếu capability không phải public workflow.
7. Giữ reference theo progressive disclosure.

Version được quản lý ở repository level bằng Git tag/GitHub Release.
