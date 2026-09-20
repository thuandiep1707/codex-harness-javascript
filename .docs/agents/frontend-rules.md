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

Testing Logic và Testing UI dùng `.agents/rules/testing.md`. Brain, Design và Test Plan chỉ load rule được manifest của mình allow.

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

Coding luôn load decomposition gate nhỏ. Gate chỉ load full `atomic-components.md` khi execution unit thật sự
đụng component/page/screen structure. Sau đó Coding chỉ load các topic rule khác khi trigger có trong
transient handoff hoặc source evidence. Không load toàn bộ topic rules cho mọi task.

## Specialist context boundary

Frontend/testing rules không được dùng làm lý do để đọc `.docs/`. Durable Design/Coding lấy requirement từ
bounded Jira context đúng các key được `issue-handoff` allowlist, cộng transient execution controls/evidence.
Test Plan/Testing tiếp tục dùng `verification-handoff` và bounded evidence, không đọc Jira.

Nếu rule xung đột với handoff, specialist trả blocker. Specialist không tự sửa Jira, parent functional-slice boundary hoặc
workflow scope.

## Khi thêm rule

Chỉ tạo rule mới khi có trigger ổn định, nhiều quyết định liên quan và owner rõ ràng. Micro-rule nên
được thêm vào topic hiện có, trừ khi cần một always-loaded gate ngắn để bảo vệ flow. Khi policy xuất
hiện ở nhiều nơi, chọn một normative owner và dùng cross-reference ngắn ở nơi còn lại.
