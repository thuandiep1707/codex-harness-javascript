# Frontend Coding Rules

Apply this rule when creating, changing, moving, deleting, or reviewing frontend code or frontend configuration. This includes TypeScript/TSX in `src`, Next.js routes and configuration, React components and hooks, shared UI, module presentation code, browser integrations, TanStack Query, styling, assets, and frontend validation tooling.

Do not load this detailed rule for unrelated documentation or repository-governance work unless that work changes frontend conventions.

## Authority order

Follow the authority order in `AGENTS.md`: current developer instruction and approved task scope,
repository governance and analysis, live configuration and installed documentation, then compatible
source patterns. Surface conflicts instead of creating a competing convention.

## Topic rule routing

This file is the mandatory frontend safety baseline. Load only the additional topic rules whose triggers match repository evidence for the current task; do not read the entire topic catalog by default.

| Task evidence                                                                                                                              | Additional rule                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Creating, generating, splitting, placing, or changing a component, shadcn primitive, public props, variants, children, slots, or callbacks | `frontend/atomic-components.md`                                                                    |
| Translating or changing icons, SVGs, images, logos, markers, or visual assets                                                              | `frontend/icons-images-assets.md`                                                                  |
| Creating or changing interactive markup, navigation, headings, forms, accessible names, ARIA state, icon-only controls, or tables          | `frontend/semantics-accessibility.md`                                                              |
| Translating CSS, Tailwind classes, design tokens, component styling, or desktop layout dimensions                                          | `frontend/styling-layout.md`                                                                       |
| Deciding Server/Client boundaries, state ownership, effects, hooks, Context/Providers, stores, browser APIs, or runtime code splitting     | `frontend/react-state-runtime.md`                                                                  |
| Handling loading, error, empty, no-result, no-selection, not-found, permission, or missing-configuration states                            | `frontend/async-states.md`                                                                         |
| Validating UI generated or substantially reconstructed from a design/provider artifact                                                     | `frontend/generated-ui-validation.md` plus every owning topic rule triggered by the implementation |

Topic rules refine this baseline; they do not override higher authority. Record selected topic rules
in plans when the active task tier requires a plan. If no trigger matches, this baseline is enough.

### Routing contract

- This table is canonical; topic introductions may clarify but not broaden it.
- Select topics from task evidence, not merely an installed dependency, configuration, or component.
- Follow only relevant internal modes. Cross-references require their own router match.
- Rules own policy; specialized skills return workflow evidence to those owners without replacing it.

## Before coding

Before changing implementation files:

1. Identify the owning bounded context and load only the analysis, module boundary, live
   configuration, and topic rules relevant to the proposed change.
2. Search nearby code and direct consumers with `rg` or `rg --files` before creating a file, folder,
   component, hook, type, or abstraction.
3. Read installed Next.js 16 documentation before using or changing a framework API.
4. Stop at deferred or conflicting decisions; do not invent policy from examples or memory.

## Tool-enforced conventions

Live `tsconfig.json`, ESLint, Prettier, `package.json`, and `components.json` settings own exact compiler,
format, alias, script, and shadcn behavior. Inspect only the files relevant to the task. Do not weaken
them, create a parallel convention, introduce avoidable warnings, or manually imitate an exception
found in generated upstream source. Route styling exceptions to `frontend/styling-layout.md`.

## Decide ownership before creating files

Before creating a file or folder, identify its bounded context or shared layer, why existing code cannot
own the responsibility, its direct consumers and dependency direction, and whether it crosses a
deferred decision. Unclear ownership or a new folder convention requires approval. Do not use
`common`, `misc`, `helpers`, or `services` as fallback ownership.

## DDD folder and file placement

Place business-specific behavior in its owning bounded context:

```text
src/modules/<context>/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   └── services/
├── application/
│   ├── use-cases/
│   ├── dto/
│   └── ports/
├── infrastructure/
│   ├── api/
│   ├── repositories/
│   └── mappers/
└── presentation/
    ├── components/
    ├── hooks/
    ├── view-models/
    └── screens/
```

- `domain`: entities, value objects, domain services, and repository abstractions; no React, Next.js,
  HTTP client, browser API, or UI dependency.
- `application`: use cases, DTOs, and ports; depends inward on domain.
- `infrastructure`: API adapters, repository implementations, and mappers implementing inward
  contracts.
