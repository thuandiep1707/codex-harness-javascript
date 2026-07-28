# Báo cáo đối soát và nâng cấp skill shadcn/ui

## Trạng thái

`completed` - 2026-07-22

Báo cáo này thay thế kết luận thăm dò ban đầu bằng trạng thái sau triển khai.
Phạm vi chỉ là hệ thống agent skill/rule/documentation; không thay đổi source ứng
dụng, dependency, component đã cài hoặc bounded context.

## 1. Kết luận điều hành

Skill `shadcn` có thể cùng tồn tại với bộ frontend skill cũ sau khi được thu hẹp.
Mô hình cuối cùng là:

- Các skill cũ và repository rules tiếp tục làm chủ kiến trúc, design, adoption,
  integration, security, TanStack Query và testing.
- `shadcn` chỉ làm chủ CLI, preset, registry inspection, official primitive,
  component docs, upstream diff và shadcn-specific composition.
- Official `@shadcn` primitive đi trực tiếp qua `shadcn`; inspect/dry-run có thể
  diễn ra trước implementation approval, mutation chỉ diễn ra sau approval.
- Community namespace, GitHub registry và nguồn cấu hình khác là third-party
  source: chỉ được inspect trước; adoption phải qua `audit-frontend-supply-chain`
  và developer approval.
- Không skill nào tự trigger chỉ vì repository có `components.json`.
- Không xóa reference kỹ thuật nào trong skill shadcn. File duy nhất đổi tên là
  `agents/openai.yml` thành `agents/openai.yaml`.
- `skills-lock.json` đã được developer chủ động xóa và không được khôi phục.

Đánh giá cuối: `adopt-with-controls`. Không còn xung đột quyền sở hữu mức cao;
rủi ro còn lại chủ yếu là độ mới của reference và việc phải thực thi đúng gate.

## 2. Evidence và giới hạn

Đã đối chiếu:

- `AGENTS.md`;
- `.analysis/README.md` và báo cáo thăm dò trước đó;
- `src/modules/README.md`;
- `.agents/rules/frontend-coding.md`;
- `.docs/agents/skill.md` và `.docs/agents/frontend-rules.md`;
- toàn bộ entry point và reference liên quan trong
  `.agents/skills/shadcn/`;
- các frontend skill cũ: module boundary, migration, supply-chain,
  third-party integration, security, testing, TanStack Query và design
  orchestration;
- `components.json`, `package.json`, `package-lock.json` và UI files hiện có.

Observed baseline:

- shadcn CLI được khai báo `^4.13.0` và đang được `package-lock.json` resolve
  thành `4.13.0`.
- Project dùng Radix/Vega, RSC, TypeScript, Tailwind v4, Lucide và alias
  `@/components/ui`.
- Tại thời điểm kiểm tra, `src/components/ui/button.tsx` là primitive duy nhất
  hiện diện trong UI path. Ví dụ về Field, InputGroup, Empty hoặc chat không
  chứng minh các primitive đó đã được cài.
- Không thực hiện network audit, registry download, package installation hoặc
  shadcn add/update. Báo cáo đánh giá governance, không xác nhận độ an toàn của
  một registry item cụ thể.

## 3. Authority model cuối cùng

| Quyết định                                            | Owner chính                                                  | Vai trò của shadcn                                   |
| ----------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| Bounded context, DDD placement                        | `design-frontend-module-boundary`, `.analysis`, module rules | Handoff khi ownership chưa rõ; không tự quyết        |
| Shared UI/Atomic placement và public API              | `AGENTS.md` và frontend rules                                | Tuân theo placement đã duyệt                         |
| Visual solution mới                                   | `orchestrate-frontend-design` và developer approval          | Chỉ chọn/compose primitive sau design approval       |
| Official primitive, CLI, preset, docs                 | `shadcn`                                                     | Inspect trực tiếp; mutation theo approved scope      |
| Community/GitHub registry adoption                    | `audit-frontend-supply-chain` và developer approval          | shadcn inspect trước audit; apply sau approval       |
| Feature-level runtime/global integration              | `integrate-third-party-frontend`                             | Thực thi phần CLI/component sau integration decision |
| XSS, CSP, token, upload, streaming và browser threats | `audit-frontend-security`                                    | Không thay thế security review                       |
| Query/mutation/cache/hydration                        | `nextjs-tanstack-query`                                      | Registry/demo data code chỉ là ví dụ                 |
| Test layer và test files                              | `testing` sau Decision Gate                                  | Không tự tạo test                                    |

