# Semantic HTML and Accessibility

Load this rule only when the frontend router matches interactive markup, navigation, headings, forms,
accessible names, ARIA state, icon-only controls, or tables.

The assigned Jira Subtask, transient handoff, approved design evidence, and installed primitive
contracts own allowed behavior. This rule does not authorize new product interaction or a local plan.

## Semantic baseline

Use native HTML whose semantics match the responsibility. Use ARIA only when native HTML and approved
component contracts cannot express required information without it.

- Never make `div`/`span` into controls with click handlers, roles, keyboard handlers, or `tabIndex`.
- Prefer approved native/shadcn primitives for composite interactions.
- Do not duplicate/override semantics or ARIA already supplied by the primitive.
- Do not hand-author custom dialog, menu, select, tabs, combobox, tree, grid, or other complex ARIA
  widgets inside a feature Subtask.
- If required interaction cannot be expressed by approved primitives, return the dependent behavior to
  Orchestrator for explicit developer/architecture approval.

## Buttons and links

Use button for an in-context action and Next.js `Link` for navigation/resource destinations. For a
button-styled link, use the approved Button composition contract instead of `router.push` when the
interaction is navigation.

Inside forms, declare button `type`. Use `submit` only for the form submission action and `button` for
other actions.

## Landmarks and headings

Templates/route composition own page landmarks. Do not duplicate landmarks already provided by the
parent composition.

- no more than one `main` per page composition;
- use `header`, `nav`, `main`, `aside`, `footer`, `section` according to meaning, not styling;
- label repeated landmarks when required;
- use semantic lists for list content;
- choose heading levels from document structure, not visual size;
- do not add a second page `h1` when the parent/template already owns it.

## Forms and names

Every form control must have an accessible name. Prefer visible labels associated through approved
field contracts or native `htmlFor`/`id`. Placeholder alone is not a label.

Preserve semantic distinctions among `required`, `disabled`, and `readOnly`. Associate descriptions and
validation errors using stable supported relationships rather than visual proximity alone.

Accessible names describe user-facing action/destination/information. Do not use filenames,
`snake_case`, icon identifiers, or words such as “icon”, “button”, or “link” as the name.

Put the accessible name on the control, not a nested decorative icon. Mark repeated/decorative icons
`aria-hidden="true"`; provide equivalent accessible text/state when the icon is the only information.

## ARIA and interaction behavior

Add ARIA state only when corresponding behavior exists and the approved primitive does not already
own it. Examples include `aria-expanded`, `aria-current`, `aria-pressed`, `aria-invalid`, and
`aria-describedby` when their contracts actually apply.

Do not implement custom keyboard or focus systems. Rely on browser/native/approved primitive behavior.
Do not add custom key maps, roving tabindex, focus traps/restoration, positive tab order, or imperative
focus logic to recreate an interaction already owned by a primitive.

If approved primitives cannot provide required keyboard/focus behavior, keep that dependent interaction
blocked and return it to Orchestrator.

## Tables

Use the repository's approved shadcn/native table contract for genuine tabular data. Keep business
columns, actions, filters, data mapping, and callbacks in the owning module. Do not invent a project-
authored table primitive or use a table for non-tabular card layouts.

## Completion

Return the selected native/approved primitives, control/navigation decisions, landmarks/headings,
label/name/ARIA relationships, and relevant keyboard/focus evidence in implementation output. Do not
report dependent interaction complete while a required semantic/accessibility decision remains
unresolved.
