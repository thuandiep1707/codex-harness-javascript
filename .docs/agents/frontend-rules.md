# Frontend rule architecture

Rule định nghĩa convention hoặc hành vi bắt buộc. Rule không phải workflow và không tự cấp authority
để mở rộng scope.

## Ownership

Coding specialist dùng:

```text
.agents/rules/frontend-coding.md
.agents/rules/frontend/*.md
```

Testing specialist dùng:

```text
.agents/rules/testing.md
```

Brain, Orchestrator, Design và Test Plan dùng rule cục bộ trong module của chính mình. Chúng không
load frontend-coding/testing rule trừ khi manifest cho phép.

## Frontend topic rules

| Topic | Trigger |
| --- | --- |
| `atomic-components.md` | Component placement, API, composition, variant |
| `icons-images-assets.md` | Icon, SVG, image, logo, marker, asset |
| `semantics-accessibility.md` | Interactive semantics, heading, form, ARIA, table |
| `styling-layout.md` | CSS, Tailwind, token, layout, responsive behavior |
| `react-state-runtime.md` | Server/client boundary, hook, state, provider, browser API |
| `async-states.md` | Loading, error, empty, permission, missing configuration |
| `generated-ui-validation.md` | Final validation for UI derived from a design artifact |

Coding specialist đọc baseline trước, sau đó chỉ đọc topic có trigger trong issue handoff và source
scope. Không load toàn bộ topic rules cho mọi task.

## Specialist context boundary

Frontend/testing rules không được dùng làm lý do để đọc `.docs/`. Requirement của specialist chỉ đến
từ `issue-handoff.yaml` và artifact được Orchestrator phê duyệt.

Nếu rule xung đột với handoff, specialist trả blocker. Specialist không tự sửa handoff, Jira hoặc
workflow state.

## Khi thêm rule

Chỉ tạo rule mới khi có trigger ổn định, nhiều quyết định liên quan và owner rõ ràng. Micro-rule nên
được thêm vào topic hiện có. Khi policy xuất hiện ở nhiều nơi, chọn một normative owner và dùng
cross-reference ngắn ở nơi còn lại.
