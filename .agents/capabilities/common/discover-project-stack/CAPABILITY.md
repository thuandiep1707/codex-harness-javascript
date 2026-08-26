# Discover Project Stack

Internal Brain capability. Do not expose this package as a user-facing `$` workflow.

## Goal

Detect the implementation environment already evidenced by the working project so downstream agents can load only relevant capabilities. Detection is not technology selection and never authorizes a new dependency.

## Cheap discovery order

Inspect the smallest evidence set first:

1. `package.json` and lockfile;
2. framework/config files (`next.config.*`, `tsconfig.json`, test config, `components.json`, provider setup);
3. representative direct imports from existing source only when dependency/config evidence is insufficient or conflicting;
4. deeper source inspection only to resolve a material ambiguity.

Do not scan the entire source tree by default.

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
- package manager and relevant framework configuration.

Use `unresolved` when evidence is missing or conflicting. Never turn absence into a default such as shadcn, Lucide, Zustand, or TanStack Query.

## Evidence contract

For every detected technology, retain concise source evidence such as dependency name, config path, or representative import. Distinguish:

- `detected`: project evidence establishes current usage;
- `approved`: higher authority explicitly fixes the choice;
- `unresolved`: no safe conclusion;
- `conflicting`: evidence points to multiple active conventions.

## Routing

Return a compact implementation-environment profile to Brain. Orchestrator may map that profile plus the current Subtask trigger to an allowed internal capability. A detected package is not itself permission to change, install, upgrade, or standardize it.
