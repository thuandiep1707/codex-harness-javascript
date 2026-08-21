# Styling and Layout Rules

Load this rule only when the frontend router matches CSS, Tailwind, design tokens, component styling,
visual variants, provider CSS, or layout behavior.

The transient Jira handoff, approved design evidence, and live product design-system configuration own
allowed scope. This rule does not read `.docs/`/`.analysis/`, create a local plan, approve a new token,
variant, global CSS rule, responsive scope, or third-party styling exception on its own.

## Styling source order

Resolve visual requirements in this order:

1. existing component public variant/composition contract;
2. existing shared/module component owning the pattern;
3. existing semantic design-system token/rule;
4. standard Tailwind utility supported by the installed repository version.

Map by semantic responsibility, not by copying provider CSS values. If no approved mapping exists,
return the exact missing styling decision to Orchestrator instead of approximating a value or silently
expanding the design system.

## Tailwind policy

Project-authored styling uses standard Tailwind utilities and approved design-system utilities.
Do not introduce arbitrary values/properties/selectors/variants merely to match a design screenshot.
Typical prohibited shortcuts include `w-[...]`, `bg-[#...]`, `shadow-[...]`, `z-[...]`, arbitrary
properties, or arbitrary selectors.

Generated upstream shadcn source may contain syntax required by that upstream implementation. Preserve
it when produced by the approved shadcn workflow; it is not precedent for handwritten project code.

Do not introduce CSS Modules, component-scoped stylesheets, CSS-in-JS, copied provider CSS blocks, or
a global CSS/token change without explicit authority in the handoff/developer approval.

## Inline styles

Do not write inline CSS/computed style objects or expose unrestricted `style` from project-authored
components. A narrow exception is allowed only when approved third-party runtime evidence proves that
no class/config API can satisfy the requirement. Keep the exception isolated at the integration
boundary and record exact properties and validation.

## Provider mapping

Provider CSS/classes/values are design evidence only. For each material value, map the semantic role to
an existing component variant, token, utility, or approved contract. Otherwise leave the dependent
visual decision unresolved. Do not copy provider classes/CSS, add arbitrary Tailwind, or create a
feature-local fork to obtain pixel fidelity.

## Responsive and fluid layout

Implement only responsive scope explicitly included by the assigned Task/design evidence. Do not
invent mobile/tablet layouts or breakpoints.

Within the approved viewport scope, major page/workspace regions must remain fluid unless a fixed
contract is explicitly required. Do not lock the whole layout to a design-frame width/height.

Fixed intrinsic/design-system dimensions are allowed for things such as icons, status indicators,
avatars, approved control sizes, intrinsic image metadata, media aspect ratios, or approved specialized
runtime internals when they do not freeze the surrounding layout.

## Variants and ownership

- prefer existing component variants over internal class overrides;
- follow `atomic-components.md` for component API/variant ownership;
- do not deep-style/fork a shared component from a consumer;
- higher-level components should use controlled variants/slots rather than unrestricted styling escape
  hatches;
- use only an approved stacking/z-index contract supplied by current source/design evidence; do not
  invent numeric hierarchy.

## Approval-required changes

Return to Orchestrator/developer before:

- adding/changing design tokens or global CSS rules;
- adding a shared visual variant not already authorized;
- introducing a new styling mechanism;
- introducing a third-party inline-style exception;
- expanding responsive scope.

A missing style/token/layout contract blocks only dependent UI. Continue independent assigned work
where safe and report the inspected mappings, exact missing decision, approved exceptions, and
validation evidence. Do not report dependent UI complete while required visual behavior is unresolved.
