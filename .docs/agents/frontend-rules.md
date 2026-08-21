# Frontend rule architecture

Rule định nghĩa convention hoặc hành vi bắt buộc. Rule không phải workflow và không tự cấp authority
để mở rộng scope.

## Ownership

Coding specialist dùng:

```text
.agents/specialists/coding/rules/component-decomposition-gate.md
.agents/rules/frontend-coding.md
.agents/rules/frontend/*.md
```

Testing specialist dùng `.agents/rules/testing.md` cùng local rule của chính nó. Brain, Orchestrator,
Design và Test Plan chỉ load rule được manifest của mình allow.

## Frontend topic rules

| Topic | Trigger |
| --- | --- |
| `atomic-components.md` | Component placement, API, composition, variant |
| `icons-images-assets.md` | Icon, SVG, image, logo, marker, asset |
| `semantics-accessibility.md` | Interactive semantics, heading, form, ARIA, table |
| `styling-layout.md` | CSS, Tailwind, token, layout, responsive behavior |
| `react-state-runtime.md` | Server/client boundary, hook, state, provider, browser API |
| `async-states.md` | Loading, error, empty, permission, missing configuration |
| `generated-ui-validation.md` | Final validation for UI derived from design evidence |

Coding luôn load decomposition gate nhỏ. Gate chỉ load full `atomic-components.md` khi Subtask thật sự
đụng component/page/screen structure. Sau đó Coding chỉ load các topic rule khác khi trigger có trong
transient handoff hoặc source evidence. Không load toàn bộ topic rules cho mọi task.

## Specialist context boundary

Frontend/testing rules không được dùng làm lý do để đọc `.docs/`. Requirement của specialist chỉ đến
từ transient `issue-handoff` và dependency evidence được Orchestrator cung cấp.

Nếu rule xung đột với handoff, specialist trả blocker. Specialist không tự sửa Jira, parent Task hoặc
workflow scope.

## Khi thêm rule

Chỉ tạo rule mới khi có trigger ổn định, nhiều quyết định liên quan và owner rõ ràng. Micro-rule nên
được thêm vào topic hiện có, trừ khi cần một always-loaded gate ngắn để bảo vệ flow. Khi policy xuất
hiện ở nhiều nơi, chọn một normative owner và dùng cross-reference ngắn ở nơi còn lại.