- `presentation`: module-owned components, hooks, screens, and view models.
- `src/app`: thin delivery composition, not business implementation.

Do not create a bounded context, DDD sublayer, cross-module business folder, or scaffolded-category
file without concrete approved responsibility.

Preserve this dependency direction:

```text
presentation ──► application ◄── infrastructure
                       │
                       ▼
                     domain
```

## Testing conventions

Load `.agents/rules/testing.md` and the `testing` skill only when test work is in scope under
`AGENTS.md`.

## Atomic Design with shadcn/ui

`src/components/ui` is the complete atoms layer; never create `src/components/atoms`.

```text
src/components/ui          # atoms: shadcn/ui + approved compatible custom atoms
        ↓
src/components/molecules   # small reusable compositions
        ↓
src/components/organisms   # complete reusable UI sections
        ↓
src/components/templates   # controlled page/layout patterns
```

Installed shadcn primitives and approved compatible custom atoms live in `ui`; shared composition flows
through `molecules`, `organisms`, and controlled `templates`. Business semantics and orchestration stay
in the owning module presentation layer. Search existing components first and load
`frontend/atomic-components.md` for placement, decomposition, public API, variant, and custom-atom
decisions. Do not fork primitives or deep-style controlled components to bypass ownership.

## Other frontend locations

- `src/components/providers`: approved application-wide providers.
- `src/components/shared`: non-business presentation helpers, never unclear ownership fallback.
- `src/lib`: shared framework/integration utilities, not business behavior.
- `src/config`, `src/constants`, `src/hooks`, and `src/types`: genuinely cross-cutting concerns only;
  otherwise keep them in the owning module.
- `src/assets` or `public`: choose from current import/serving evidence.

## File names and exports

Use exact Next.js reserved filenames where applicable and repository kebab-case elsewhere unless a
framework or generator requires another form. Use PascalCase component symbols and `use`-prefixed
hooks. Prefer one primary responsibility per file. Add a barrel only for an intentional reviewed
public API. Preserve `.gitkeep` until a tracked file in the same folder replaces it.

## React and Next.js

Use installed Next.js documentation, not remembered behavior, for framework decisions. Keep route
files thin, Server Components as the supported default, and Client Components at the narrowest
cohesive interactive boundary. Load `frontend/react-state-runtime.md` for state, effects, browser
runtime, providers/stores, dynamic imports, or `ssr: false`.

## UI, styling, and accessibility

Route interactive semantics, styling/layout, assets/icons, and async states to their topic rules. Keep
desktop layout fluid, use approved semantic tokens and z-index hierarchy, preserve established async
boundaries, and do not invent custom complex interactions or responsive scope. Use Lucide as the
general icon library and `next/image` according to the installed framework guidance.

## Validation

Select validation according to the change:

| Change type                                                     | Minimum validation                                             |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| TypeScript/TSX implementation                                   | Targeted checks, `npm run lint`, and `npm run typecheck`       |
| Next.js route, boundary, or compilation-affecting configuration | Lint, typecheck, and build                                     |
| Formatting/documentation                                        | Format/check changed files and inspect the diff                |
| Shared component or template contract                           | Lint, typecheck, direct consumers, and approved tests/build    |
| Generated or reconstructed UI                                   | Owning topic checks plus `frontend/generated-ui-validation.md` |
| Review-only                                                     | Read-only evidence; do not mutate merely to validate           |

Report commands run, failures, skipped validation, and the reason for each skip. Do not hide failures by weakening configuration or editing unrelated code.

## Change discipline

Preserve unrelated changes, avoid speculative cleanup, and stay within the active task tier and
approved scope. Update analysis only for an approved architecture decision. Material scope changes
return to approval. Do not restore `src/app/(dont-use)`.

## Shared unresolved and completion evidence

When a topic decision is unresolved, stop only dependent work and continue independent approved work.
Record it once with owner/trigger, inspected evidence, rejected alternatives, required decision or
approval, completed independent scope, and incomplete dependent scope.

Topic rules add only their specialized evidence. Before completion, report selected rules and skills,
approvals used, unresolved dependent scope, deviations, validation commands and results, and reasons
for skipped checks. Do not claim unresolved required behavior as complete.