Thứ tự authority vận hành:

`current developer instruction -> approved plan -> AGENTS.md -> .analysis ->
module/rule ownership -> live project configuration -> shadcn workflow`.

## 4. Phần trùng lặp đã cắt khỏi SKILL.md

| Nội dung cũ                                         | Nguyên nhân cắt hoặc chuyển                              | Nguồn thay thế                                        |
| --------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| Trigger “any project with a components.json file”   | Làm shadcn áp vào gần như mọi frontend task              | Trigger trực tiếp shadcn hoặc implementation đã duyệt |
| Eager interpolation `npx shadcn@latest info --json` | Chạy CLI trước khi biết task có cần context hay không    | `info` chỉ chạy có điều kiện                          |
| Atomic/DDD override dài                             | Lặp `AGENTS.md`, `.analysis` và frontend rules; dễ drift | Một authority/handoff section ngắn                    |
| Decision Gate copy trong shadcn                     | Dễ hỏi sai thời điểm và làm shadcn có vẻ sở hữu testing  | Workflow testing chung của repository                 |
| Principles và “check community registries too”      | Khuyến khích chọn source ngoài trước audit               | Exact registry + source-adoption gate                 |
| Critical Rules summary                              | Lặp lại các file `rules/*.md`                            | Load reference theo topic                             |
| Key Patterns và Component Selection table           | Nạp nhiều ví dụ dù task chỉ là CLI/docs/preset           | Reference conditional và docs đúng component          |
| Key Fields listing                                  | Lặp output `info` và có thể stale                        | Đọc live config, chạy `info` khi cần                  |
| Quick Reference dài                                 | Tăng context và đẩy `@latest` thành default              | `cli.md`; ưu tiên CLI local đã lock                   |

Không xóa `rules/forms.md`, `rules/composition.md`, `rules/chat.md`,
`rules/icons.md`, `rules/styling.md`, `rules/base-vs-radix.md`, `cli.md`,
`registry.md` hoặc `customization.md`. Chúng là technical reference được load
có điều kiện, không phải authority toàn repo.

## 5. Cảnh báo và cách xử lý

| Mức | Cảnh báo ban đầu                                    | Nguyên nhân                                                              | Sửa chữa đã áp dụng                                                                       | Trạng thái |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------- |
| P0  | Community registry có thể bypass adoption review    | Registry item có thể thêm source, package, CSS, asset, hook hoặc runtime | `shadcn inspect-only` xác định exact item; supply-chain + approval trước shadcn apply     | Resolved   |
| P1  | Trigger quá rộng                                    | `components.json` tồn tại trong project                                  | Description mới cấm trigger chỉ vì file config tồn tại                                    | Resolved   |
| P1  | Import primitive chưa cài                           | Rule examples giả định Field/chat/Empty tồn tại                          | Main workflow và forms/composition references bắt buộc availability check + dry-run/diff  | Resolved   |
| P1  | Chat tự giả định `@shadcn/react`                    | Artifact và dependency chưa được xác nhận                                | Chat reference yêu cầu exact source, audit, approval và installed dependency verification | Resolved   |
| P2  | DDD/Atomic/testing bị duplicate                     | Upstream skill tự mang project override                                  | Rút về authority/handoff ngắn; skill cũ tiếp tục làm chủ                                  | Resolved   |
| P2  | `@latest` làm CLI không tái lập                     | Có thể chạy version khác `package-lock.json`                             | Ưu tiên project-installed CLI; version khác là explicit upgrade/adoption                  | Resolved   |
| P2  | Z-index rule xung đột operational workspace         | Overlay internals và template stacking là hai layer khác nhau            | Cấm override nội bộ; cho phép approved semantic layer token ở template/layer boundary     | Resolved   |
| P2  | Semantic color có thể chặn operational status token | Design token cụ thể vẫn deferred                                         | Cho phép token operational đã duyệt; cấm raw color và cấm tự tạo token chưa duyệt         | Resolved   |
| P2  | Decision Gate timing mơ hồ                          | Skill yêu cầu hỏi sau mọi component change                               | Shadcn defer hoàn toàn sang repository testing workflow                                   | Resolved   |
| P3  | `openai.yml` lệch convention                        | Các skill còn lại dùng `openai.yaml`                                     | Rename và đồng bộ metadata/default prompt                                                 | Resolved   |

