# Skill architecture

Skill là capability hoặc workflow chuyên biệt. Rule là hành vi bắt buộc. Agent manifest quyết định
agent nào được dùng skill/rule nào.

## Discovery và ownership

Codex tự nhận skill trong:

```text
.agents/skills/<skill-name>/SKILL.md
```

Vị trí discovery dùng chung không đồng nghĩa mọi agent được dùng mọi skill. Ownership chính thức nằm
trong:

```text
.agents/<agent>/manifest.yaml
.agents/specialists/<agent>/manifest.yaml
```

Mỗi custom agent chỉ được load skill có tên trong `skills` allowlist của manifest.

## Cấu trúc skill

```text
.agents/skills/<skill-name>/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/        # chỉ tạo khi cần
├── scripts/           # chỉ tạo khi cần logic deterministic
└── assets/            # chỉ tạo khi output cần asset
```

- `SKILL.md`: trigger, workflow, input, output, guardrail.
- `agents/openai.yaml`: metadata giao diện; không cấp authority.
- `references/`: chi tiết chỉ đọc theo nhánh công việc.
- `scripts/`: helper lặp lại được; không thay thế judgment.
- `assets/`: template hoặc asset dùng trong output.

Không tạo README, changelog hay tài liệu phụ bên trong từng skill.

## Progressive disclosure

1. Codex thấy `name` và `description`.
2. Agent chỉ đọc `SKILL.md` khi task đúng trigger và skill nằm trong allowlist.
3. Agent chỉ đọc reference cần cho nhánh hiện tại.

Không quét và nạp toàn bộ skill/reference “cho chắc”.

## Context isolation

- Brain skill được đọc `.docs/`.
- Orchestrator skill được đọc `.docs/` để tạo issue/handoff.
- Specialist skill không được đọc `.docs/`, kể cả khi reference cũ hoặc task text gợi ý làm vậy.
- Specialist thiếu context phải trả blocker cho Orchestrator.

Agent trao đổi qua YAML artifact, không dùng skill của nhau làm handoff.

## Khi thêm hoặc sửa skill

1. Xác định agent owner.
2. Viết trigger có phạm vi dương và ranh giới âm rõ ràng.
3. Giữ `SKILL.md` ngắn; chuyển chi tiết có điều kiện xuống `references/`.
4. Chỉ thêm script khi cần tính deterministic.
5. Đồng bộ `agents/openai.yaml`.
6. Thêm skill vào đúng manifest allowlist.
7. Cập nhật `skill-catalog.md`.
8. Validate frontmatter và naming.

Version được quản lý ở cấp repository bằng Git tag/GitHub Release, không đặt trong từng skill.
