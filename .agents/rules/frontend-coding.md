# Frontend Coding Rules

Apply this baseline to every frontend production-code Subtask. Keep it small: load detailed topic
rules only when the router below matches the transient handoff or current source evidence.

## Authority

Use this order:

1. assigned Jira Subtask + transient `issue-handoff`;
2. approved architecture/design/dependency evidence supplied by Orchestrator;
3. this repository's allowed rules/skills;
4. live product configuration and installed framework documentation;
5. compatible nearby source patterns.

Do not use chat history, `.docs/`, `.analysis/`, local plans, or broad repository archaeology as a
replacement for missing specialist context. Return a blocker when higher authority is missing or
conflicts with source evidence.

## Topic router

| Evidence in current Subtask/source | Load |
| --- | --- |
| Creating, splitting, placing, or changing component structure/public component contracts | `frontend/atomic-components.md` |
| Icons, SVG, images, logos, markers, visual assets | `frontend/icons-images-assets.md` |
| Interactive semantics, navigation, headings, forms, ARIA, tables | `frontend/semantics-accessibility.md` |
| CSS, Tailwind, tokens, layout, responsive behavior | `frontend/styling-layout.md` |
| Server/Client boundary, hooks, state, effects, providers, stores, browser APIs, runtime splitting | `frontend/react-state-runtime.md` |
| Loading, error, empty, no-result, permission, missing-configuration states | `frontend/async-states.md` |
| UI reconstructed from approved design/provider evidence | `frontend/generated-ui-validation.md` plus other triggered topic rules |

The always-loaded Coding `component-decomposition-gate.md` decides whether the Atomic rule is needed
before source write. Do not load all topic rules “for safety”.

## Before coding

1. Confirm the exact bounded Subtask objective, included/excluded scope, allowed write surface, direct
   dependencies, and required validation from the handoff.
2. Inspect nearby source and direct consumers before creating or moving files/components/hooks/types.
3. Inspect only live config needed for the change (`package.json`, `tsconfig`, ESLint, Prettier,
   `components.json`, framework config, etc.).
4. Use installed Next.js documentation for framework APIs when the Subtask changes framework behavior.
5. Stop at unresolved architecture, design, dependency, or public-contract decisions instead of
   inventing project policy.

## Ownership and placement

Business-specific behavior belongs to its approved bounded context. Preserve the dependency direction:

```text
presentation -> application <- infrastructure
                    |
                    v
                  domain
```

- `domain`: business concepts/contracts; no React, Next.js, HTTP client, or browser dependency.
- `application`: use cases, DTOs, ports; depends inward on domain.
- `infrastructure`: API/repository adapters and mappers implementing inward contracts.
- `presentation`: module-owned screens, components, hooks, view models.
- `src/app`: thin delivery composition, not business implementation.

Do not create new bounded contexts, DDD layers, shared folders, or architecture conventions unless the
handoff already approves their responsibility. Never use `common`, `misc`, `helpers`, or `services` as
unclear-ownership fallbacks.

For shared presentation composition, preserve the established Atomic structure:

```text
src/components/ui          # atoms / shadcn + approved custom atoms
src/components/molecules
src/components/organisms
src/components/templates
```

Business semantics remain in the owning module. Load the Atomic rule for actual placement,
decomposition, custom-atom gates, variants, slots, and component public APIs.

## File and runtime discipline

- Prefer one primary cohesive responsibility per handwritten file.
- Use framework-reserved filenames where required; otherwise follow repository naming conventions.
- Keep route/page files thin and Client Components at the narrowest cohesive interactive boundary.
- Search for existing components/utilities before creating new ones.
- Do not add or change dependencies unless explicitly approved in the handoff/dependency evidence.
- Preserve unrelated changes and avoid speculative cleanup.

## Validation

Use the smallest validation that proves the assigned change, then required repository baselines:

| Change | Minimum evidence |
| --- | --- |
| TypeScript/TSX implementation | targeted check + lint + typecheck |
| Next.js route/boundary/compilation config | lint + typecheck + build |
| Shared component/template contract | lint + typecheck + direct consumers + approved tests/build |
| Reconstructed/generated UI | triggered topic validation + generated-UI rule |
| Documentation/format-only | changed-file format/check + diff inspection |

Report commands run, results, failures, and reasons for skipped required checks. Never make validation
pass by weakening configuration, assertions, or unrelated production behavior.

## Completion

Return only evidence for the assigned Subtask: implemented behavior, changed files, public contracts,
structural/decomposition evidence when triggered, validation, deviations, limitations, and test
handoff. Do not update Jira yourself and do not claim unresolved required behavior as complete.
