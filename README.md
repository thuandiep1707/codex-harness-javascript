# Codex Frontend Agent Base

Bộ cấu hình dùng chung cho frontend project chạy bằng Codex, gồm:

- `AGENTS.md`: entry point và luật điều phối của primary agent.
- `.agents/rules/`: các quy tắc frontend và testing.
- `.agents/skills/`: workflow chuyên biệt được Codex tự nhận diện theo task.
- `.codex/config.toml`: cấu hình model chính và multi-agent.
- `.codex/agents/*.toml`: cấu hình từng custom subagent.
- `.docs/agents/`: catalog và tài liệu giải thích hệ thống agent.

## 1. Triển khai skill

### 1.a. Triển khai cho Codex Chat

Phần này áp dụng cho Codex Desktop App hoặc giao diện chat có thể mở local repository.

#### Đưa hệ thống vào project

Copy các file và thư mục sau vào root của frontend project:

```text
frontend-project/
├── AGENTS.md
├── .agents/
│   ├── rules/
│   └── skills/
├── .codex/
│   ├── config.toml
│   └── agents/
└── .docs/
    └── agents/
        ├── skill-catalog.md
        └── subagents.md
```

Nên copy toàn bộ `.agents/` để giữ đầy đủ skill metadata, references, scripts, assets và evals.
Không đặt các file trên trong thư mục cá nhân nếu mục tiêu là chia sẻ cho team; hãy commit chúng
trực tiếp vào repository.

```bash
git add AGENTS.md .agents .codex .docs/agents README.md
git commit -m "configure frontend Codex agents and skills"
```

Không commit token, credential hoặc cấu hình đăng nhập MCP. Kết nối Figma, Stitch và các provider
khác phải được từng thành viên cài đặt hoặc cấp quyền riêng.

#### Mở project trong Codex Chat

1. Mở Codex Desktop App.
2. Chọn đúng frontend repository.
3. Tạo một task/chat mới để Codex nạp lại `AGENTS.md`, `.agents/skills` và `.codex/config.toml`.
4. Xác nhận trust repository nếu Codex yêu cầu.
5. Kiểm tra model chính ở thanh model. Giá trị mong đợi là `GPT-5.6 Sol` với reasoning `high`.
6. Gõ `/` hoặc gọi trực tiếp `$plan-frontend-work` để kiểm tra project skills đã được nhận diện.

Các custom subagent không xuất hiện trong danh sách skill. Trong Codex Chat, hãy yêu cầu primary
agent spawn chúng bằng tên:

```text
Dùng $plan-frontend-work để đọc tài liệu và phân rã yêu cầu này.

Delegate các task packet phù hợp cho:
- frontend_coder
- design_connector
- test_engineer

Chạy song song khi dependency cho phép, chờ các handoff cần thiết và tổng hợp kết quả trong chat
chính.
```

Khi subagent được tạo, Codex App hiển thị panel **Subagents** hoặc activity tương ứng. Có thể mở từng
subagent thread để xem tiến trình và kết quả riêng. Lệnh `/agent` không dùng trong Codex Desktop App;
đó là lệnh của Codex CLI.

#### Smoke test trên Codex Chat

Dùng prompt read-only sau để kiểm tra orchestration mà không thay đổi project:

```text
Đây là smoke test read-only. Không sửa hoặc tạo file.

Dùng $plan-frontend-work để tạo task graph giả định cho:
"Thiết kế trang quản lý tenant bằng Figma, implement frontend Next.js và viết component + E2E tests."

Bắt buộc spawn đúng ba custom subagents:
- frontend_coder: kiểm tra coding task packet.
- design_connector: kiểm tra design/MCP task packet.
- test_engineer: tạo test plan.

Cho các task độc lập chạy song song, chờ cả ba hoàn thành và tổng hợp kết quả.
Không thay thế bằng worker, explorer hoặc default agent.
```

Smoke test đạt khi:

- Primary agent đọc `plan-frontend-work` trước khi delegate.
- Có đúng ba custom subagent thread.
- Mỗi agent nhận đúng loại task packet.
- Primary agent chờ các handoff rồi mới tổng hợp.
- Không có file nào bị thay đổi.

### 1.b. Triển khai cho CMD và Codex CLI

Codex CLI phù hợp khi cần xem rõ config layer, chuyển giữa agent thread và xác minh model runtime.

#### Cài Codex CLI

Kiểm tra Node.js và npm:

```bash
node --version
npm --version
```

Cài Codex CLI globally:

```bash
npm install --global @openai/codex
```

##### Windows CMD hoặc PowerShell

Mở terminal tại project:

```powershell
cd C:\path\to\frontend-project
codex --version
codex
```

Nếu dùng Windows CMD và muốn đổi cả ổ đĩa:

```bat
cd /d C:\path\to\frontend-project
codex --version
codex
```

##### Git Bash

Git Bash sử dụng đường dẫn `/c/...`, không sử dụng trực tiếp `C:\...`:

```bash
cd /c/path/to/frontend-project
```

Thêm npm global directory vào phiên Git Bash hiện tại, refresh command discovery, kiểm tra version
và khởi chạy Codex:

```bash
export PATH="$PATH:/c/Users/<windows-user>/AppData/Roaming/npm"
hash -r
codex --version
codex
```

Ví dụ với Windows user `teran`:

```bash
export PATH="$PATH:/c/Users/teran/AppData/Roaming/npm"
hash -r
codex --version
codex
```

Nếu `codex` vẫn chưa được nhận diện:

```bash
/c/Users/<windows-user>/AppData/Roaming/npm/codex.cmd --version
/c/Users/<windows-user>/AppData/Roaming/npm/codex.cmd
```

#### Kiểm tra project config

Trong Codex CLI:

```text
/debug-config
/status
```

Kết quả mong đợi:

- `/debug-config` có project layer trỏ tới `.codex/config.toml`.
- `/status` của primary thread hiển thị `gpt-5.6-sol` và reasoning `high`.

Sau khi gửi smoke-test prompt, dùng:

```text
/agent
```

Chuyển vào từng subagent thread và chạy:

```text
/status
```

Model runtime mong đợi:

| Thread | Model |
| --- | --- |
| Primary | `gpt-5.6-sol` |
| `frontend_coder` | `gpt-5.5` |
| `design_connector` | `gpt-5.6-luna` |
| `test_engineer` | `gpt-5.4` |

Việc đọc model trong file TOML chỉ xác nhận cấu hình tĩnh. `/status` trong từng agent thread mới là
cách kiểm tra model đang thực sự được sử dụng.

## 2. Các loại subagent hiện có

Hệ thống gồm một primary agent và ba custom subagent. Primary agent là bộ não điều phối, không phải
worker triển khai.

### Primary planner

- **Model:** `gpt-5.6-sol`
- **Reasoning:** `high`
- **Cấu hình:** `.codex/config.toml`
- **Trách nhiệm:**
  - Đọc yêu cầu, `.docs/`, architecture evidence và source liên quan.
  - Load `plan-frontend-work`.
  - Xử lý các planning gate về ownership, security và supply chain.
  - Tạo dependency-ordered task graph.
  - Chuẩn hóa task packet cho từng subagent.
  - Quyết định task nào có thể chạy song song.
  - Chờ handoff, giải quyết conflict và tổng hợp kết quả cuối.
- **Không nên làm:** tự ôm toàn bộ coding, design và testing khi công việc đã có thể tách thành các
  packet độc lập.

### `frontend_coder`

- **Model:** `gpt-5.5`
- **Reasoning:** `high`
- **Sandbox:** `workspace-write`
- **Cấu hình:** `.codex/agents/frontend-coder.toml`
- **Đầu vào:** coding task packet đã được primary agent giới hạn scope.
- **Trách nhiệm:**
  - Đọc coding skills và frontend rules được chỉ định.
  - Implement production code trong đúng bounded context và layer.
  - Bảo toàn public contract, dependency direction và design đã được duyệt.
  - Chạy validation được yêu cầu trong packet.
  - Trả lại changed files, behavior, command results, deviation, blocker và stable contract cho test.
- **Không được:**
  - Tự quyết định visual design chưa được duyệt.
  - Tự mở rộng architecture hoặc thêm dependency chưa qua gate.
  - Chiếm ownership của test planning.
  - Sửa file đang được worker khác xử lý.

### `design_connector`

- **Model:** `gpt-5.6-luna`
- **Reasoning:** `medium`
- **Sandbox:** `read-only`
- **Cấu hình:** `.codex/agents/design-connector.toml`
- **Đầu vào:** design task packet chứa product context, constraints, states và output mong đợi.
- **Trách nhiệm:**
  - Load `orchestrate-frontend-design`.
  - Phát hiện Figma, Stitch hoặc design provider đã được cấu hình.
  - Kết nối MCP/plugin, tạo hoặc kiểm tra design artifact theo scope.
  - Kiểm tra preview/screenshot sau mỗi thay đổi quan trọng.
  - Trả stable artifact identity, design decisions, constraints, unresolved questions và approval
    state.