## 6. Quan hệ với từng skill frontend cũ

### design-frontend-module-boundary

Không còn overlap quyền quyết định. Shadcn chỉ biết một primitive được đặt ở UI
path nào sau khi owner/layer đã được duyệt. Nếu business semantics hoặc placement
chưa rõ, boundary skill chạy trước.

### migrate-legacy-frontend-module

Không xung đột trực tiếp. Migration vẫn phải giữ behavior/parity; shadcn không
được dùng lý do “compose, don't reinvent” để tự đổi UX hoặc rewrite legacy UI
ngoài plan.

### audit-frontend-supply-chain

Đây là handoff quan trọng nhất. Official `@shadcn` primitive là luồng chuẩn của
shadcn. Mọi community namespace, GitHub item hoặc configured external registry
đều là source adoption và phải được audit theo exact artifact trước khi add.

### integrate-third-party-frontend

Primitive nhỏ không tự động cần integration skill. Feature-level block, widget,
runtime, global CSS, worker, asset pipeline hoặc dependency có lifecycle riêng
phải qua integration decision; shadcn chỉ xử lý CLI/files sau đó.

### audit-frontend-security

Shadcn composition/accessibility guidance không thay thế security. Component có
untrusted HTML/URL, upload, realtime, storage, token, iframe, worker hoặc
third-party script vẫn route sang security.

### testing

Shadcn không tạo test và không chọn test layer. Decision Gate nằm ở workflow
repository; `testing` chỉ được load khi developer chấp thuận tầng test cụ thể.

### nextjs-tanstack-query

Registry/demo query code không được copy thành application policy. Query key,
mutation, invalidation, hydration và provider flow chỉ do skill TanStack Query xử
lý khi task explicit.

### orchestrate-frontend-design

Shadcn không tự chọn visual solution cho UI mới. Khi chưa có design artifact đã
duyệt, design orchestration chạy trước; shadcn là implementation tool sau
approval.

## 7. Thay đổi theo file

- `AGENTS.md`: tách official shadcn route và external registry adoption route;
  mô tả rõ những quyết định shadcn không sở hữu.
- `.agents/skills/shadcn/SKILL.md`: thu hẹp trigger, rút gọn entry point, thêm
  authority order, source classification, availability check, local locked CLI,
  safe update và conditional reference routing.
- `rules/styling.md`: thêm public API precondition, approved operational tokens
  và template-level semantic stacking exception.
- `rules/forms.md`: yêu cầu primitive tồn tại hoặc được duyệt trước khi dùng
  pattern.
- `rules/composition.md`: ngăn ví dụ component tự tạo dependency/shared
  component/template contract.
- `rules/chat.md`: thêm supply-chain/security gate và bỏ khẳng định
  `@shadcn/react` luôn tự có sẵn.
- `agents/openai.yaml`: đổi tên từ `openai.yml`, giữ icon và thêm metadata khớp
  scope mới.
- `.docs/agents/skill.md`: thay phần override lặp bằng ranh giới/handoff và thêm
  hai routing example.
- `.plans/20260722-1437-align-shadcn-skill-governance-plan.md`: ghi approval và
  phạm vi đã duyệt.
- `.progresses/20260722-1437-align-shadcn-skill-governance-progress.md`: ghi
  checkpoint, validation và deviation.
