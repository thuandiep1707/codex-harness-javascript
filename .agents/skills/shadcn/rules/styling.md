# Styling & Customization

Use this reference only for styling mechanics exposed by installed shadcn source.
Read the repository styling rule for every project token, class, layout, global
CSS, responsive, stacking, animation, or public `className` decision. That rule
is normative.

## Inspect before styling

Read the installed primitive and its direct consumers before changing it.
Confirm which variants, data attributes, CSS variables, slots, portal behavior,
and utility classes the local version actually owns. Generic upstream examples
and generated arbitrary syntax are evidence about upstream implementation, not
precedent for project-authored styling.

## Prefer the installed contract

- Use an existing variant only when its semantics match the approved design.
- Do not recreate an installed variant by deep-styling a consumer.
- Do not add a new variant, token, global CSS rule, animation, z-index, or style
  escape hatch from this reference. Return that decision to the repository
  styling and Atomic rules.
- Preserve upstream internal classes during an unchanged install or reviewed
  update, but do not copy those classes into unrelated project code.
- Treat overlay portals and stacking as runtime/template evidence when they
  interact with the project's layer system.

## Route customization separately

Read [customization.md](../customization.md) only after theme, preset, radius,
CSS-variable, or component-source customization is explicitly approved. Use
[icons.md](./icons.md) only for icon slots owned by an installed shadcn
component. Use [chat.md](./chat.md) only for already approved chat artifacts and
their exact shipped utilities.

If the requested appearance is not expressible by the installed contract, report
the missing variant/token/design decision. Do not silently turn an upstream
recommendation into project policy.