- **Không được:**
  - Sửa application source.
  - Cài dependency.
  - Xem provider-generated HTML/code là production source đã được duyệt.
  - Tự bịa provider hoặc artifact khi MCP chưa khả dụng.

Custom agent này không hardcode MCP server trong TOML. Nó kế thừa MCP đã được cấu hình và cấp quyền
từ parent session, vì vậy từng thành viên vẫn phải tự kết nối Figma hoặc Stitch.

### `test_engineer`

- **Model:** `gpt-5.4`
- **Reasoning:** `high`
- **Sandbox:** `workspace-write`
- **Cấu hình:** `.codex/agents/test-engineer.toml`
- **Đầu vào:** testing task packet, behavior contract, risk và runner scope.
- **Trách nhiệm:**
  - Tạo test plan theo observable behavior và risk.
  - Chọn layer thấp nhất đủ chứng minh behavior.
  - Viết unit, component, integration, API hoặc E2E tests khi contract đã ổn định.
  - Chạy targeted test trước, sau đó chạy baseline validation cần thiết.
  - Trả scenarios, fixtures/mocks, changed files, commands, results, artifacts và residual risk.
- **Không được:**
  - Sửa production behavior để làm test pass.
  - Làm yếu assertion, thêm fixed sleep hoặc che giấu failure.
  - Viết test code trước khi behavior contract và approval cần thiết ổn định.
  - Sửa file đang được worker khác xử lý.

### Luồng phối hợp

1. Primary agent đọc docs và tạo task graph.
2. Planning gate được xử lý trước mọi mutation phụ thuộc.
3. `design_connector` và `frontend_coder` có thể chạy song song nếu coding không phụ thuộc vào design
   chưa hoàn thành.
4. `test_engineer` có thể lập test plan khi acceptance criteria đã ổn định.
5. Test code chỉ bắt đầu sau khi production contract cần kiểm thử đã có.
6. Primary agent chờ handoff, reconcile kết quả và thực hiện final validation.

Không chạy song song hai worker có cùng write surface hoặc cùng sửa một public contract.

## 3. Các loại skill hiện có

Skill là workflow chuyên biệt được Codex load khi task khớp với `name` và `description` trong
`SKILL.md`. Rules và skills có vai trò khác nhau:

- `.agents/rules/` chứa quy tắc nền bắt buộc cho coding hoặc testing.
- `.agents/skills/` chứa quy trình chuyên biệt, references, scripts, assets và output contract.

Hệ thống hiện có 11 skill, chia thành bốn nhóm.

### 3.1. Skill lên kế hoạch

#### `plan-frontend-work`

- Đọc tài liệu liên quan trong `.docs/`.
- Tóm tắt constraints, decision, unknown và conflict.
- Chạy planning gate cần thiết.
- Tạo dependency-ordered task graph.
- Chia task thành design, frontend-coding và testing packet.
- Điều phối `frontend_coder`, `design_connector` và `test_engineer`.
- Dùng cho feature nhiều bước, UI/UX, migration, third-party adoption, security-sensitive change hoặc
  task cần nhiều subagent.

#### `design-frontend-module-boundary`

- Xác định ownership trước khi tạo hoặc di chuyển module.
- Phân loại capability thuộc bounded context, shared UI, delivery hay integration adapter.
- Đề xuất DDD placement và dependency direction.
- Dùng khi source mới, legacy, demo, cloned code hoặc capability chưa có owner rõ ràng.
- Output là boundary decision và placement map, không phải production implementation.

#### `audit-frontend-supply-chain`

- Kiểm tra dependency hoặc external source trước khi adoption.
- Đánh giá provenance, license, lockfile/integrity, lifecycle scripts, advisory/SBOM, maintenance và
  exit risk.
- Dùng trước khi thêm, upgrade, vendor hoặc approve package/source bên thứ ba.
- Output là adoption recommendation, controls, unknown và evidence.

#### `audit-frontend-security`

- Threat-model frontend và browser runtime trong phạm vi được cấp quyền.
- Kiểm tra XSS, CSRF, CSP, URL/input, token, cookie, session, storage, authorization assumptions,
  messaging, realtime, upload, worker và third-party runtime.