- `.analysis/report-skill.md`: báo cáo quyết định cuối này.

Không thay đổi application source, `components.json`, `package.json`,
`package-lock.json` hoặc `src/components/ui/button.tsx`.

## 8. Luồng vận hành sau nâng cấp

`Official shadcn primitive/CLI/preset/docs
  -> shadcn inspect-only
  -> availability/config + docs/dry-run/diff khi cần
  -> evidence gate nếu preview thêm dependency/runtime surface
  -> approved shadcn mutation
  -> repository validation`

`Community/GitHub registry item
  -> shadcn exact-item read-only inspection + preview
  -> audit-frontend-supply-chain
  -> developer adoption approval
  -> boundary/integration/security chỉ khi evidence yêu cầu
  -> shadcn re-preview, drift check, apply/review/validation`

`New UI without approved design
  -> orchestrate-frontend-design
  -> developer design approval
  -> implementation plan
  -> shadcn chỉ khi cần primitive`

## 9. Quyết định về skills-lock.json

`skills-lock.json` không còn trong project theo quyết định của developer. Skill
discovery và execution không phụ thuộc file này, nên việc xóa không làm skill
shadcn ngừng hoạt động.

Mô hình bảo trì hiện tại là manual vendoring: team phát triển từng skill chốt bản
cuối trước khi đưa vào project. Vì vậy báo cáo không đề xuất hash synchronization
hay automatic upstream update detection.

Cần phân biệt với `package-lock.json`: file npm lock vẫn có giá trị runtime/tooling
và hiện pin shadcn CLI 4.13.0 cùng integrity của package. Việc bỏ skill lock không
đồng nghĩa bỏ dependency lock.

## 10. Validation

- Official `quick_validate.py`: không chạy được vì cả Python bundle và Python hệ
  thống đều thiếu module `PyYAML`.
- Fallback structural validation theo cùng constraint của validator: passed;
  frontmatter chỉ có `name` và `description`, name hợp lệ, description dài 521
  ký tự và dưới giới hạn 1024.
- Metadata validation: passed; `openai.yaml` tồn tại, `openai.yml` không còn,
  short description đúng giới hạn, default prompt chứa `$shadcn` và hai icon
  tồn tại.
- Markdown local-link validation: passed, 22 link được kiểm tra.
- Stale-guidance scan: passed; không còn broad `components.json` trigger, eager
  info interpolation, community-registry default hoặc duplicate override heading.
- `git diff --check`: passed; chỉ có cảnh báo line-ending LF/CRLF của worktree,
  không có whitespace error.
- `npm.cmd run lint`: passed.
- `npm.cmd run typecheck`: passed.
- Prettier: các file mới/viết lại đã được format; formatting ngoài scope trong
  reference cũ được giữ nguyên để tránh diff churn.
- Unit/component/integration/E2E: không áp dụng vì task chỉ đổi governance/docs.
- Optional forward-test: skipped/deferred vì chưa có explicit `yes`; không tạo
  test artifact hoặc task phụ.

Metadata generator cũng không chạy được do thiếu `PyYAML`. Không cài dependency
ngoài scope; metadata được tạo bằng `apply_patch` theo schema
`references/openai_yaml.md` và được kiểm tra bằng fallback ở trên.

## 11. Rủi ro còn lại

1. Các reference shadcn là snapshot được vendor thủ công. Không có
   `skills-lock.json`, team phải tự chịu trách nhiệm review khi thay snapshot.
2. `package.json` dùng range `^4.13.0`; current lock pin 4.13.0 nhưng một lần
   chủ động refresh lock có thể chọn bản mới. CLI upgrade vẫn cần diff và
   adoption review tương ứng.
3. Routing chỉ là governance control, không chứng minh một community artifact an
   toàn. Mỗi exact item vẫn cần evidence riêng.
4. Reference forms/chat có thể thay đổi theo upstream API. Agent phải đọc docs
   đúng version và kiểm tra installed source thay vì tin ví dụ tĩnh.
