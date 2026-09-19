# Frontend Coding Rules

Apply this baseline to every frontend production-code execution unit. Keep it small: load detailed topic rules only when the router below matches the transient handoff or current source evidence.

## Authority

Use this order:

1. assigned Jira execution unit + transient `issue-handoff`;
2. approved architecture/design/dependency evidence supplied by Main;
3. internal capabilities explicitly routed in the handoff + this repository's mandatory rules;
4. live product configuration and installed framework/library documentation;
5. compatible nearby source patterns.

Do not use chat history, `.docs/`, `.analysis/`, local plans, or broad repository archaeology as a replacement for missing specialist context. Return a blocker when higher authority is missing or conflicts with source evidence.

Do not choose an implementation library merely because a capability exists in this control repo. A capability may be loaded only when the handoff routes it and current project evidence is compatible.

## Topic router

| Evidence in current execution unit/source | Load |
| --- | --- |
| Creating, splitting, placing, or changing component structure/public component contracts | `frontend/atomic-components.md` |
| Icons, SVG, images, logos, markers, visual assets | `frontend/icons-images-assets.md` |
| Interactive semantics, navigation, headings, forms, ARIA, tables | `frontend/semantics-accessibility.md` |
| Styling, tokens, layout, responsive behavior | `frontend/styling-layout.md` |
| Server/Client boundary, hooks, state, effects, providers, stores, browser APIs, runtime splitting | `frontend/react-state-runtime.md` |
| Loading, error, empty, no-result, permission, missing-configuration states | `frontend/async-states.md` |
| UI reconstructed from approved design/provider evidence | `frontend/generated-ui-validation.md` plus other triggered topic rules |

The always-loaded Coding `component-decomposition-gate.md` decides whether the Atomic rule is needed before source write. Do not load all topic rules or all internal capabilities "for safety".

## Before coding

1. Confirm the exact bounded execution unit objective, included/excluded scope, allowed write surface, direct dependencies, routed internal capabilities, and required validation from the handoff.
2. Inspect nearby source and direct consumers before creating or moving files/components/hooks/types.
3. Inspect only live config needed for the change (`package.json`, `tsconfig`, ESLint, Prettier, component-library config, framework config, etc.).
4. Use installed framework/library documentation for APIs touched by the execution unit.
5. Stop at unresolved architecture, design, dependency, or public-contract decisions instead of inventing project policy.

## Ownership and placement

Business-specific behavior belongs to its approved bounded context. Preserve the dependency direction:

```text
presentation -> application <- infrastructure
                    |
                    v
                  domain
```

- `domain`: business concepts/contracts; no React, framework, HTTP client, or browser dependency.
- `application`: use cases, DTOs, ports; depends inward on domain.
- `infrastructure`: API/repository adapters and mappers implementing inward contracts.
- `presentation`: module-owned screens, components, hooks, view models.
- framework route layer: thin delivery composition, not business implementation.

Do not create new bounded contexts, DDD layers, shared folders, or architecture conventions unless the handoff already approves their responsibility. Never use `common`, `misc`, `helpers`, or `services` as unclear-ownership fallbacks.

For shared presentation composition, preserve the established project structure. If the project uses the current Atomic layout, treat it as:

```text
src/components/ui          # project-approved primitive/atom layer
src/components/molecules
src/components/organisms
src/components/templates
```

Do not infer shadcn, MUI, HeroUI, Radix, or another library from folder names alone. Use the routed capability and live project evidence.

Business semantics remain in the owning module. Load the Atomic rule for actual placement, decomposition, custom-atom gates, variants, slots, and component public APIs.

## File and runtime discipline

- Prefer one primary cohesive responsibility per handwritten file.
- Use framework-reserved filenames where required; otherwise follow repository naming conventions.
- Keep route/page files thin and Client Components at the narrowest cohesive interactive boundary when the framework supports that model.
- Search for existing components/utilities before creating new ones.
- Do not add or change dependencies unless explicitly approved in the handoff/dependency evidence.
- Preserve unrelated changes and avoid speculative cleanup.

## Validation

Coding validates only what the current handoff and working project's established repository contract assign to Coding. Do not prescribe a second generic lint/format/typecheck/build matrix in the harness.

- Use targeted implementation checks when they are explicitly required to prove the assigned production change.
- Leave Test-plan behavioral validation to Testing Logic/Testing UI according to their route.
- Use existing project scripts/hooks/CI for generic quality gates when that repository contract requires them; do not recreate those gates manually just because files changed.
- If expected project hooks (for example Husky) are unavailable/not installed in the current environment, report an environment/setup gap instead of silently substituting a harness-owned validation sequence.
- Report commands actually run, results, failures, and any required checks that could not run. Never make validation pass by weakening configuration, assertions, or unrelated production behavior.

## Unresolved dependent scope

When one topic decision blocks only part of the assigned execution unit, return one compact unresolved record containing:

- rule owner/trigger;
- evidence inspected;
- exact missing or conflicting decision;
- completed independent scope;
- incomplete dependent scope;
- authority or approval required to continue.

Do not persist unresolved records in local plan/progress files. Return them through the structured report to Main; Main requests Scrum Master persistence when durable Jira blocker/revision evidence is required.

## Completion

Return only evidence for the assigned execution unit: implemented behavior, changed files, public contracts, structural/decomposition evidence when triggered, validation, deviations, limitations, and test handoff. Do not update Jira yourself and do not claim unresolved required behavior as complete.
