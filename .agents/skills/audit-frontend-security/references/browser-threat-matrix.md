# Browser threat matrix

Build a task-local threat model and select only applicable checks. Use current primary guidance,
including the [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/latest/).
Do not treat this matrix as complete coverage or authorization for active exploitation.

| Surface                   | Evidence to inspect                                                              | Representative failure questions                                                                     |
| ------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Input and rendering       | HTML/Markdown/rich text, templates, DOM APIs, URL values, map/popups, logs       | Can untrusted data reach executable markup, scriptable URL, unsafe DOM sink, or misleading UI?       |
| Navigation and URLs       | redirects, return URLs, deep links, downloads, object URLs                       | Can input create open redirects, unsafe schemes, confused navigation, or persistent sensitive URLs?  |
| Authentication/session UX | login/logout, refresh, expiry, cookies, concurrent sessions, cache               | Can a stale/replayed token remain usable; is server invalidation assumed rather than verified?       |
| Authorization             | hidden controls, route guards, cached permission data, object identifiers        | Is frontend gating mistaken for server enforcement; can unauthorized data/action still be requested? |
| Storage and secrets       | cookies, local/session storage, IndexedDB, caches, env exposure, source maps     | Is sensitive data readable by script, over-retained, logged, bundled, or restored after logout?      |
| Requests                  | mutations, cookies, CSRF tokens, CORS assumptions, retries, redirects            | Can another origin trigger a state change; can retry/refresh duplicate a privileged action?          |
| CSP and browser policy    | response/meta CSP, script/style sources, frames, workers, WASM, Trusted Types    | Do broad sources, inline execution, unsafe evaluation, framing, or missing policy weaken isolation?  |
| Messaging/realtime        | `postMessage`, BroadcastChannel, WebSocket, SSE, worker messages                 | Are origin/source/schema, authentication, ordering, replay, size, and cleanup validated?             |
| Upload/download           | file type/content, previews, object URLs, archive/media parsing, filename/header | Can active content execute, a file escape expected handling, or sensitive data leak?                 |
| Third-party/runtime       | scripts, SDKs, maps, analytics, iframes, workers, WASM/WebGL                     | What code/origins/data execute; what happens on compromise, update, failure, or teardown?            |
| Service worker/cache      | registration scope, cache keys, update, offline data, logout                     | Can stale or cross-user sensitive content persist or can an unexpected worker control routes?        |
| Error/telemetry           | console, reports, traces, analytics, network error bodies                        | Are credentials, personal data, internal URLs, or security details exposed or retained?              |

## Threat-model record

Capture:

1. Protected assets and sensitive operations.
2. Trust boundaries, actors, origins, and execution contexts.
3. Entry points and untrusted data paths.
4. Existing controls and where enforcement actually occurs.
5. Applicable tests, excluded tests, and authorization limits.
6. Assumptions requiring backend, deployment, or security-owner confirmation.

Frontend authorization is a usability control, not the ultimate enforcement boundary. Do not claim a
permission is secure without authorized evidence from the enforcing server or gateway.
