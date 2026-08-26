# Styling and Layout Rules

Load this rule only when the frontend router matches project styling, design tokens, component styling, visual variants, provider CSS, or layout behavior.

The transient Jira handoff, approved design evidence, routed internal capabilities, and live product design-system configuration own allowed scope. This rule does not read `.docs/`/`.analysis/`, create a local plan, approve a new token, variant, global CSS rule, responsive scope, or third-party styling exception on its own.

## Styling source order

Resolve visual requirements in this order:

1. existing component public variant/composition contract;
2. existing shared/module component owning the pattern;
3. existing semantic design-system token/rule;
4. standard utility/API of the project styling system detected from source/config and routed by Orchestrator.

Do not assume Tailwind, CSS Modules, MUI `sx`, styled-components, or another mechanism merely because this control repo knows about it. Map by semantic responsibility, not by copying provider CSS values. If no approved mapping exists, return the exact missing styling decision to Orchestrator instead of approximating a value or silently expanding the design system.

## Project styling-system policy

Use only the styling mechanism already established and approved by project evidence for the assigned scope.

- If the project uses Tailwind, preserve its installed version, token conventions, and approved utility policy.
- If the project uses a component-library styling API such as MUI or another system, follow that routed capability/library contract rather than forcing Tailwind semantics.
- If multiple mechanisms coexist, stay inside the owner/component convention evidenced by nearby source; do not standardize one system across the project without architecture authority.
- Do not introduce a new styling mechanism or second design-token system merely because it is familiar.

For utility systems that allow arbitrary values/selectors, do not introduce ad-hoc values merely to match a screenshot when an existing semantic token/variant should own the decision. Provider-generated code is design evidence, not precedent for handwritten project conventions.

## Inline and computed styles

Follow the project's established component/runtime contract. Do not expose unrestricted `style` or equivalent escape hatches from project-authored shared components merely to bypass ownership. A narrow third-party runtime exception is allowed only when approved integration evidence proves no supported class/config/theme API can satisfy the requirement. Keep the exception isolated and record exact properties and validation.

## Provider mapping

Provider CSS/classes/values are design evidence only. For each material value, map the semantic role to an existing component variant, token, utility, theme API, or approved contract. Otherwise leave the dependent visual decision unresolved. Do not copy provider CSS wholesale or create a feature-local design-system fork for pixel fidelity.

## Responsive and fluid layout

Implement only responsive scope explicitly included by the assigned Task/design evidence. Do not invent mobile/tablet layouts or breakpoints.

Within the approved viewport scope, major page/workspace regions must remain fluid unless a fixed contract is explicitly required. Do not lock the whole layout to a design-frame width/height.

Fixed intrinsic/design-system dimensions are allowed for things such as icons, status indicators, avatars, approved control sizes, intrinsic image metadata, media aspect ratios, or approved specialized runtime internals when they do not freeze the surrounding layout.

## Variants and ownership

- prefer existing component variants/theme APIs over internal overrides;
- follow `atomic-components.md` for component API/variant ownership;
- do not deep-style/fork a shared component from a consumer;
- higher-level components should use controlled variants/slots rather than unrestricted styling escape hatches;
- use only an approved stacking/z-index contract supplied by current source/design evidence; do not invent numeric hierarchy.

## Approval-required changes

Return to Orchestrator/developer before:

- adding/changing design tokens or global styling/theme rules;
- adding a shared visual variant not already authorized;
- introducing a new styling mechanism;
- introducing a third-party inline/computed-style exception;
- expanding responsive scope.

A missing style/token/layout contract blocks only dependent UI. Continue independent assigned work where safe and report the inspected mappings, exact missing decision, approved exceptions, and validation evidence. Do not report dependent UI complete while required visual behavior is unresolved.