- Đưa ra finding có evidence, severity, remediation guidance và retest requirement.
- Không thay thế supply-chain audit cho provenance hoặc license risk.

### 3.2. Skill coding frontend

#### `migrate-legacy-frontend-module`

- Di chuyển behavior từ legacy/demo source vào DDD module đã được duyệt.
- Xây characterization baseline, parity matrix và migration slices.
- Kiểm soát coexistence, cutover, rollback và legacy removal.
- Không dùng để tự hợp thức hóa một bounded context chưa được duyệt.

#### `integrate-third-party-frontend`

- Tích hợp project, SDK, widget, engine, mapping runtime hoặc cloned repository bên ngoài.
- Chọn integration mode: package, wrapper, vendoring, iframe hoặc separate deployment.
- Kiểm soát vendor boundary, global CSS, workers, WASM/WebGL, assets, CSP, update và removal.
- Chỉ chạy sau boundary và supply-chain gate cần thiết.

#### `nextjs-state-management`

- Quyết định ownership của URL state, local React state, Zustand client state và server state.
- Dùng cho filter, pagination, shareable navigation state, cross-component state, per-request store
  và hydration.
- Ngăn việc đưa state lên global store khi local hoặc URL state đã đủ.
- Chỉ route sang TanStack Query khi server-state requirement thực sự tồn tại.

#### `nextjs-tanstack-query`

- Xử lý explicit TanStack Query v5 flow.
- Thiết kế query options, query keys, client queries, mutations, invalidation và optimistic update.
- Kiểm soát server prefetch, dehydration và hydration trong Next.js App Router.
- Không trigger cho Server Component fetching thông thường hoặc React state không liên quan.
- Không tự tạo global `QueryClientProvider` hoặc cache convention mới khi architecture chưa duyệt.

#### `shadcn`

- Làm việc trực tiếp với shadcn/ui primitives, CLI, presets, registries và generated component source.
- Kiểm tra project registry, installed contracts, composition, forms, styling và icon mechanics.
- Official item có thể đi theo direct shadcn route.
- Community/GitHub registry item phải qua supply-chain approval trước khi adoption.
- Không dùng chỉ vì project có `components.json` hoặc task frontend chung chung.

### 3.3. Skill thiết kế

#### `orchestrate-frontend-design`

- Điều phối thiết kế UI/UX qua Figma, Stitch hoặc external design provider.
- Thu thập repository/product evidence và tạo prompt hoặc prompt chain có cấu trúc.
- Hỗ trợ new screen, layout, visual direction, prototype, component appearance và design variant.
- Trả traceable artifact, preview, decision, constraint và design approval state.
- Không dùng khi đã có design artifact được developer duyệt.
- Không implement production code và không tự xem provider output là source được phép adoption.

### 3.4. Skill kiểm thử

#### `testing`

- Tạo test plan và chọn test layer phù hợp.
- Hỗ trợ unit, component, integration, contract, API và Playwright E2E tests.
- Thiết kế deterministic isolation, fixtures, mocks, authentication và network boundaries.
- Viết, chạy, debug và review test code.
- Báo cáo command, result, artifact, coverage limit và residual risk.
- Routine lint, typecheck, build hoặc browser smoke validation không tự trigger skill này.

### Ví dụ routing

| Yêu cầu | Skill route |
| --- | --- |
| Tạo feature frontend nhiều bước | `plan-frontend-work` -> coding/design/testing packet |
| Capability mới chưa rõ module | `plan-frontend-work` -> `design-frontend-module-boundary` |
| UI mới chưa có design | `plan-frontend-work` -> `orchestrate-frontend-design` -> coding |
| Tích hợp package hoặc source bên ngoài | boundary -> supply-chain audit -> integration |
| Sửa explicit TanStack Query flow | `nextjs-state-management` -> `nextjs-tanstack-query` |
| Thêm shadcn official primitive | `shadcn` |
| Dùng community registry item | `shadcn` inspect -> supply-chain audit -> `shadcn` apply |
| Viết component hoặc E2E test | `testing` |

Catalog routing chính thức nằm trong `.docs/agents/skill-catalog.md`. Khi thêm, xóa hoặc đổi trigger
của skill, phải cập nhật đồng thời catalog, `AGENTS.md`, metadata `agents/openai.yaml` và README này.
