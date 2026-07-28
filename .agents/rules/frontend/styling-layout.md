# Styling and Layout Rules

Load this rule only when the canonical router in `../frontend-coding.md` matches CSS, Tailwind,
design tokens, component styling, visual variants, provider CSS, or desktop layout. Use only the
relevant internal mode: **existing styling**, **variant values**, **provider mapping**, **global/token
proposal**, **desktop layout**, or **integration exception**.

This rule documents approved styling and desktop-layout constraints. It does not authorize a new design token, component variant, global CSS rule, mobile/tablet design, or third-party styling exception outside an approved task plan.

This rule owns allowed styling sources, class/token values, layout behavior, and styling exceptions.
`atomic-components.md` owns whether a component exposes a variant, CVA contract, `className`,
children, or slots. When both trigger, Atomic defines the API and this rule validates its values.

## Styling source of truth

Use only styling capabilities already approved by the repository. Resolve a visual requirement in this order:

1. An existing component's public variant or composition contract.
2. An existing shared atom, molecule, organism, or template that owns the pattern.
3. An existing semantic design-system token or rule in `src/app/globals.css`.
4. A standard Tailwind utility supported by the repository's installed Tailwind version.

Map visual intent by semantic responsibility, not by copying provider CSS values. Do not invent a color, spacing step, typography value, radius, shadow, z-index, token, variant, or global class when the approved sources do not provide it.

If no approved mapping exists, record the missing styling decision and request developer approval. Continue independent work instead of approximating the value, adding a local workaround, or silently expanding the design system.

## Tailwind utility policy

Project-authored component styling must use standard Tailwind utility classes and approved design-system utilities.

Do not introduce arbitrary Tailwind values, arbitrary properties, arbitrary variants, or arbitrary selectors in project-authored code. Prohibited forms include, but are not limited to:

```text
w-[...]
h-[...]
bg-[#...]
shadow-[...]
z-[...]
grid-cols-[...]
[property:value]
[&...]
```

Do not use an arbitrary CSS variable expression as a workaround for this restriction.

Installed or newly generated upstream shadcn source may contain arbitrary selectors or values required by that upstream implementation. Preserve such generated syntax when using the approved shadcn workflow; do not remove it solely to satisfy this rule. It is not precedent for project-authored atoms or other components, and agents must not imitate it manually.

Do not create component-scoped stylesheets, CSS Modules, CSS-in-JS, or copied CSS blocks to bypass the Tailwind and design-system contract. A proposed global design-system rule or token is an architecture/design-system change and requires developer approval in the task plan.

## Inline style prohibition

Do not write inline CSS, computed style objects, or expose a `style` prop from a project-authored component.

An exception is possible only when an approved library/runtime technically requires inline styles and
has no suitable class or configuration API. The approved plan records its integration owner,
requirement evidence, rejected class/token/config alternatives, exact inline properties, isolation,
and validation.

Keep an approved exception at the narrowest integration adapter or client-runtime boundary. Do not spread it into shared Atomic components, module business UI, or consumer APIs, and do not treat one approved integration exception as a general styling precedent.

## Design-provider CSS

CSS, utility classes, values, and generated component styling returned by a design provider are evidence only. Do not copy them directly into application source.

For each provider value, identify its semantic role; inspect existing variants, shared patterns,
`src/app/globals.css` tokens/rules, and supported Tailwind utilities; then use only a mapping that
preserves the role and contract. Otherwise record it as unresolved for developer approval.

Do not use arbitrary Tailwind syntax, inline CSS, a feature stylesheet, a copied component variant, or an approximate hard-coded value to achieve provider-level pixel fidelity. Do not modify global CSS or a shared component for one feature without an approved design-system impact plan.

An unresolved styling decision should report:

- the owning component and design location;
- the visual responsibility and provider evidence;
- existing variants, tokens, global rules, and utilities inspected;
- why the available mappings are insufficient;
- the proposed token, variant, or design decision for developer review; and
- which independent work was completed while the decision remained pending.

## Fluid desktop layout

Mobile and tablet implementation is outside the current scope. Do not add new mobile/tablet layouts or breakpoint behavior unless an explicit requirement and approved design bring them into scope.

Desktop UI must remain fluid across desktop viewports. Page/route roots, templates/workspaces,
headers, navigation/sidebars, main content, panels, major regions, and grid/table containers must not
be fixed to one design-frame width or height.

Use standard fluid layout utilities and existing component contracts for available-space allocation, such as full/minimum sizing, flex or grid flow, growth and shrink behavior, wrapping, approved constraints, and overflow behavior. Select the exact utility only from repository-approved design-system and Tailwind capabilities.

Do not hard-code an overall region's width or height through Tailwind sizing classes, inline styles, DOM measurements, or values copied from a design frame. A fixed desktop mockup is evidence of hierarchy and proportion, not authorization to lock the application to that viewport.

Fixed intrinsic or design-system-controlled dimensions remain allowed when they do not fix the surrounding layout. Examples include:

- icons, status indicators, and avatars;
- approved control size variants;
- image intrinsic `width` and `height` metadata;
- approved media aspect-ratio contracts; and
- specialized runtime internals covered by an approved integration exception.

Intrinsic image dimensions reserve aspect ratio and do not replace fluid layout classes. Apply `.agents/rules/frontend/icons-images-assets.md` for the complete Next.js Image contract.

## Variants, composition, and stacking

- Prefer an existing component variant over repeating or overriding its internal classes.
- Apply the approved typed CVA contract from `atomic-components.md`; do not create a parallel variant system with conditional classes or boolean styling props.
- Preserve native semantic boolean props and upstream shadcn behavior contracts; they are not styling precedents for new components.
- Preserve the Atomic rule that only atoms expose `className`; higher layers use controlled variants, children, and named slots.
- Do not use deep selectors, copied variants, feature forks, or consumer overrides to bypass an atom, organism, or template contract.
- Use the approved semantic stacking hierarchy in `.analysis/README.md`. Do not invent numeric z-index values or expose `zIndex` as a consumer prop.

## Approval and unresolved workflow

Developer approval is required before:

- adding or changing a design token or global CSS rule;
- adding a shared visual variant not already covered by the approved plan;
- introducing a component stylesheet or non-Tailwind styling mechanism;
- implementing a third-party inline-style exception; or
- expanding the task into mobile or tablet layout behavior.

A missing style, token, or layout contract blocks only the dependent UI. Use the shared unresolved and
completion records in `../frontend-coding.md`, adding inspected variants/tokens/utilities, provider
evidence, fluid-layout decisions, approved exceptions, and validation for arbitrary Tailwind or
unauthorized inline styles.