5. Forward-test fixtures kiểm tra decision boundary của skill, không chứng minh
   mọi agent runtime sẽ tuân thủ nếu host bỏ qua repository routing.

## 12. Khuyến nghị cuối

Giữ skill `shadcn` với scope mới. Dùng các skill frontend cũ làm authority và
xem shadcn như adapter chuyên biệt cho CLI/source-code primitive.

Không khôi phục `skills-lock.json` trong workflow manual-vendoring hiện tại.
Khi team thay version skill shadcn, review ba điểm bắt buộc: trigger description,
external registry gate và compatibility của reference với CLI/project config
đang lock.

## 13. Tối ưu composed workflow ngày 2026-07-22

Audit tiếp theo xác nhận số skill không phải nguyên nhân chính gây nặng context;
chi phí lớn nằm ở always-read frontend baseline, workflow áp dụng đồng đều cho
mọi task và handoff chưa tách inspect khỏi mutation.

Các tối ưu đã áp dụng:

- `AGENTS.md` chia `review-only`, `routine change` và `governed change`; tier thấp
  không được bỏ qua specialized gate và uncertainty phải nâng tier.
- `frontend-coding.md` giảm từ 2.194 xuống 1.169 từ, giữ invariant riêng của
  repository và route chi tiết về topic owner.
- `shadcn/SKILL.md` giảm từ 896 xuống 647 từ, dùng sáu stage và hai operating
  mode `inspect-only`/`approved mutation`.
- Community route trở thành `shadcn inspect -> supply-chain audit -> approval ->
shadcn apply`; audit recommendation không tự cấp quyền mutation.
- Official primitive phải handoff khi dry-run phát hiện dependency, install
  script, global CSS, asset, worker, runtime hoặc browser threat mới.
- `cli.md` và `registry.md` có section-level lookup; `mcp.md` được giữ lại nhưng
  chỉ load khi MCP thực sự nằm trong scope.
- Handoff record tối thiểu gồm exact artifact/version, file/dependency/runtime
  impact, gate, approval state và reference đã đọc.

Không gộp frontend rules và shadcn thành super-skill. Frontend tiếp tục sở hữu
repository policy; shadcn tiếp tục là adapter cho CLI/source-code component.

### Kết quả đo lại

So với baseline audit trước khi tối ưu, chưa tính source code, plan/progress và
CLI output:

| Scenario                                 |     Trước |       Sau |  Giảm |
| ---------------------------------------- | --------: | --------: | ----: |
| Official primitive đơn giản              |  6.850 từ |  5.677 từ | 17,1% |
| Official interactive + styling           | 12.374 từ | 11.201 từ |  9,5% |
| Community registry + component placement |  9.091 từ |  8.005 từ | 11,9% |

Review-only còn loại bỏ toàn bộ plan/progress/approval round trip. CLI/registry
reference không giảm file size đáng kể vì vẫn giữ nội dung kỹ thuật, nhưng route
mới chỉ đọc section liên quan thay vì toàn file.

### Validation của đợt tối ưu

- Prettier check: pass cho toàn bộ formatting-owned file; link-only correction
  trong `customization.md` được giữ nguyên format lân cận và kiểm tra bằng diff.
- `npm.cmd run lint`: pass.
- `npm.cmd run typecheck`: pass.
- Fallback skill/frontmatter/metadata validation: pass cho `shadcn` và
  `audit-frontend-supply-chain`.
- 9 eval fixtures có JSON hợp lệ, ID unique; 4 fixture mới kiểm tra inspect-only,
  pre-plan dry-run, official dependency gate và routine path.
- 39 local Markdown links trong tập runtime/developer docs kiểm tra đều tồn tại.
- Stale-route scan và `git diff --check`: pass.
- `skill-creator/quick_validate.py` không chạy vì bundled runtime thiếu `PyYAML`;
  không cài dependency ngoài scope. Fallback kiểm tra cùng các constraint đang sử
  dụng đã pass. Fixture được structural validation, chưa chạy bằng isolated agent
  evaluator vì repository không có runner tương ứng.
