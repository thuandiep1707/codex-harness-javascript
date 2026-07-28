# Hệ thống rule frontend cho agent

## Mục đích

Tài liệu này giải thích cách repository tổ chức các quy tắc frontend nhỏ nhưng xuất hiện thường xuyên khi agent triển khai từ requirement hoặc design. Đây là tài liệu dành cho developer; nguồn vận hành vẫn là `AGENTS.md`, `.analysis/README.md`, `.agents/rules/frontend-coding.md`, các topic rule được định tuyến, cấu hình đang chạy và active task scope/plan khi tier yêu cầu.

Hệ thống dùng một baseline ổn định cùng các topic rule theo context để tránh hai cực đoan:

- dồn mọi chi tiết vào `AGENTS.md` hoặc một rule khổng lồ; hoặc
- tạo một skill/file riêng cho từng quy tắc rất nhỏ.

## Phân chia trách nhiệm

```text
AGENTS.md
    -> workflow, authority và frontend entry point
.analysis/README.md
    -> quyết định kiến trúc đã được developer duyệt
.agents/rules/frontend-coding.md
    -> frontend safety baseline mỏng, invariant riêng của repository và topic router
.agents/rules/frontend/*.md
    -> coding decision chi tiết theo evidence của task
.agents/skills/*/SKILL.md
    -> workflow chuyên biệt, nhiều bước, có output/gate riêng
.docs/agents/*.md
    -> giải thích cho developer, không phải operational authority
tooling
    -> enforce phần deterministic qua TypeScript, ESLint, Prettier, build và test đã duyệt
```

Agent luôn đọc `frontend-coding.md` cho frontend work, sau đó chỉ đọc topic rule có trigger phù hợp. Baseline không lặp lại chi tiết do topic rule sở hữu. Một task tạo component từ design thường cần nhiều topic; một task chỉ sửa data mapper không cần tải rule icon hoặc styling.

Bảng routing trong `frontend-coding.md` là trigger canonical. Phần mở đầu của topic chỉ làm rõ trigger
đó, không được tự mở rộng scope. Sau khi topic đã trigger, agent chỉ theo internal mode phù hợp với
evidence, và một cross-reference không tự động kích hoạt topic khác.

Task tier nằm trong `AGENTS.md`: review-only không ghi repository; routine change dùng compact plan;
governed change giữ full impact/progress/testing workflow. Tier chỉ điều chỉnh quy trình, không làm một
topic rule đã trigger trở thành tùy chọn.

## Topic rule hiện tại

| Topic                        | Khi đọc                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `atomic-components.md`       | Tạo/split/đặt component, dùng shadcn, thiết kế props, variant, children, slot hoặc callback      |
| `icons-images-assets.md`     | Icon, SVG, image, logo, marker hoặc asset                                                        |
| `semantics-accessibility.md` | Interactive markup, navigation, heading, form, accessible name, ARIA hoặc table                  |
| `styling-layout.md`          | CSS, Tailwind, token, visual variant hoặc desktop layout                                         |
| `react-state-runtime.md`     | Server/Client boundary, state, effect, hook, provider/store, browser API hoặc code splitting     |
| `async-states.md`            | Loading, error, empty, no-result, no-selection, not-found, permission hoặc missing configuration |
| `generated-ui-validation.md` | Review cuối cho UI được generate hoặc dựng lại đáng kể từ design/provider artifact               |

Mỗi quyết định có một normative owner. Topic khác chỉ giữ safety reference ngắn và handoff cần thiết.
Skill sở hữu workflow chuyên biệt; rule sở hữu policy mà code và kết quả workflow phải tuân theo.
Riêng `generated-ui-validation.md` là evidence index cuối, không phải bản sao policy của các topic.

## Nguyên tắc thêm quy tắc mới

Một convention nhỏ nên được bổ sung vào topic đang sở hữu thời điểm ra quyết định của nó. Không tạo file mới chỉ vì câu rule có tên riêng. Chỉ tạo topic mới khi:

1. Có trigger riêng, ổn định và dễ nhận biết.
2. Có nhiều quyết định liên quan cần đọc cùng lúc.
3. Không thuộc rõ ràng vào topic hiện hữu.
4. Việc tách giúp agent tránh nạp context không liên quan.

Mỗi topic rule nên dùng cấu trúc nhất quán khi phù hợp:

- `Scope` hoặc `Trigger`: khi nào rule áp dụng.
- `Internal mode`: nhánh nào cần đọc sau khi topic đã trigger.
- `Owns / Does not own / Handoff`: ranh giới với topic hoặc skill khác.
- `Required`: invariant bắt buộc.
- `Decision flow`: thứ tự kiểm tra và lựa chọn.
- `Avoid`: cách xử lý bị cấm.
- `Approval gate`: quyết định nào cần developer duyệt.
- `Specialized evidence`: dữ liệu riêng của topic bổ sung vào unresolved/completion record chung trong baseline.

## Khi nào dùng skill thay vì rule

Rule trả lời “code phải tuân theo điều gì”. Skill trả lời “agent thực hiện một workflow chuyên biệt nhiều bước như thế nào”. Một micro-rule không trở thành skill chỉ vì nó quan trọng.

Chỉ cân nhắc skill mới khi công việc có trigger lặp lại, chuỗi bước/evidence rõ ràng, output contract riêng, gate/handoff riêng và ranh giới khác biệt với skill hiện có. Ví dụ migration, security audit hoặc design orchestration là skill; chọn semantic element, icon Lucide hoặc CVA variant là rule.

## Quan hệ với Atomic Design và shadcn/ui

`src/components/ui` là toàn bộ tầng atoms. Folder này chứa cả component cài từ shadcn registry và custom atom đã được developer duyệt theo convention tương thích shadcn. Agent phải phân rã design từ dưới lên, nhưng placement đồng thời xét Atomic level và DDD ownership; một component nhỏ mang business semantics không tự động trở thành shared atom.

Provider-returned HTML, JSX, CSS hoặc SVG chỉ là design evidence. Implementation phải ánh xạ artifact về component, token và contract đã được repository duyệt trước.

## Unresolved decision không block toàn issue

Khi thiếu icon, token, custom atom, hook/provider/store approval hoặc async-state design, agent dừng phần phụ thuộc trực tiếp nhưng tiếp tục các phần độc lập trong plan. Cuối task, agent tổng hợp một lần owner, trigger, evidence đã kiểm tra, phương án bị loại và quyết định cần developer duyệt. Phần phụ thuộc chưa được phép báo hoàn tất.

## Đồng bộ khi thay đổi rule system

Khi thêm hoặc đổi một project-wide frontend convention:

1. Cập nhật `.analysis/README.md` nếu quyết định kiến trúc thay đổi.
2. Giữ `AGENTS.md` ngắn và chỉ cập nhật entry invariant/routing khi cần.
3. Chỉ cập nhật invariant riêng hoặc routing trong baseline `frontend-coding.md`; để chi tiết ở topic owner.
4. Cập nhật đúng topic rule sở hữu quyết định.
5. Khi policy xuất hiện ở nhiều topic, chọn một normative owner và đổi các bản còn lại thành reference/handoff.
6. Giữ generated-UI index bao phủ đủ concern nhưng không chép lại policy của owner.
7. Cập nhật tài liệu này nếu topic catalog hoặc maintenance model thay đổi.
8. Đồng bộ bảng routing trong `AGENTS.md` khi entry routing thay đổi, nhưng không chép topic policy vào entry point.
9. Kiểm tra link/path, trigger, owner, deferral, diff và baseline validation theo plan đã duyệt.

Không tự động thêm custom lint/plugin cho mỗi prose rule. Chỉ chuyển một rule sang automated enforcement sau khi có lỗi lặp lại, cách kiểm tra deterministic và developer duyệt chi phí tooling.
