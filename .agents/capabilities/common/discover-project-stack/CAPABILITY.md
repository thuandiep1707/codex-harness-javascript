# Discover Project Stack

Internal Brain capability. Do not expose this package as a user-facing `$` workflow.

## Goal

Detect the implementation environment already evidenced by the working project so downstream agents can load only relevant capabilities. Detection is not technology selection and never authorizes a new dependency.

## Cheap discovery order

Inspect the smallest evidence set first:

1. `package.json` and lockfile;
2. framework/config files (`next.config.*`, `tsconfig.json`, test config, `components.json`, provider setup);
3. sanitized environment evidence when runtime configuration, API contracts, authentication/test context, or project classification materially depends on it;
4. representative direct imports from existing source only when dependency/config evidence is insufficient or conflicting;
5. deeper source inspection only to resolve a material ambiguity.

Do not scan the entire source tree by default.

## Environment evidence

Apply `.agents/rules/environment-evidence.md` before inspecting environment configuration.

Never read raw environment-file values directly into model context. Use the deterministic inspector:

```text
.agents/capabilities/common/discover-project-stack/scripts/inspect-environment.mjs
```

Run it against the resolved working-project root. It discovers bounded environment sources from project-root `.env` / `.env.*` conventions plus explicit env-file references in selected package/framework/tool configuration.

The inspector returns sanitized evidence only:

- `CONTEXT_SAFE`: exact value may be returned when useful;
- `OPERATIONAL_SENSITIVE`: reference/availability by default; exact value only when the current bounded operation explicitly requires it;
- `SECRET`: reference/availability only; exact value is never emitted.

Use `--include-operational` only when the current assigned operation materially requires an operational identity such as a test username/account. Never use it as a general discovery default.

A safe Swagger/OpenAPI URL may be used to retrieve contract evidence. Credential-bearing or secret-parameterized URLs must remain opaque.

Do not invent environment-file precedence. Infer effective loading only from current framework/runtime/tool evidence; otherwise record it as unresolved.

## Detect

Record evidence-backed values when present:

- framework/runtime;
- UI/component library (for example shadcn/Radix, MUI, HeroUI, Chakra, Ant Design);
- general-purpose icon library;
- styling system/design tokens;
- client-state library;
- server-state/data-fetching library;
- form library when relevant;
- unit/component/e2e test runner;
- package manager and relevant framework configuration;
- sanitized environment/runtime evidence relevant to project classification or external contracts;
- safe Swagger/OpenAPI contract location when evidenced by sanitized environment/configuration.

Use `unresolved` when evidence is missing or conflicting. Never turn absence into a default such as shadcn, Lucide, Zustand, or TanStack Query.

## Evidence contract

For every detected technology, retain concise source evidence such as dependency name, config path, or representative import. Distinguish:

- `detected`: project evidence establishes current usage;
- `approved`: higher authority explicitly fixes the choice;
- `unresolved`: no safe conclusion;
- `conflicting`: evidence points to multiple active conventions.

## Routing

Return a compact implementation-environment profile to Brain. Main may map that profile plus the current execution-unit trigger and specialist manifest allowlist to an allowed internal capability. A detected package is not itself permission to change, install, upgrade, or standardize it.
