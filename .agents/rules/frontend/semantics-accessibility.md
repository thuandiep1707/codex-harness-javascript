# Semantic HTML and Accessibility

Load this rule only when the canonical router in `../frontend-coding.md` matches interactive markup,
navigation, headings, forms, accessible names, ARIA state, icon-only controls, or tables. Use only the
relevant internal mode: **control/navigation**, **page structure**, **form/name**, **ARIA and built-in
interaction**, or **table**.

This rule owns semantic meaning and accessibility requirements. `atomic-components.md` owns
component placement and public contracts; the `shadcn` skill owns exact primitive availability and
registry mechanics; `icons-images-assets.md` owns icon and image selection.

Here, **approved primitive** means native HTML or an installed/approved shadcn component using its
live configured base, currently Radix where applicable. Do not assume every future primitive is Radix.

## Semantic baseline

Use the native HTML element whose semantics match the responsibility. Use ARIA only to express information that native HTML and the approved component contract do not already provide; ARIA must not repair an incorrect element choice.

- Do not make `div` or `span` elements interactive with click handlers, roles, keyboard handlers, or `tabIndex`.
- Prefer an approved primitive for composite interactions.
- Do not duplicate, override, or contradict semantics and ARIA supplied by that primitive.
- Do not author a custom dialog, menu, select, tabs, combobox, tree, grid, or other complex ARIA widget.
- If native HTML and approved shadcn/ui components cannot express the required interaction, record it as unresolved and continue independent work. A custom accessible interaction requires a separately approved plan.

## Button and link decisions

Use a button for an in-context action and Next.js `Link` for a route, resource, external URL, or
fragment. For button-styled navigation, compose approved Button `asChild` with `Link`; do not use
`router.push` when a link represents the destination.

- Do not use an anchor for a non-navigation action.
- Do not cancel a link's default behavior to turn it into a button.
- Declare the `type` of a button used inside a form.
- Use `type="submit"` only when the control submits that form; use `type="button"` for other form actions.
- Expose semantic callbacks from molecules and organisms rather than leaking raw internal DOM events when the component contract does not require them.

## Page landmarks

Templates and route-level page composition own page landmarks. Module screens must not duplicate landmarks already provided by their template.

- Render no more than one `main` landmark for a page composition.
- Use `header`, `nav`, `main`, `aside`, and `footer` for their semantic responsibilities, not as styling substitutes.
- Give repeated landmarks of the same type, especially multiple `nav` elements, distinct accessible labels.
- Use `section` only for a meaningful region with an associated heading; use `div` for grouping without semantic structure.
- Use `ul` or `ol` when content is a semantic list.

## Heading hierarchy

Choose heading levels from the document structure, not from visual font size.

- The page or approved template contract owns the page `h1`.
- Descendant sections follow the established heading hierarchy without selecting levels for styling convenience.
- Do not add a second page heading when the template already supplies it.
- Use the title contract supplied by shadcn Dialog, AlertDialog, Sheet, and similar components instead of constructing a visually styled title without semantics.
- Apply typography through approved design-system classes; do not change heading levels to achieve a visual result.

## Forms and fields

Every form control must have an accessible name.

- Associate a visible label with its control through the approved shadcn form/field contract or native `htmlFor` and `id` relationship.
- Do not use placeholder text as the only label.
- Use `fieldset` and `legend` for a meaningful group of related controls when the approved component contract supports that structure.
- Preserve the semantic differences among `required`, `disabled`, and `readOnly`; do not substitute one for another to obtain a visual state.
- Associate approved field descriptions and validation errors with the control through stable IDs and the component's supported `aria-describedby` and `aria-invalid` contract.
- Do not invent loading, error, success, or validation visuals or copy while those conventions remain deferred.
- Do not block paste or other native text-entry behavior.

## Accessible names

Accessible names describe the action, destination, or information in natural user-facing language.

- Prefer visible text when the approved design provides it.
- Put the accessible name on the interactive control, not on a nested icon or decorative child.
- An icon-only control requires a natural-language `aria-label` or approved labelled-by relationship.
- Use an action verb for actions and a destination description for navigation.
- Do not use `snake_case`, icon identifiers, filenames, visual-shape descriptions, or words such as "icon", "button", and "link" as the accessible name.
- Keep accessible names consistent with the interface language and approved product terminology.

Mark an icon `aria-hidden="true"` when adjacent text, the control name, or approved state already
communicates its meaning. When it is the only information source, provide equivalent accessible text
or state. See `icons-images-assets.md` for asset selection and image alt rules.

## ARIA state and relationships

Add ARIA state only when the element has the corresponding behavior and the approved native or shadcn contract does not already own it.

Common valid relationships include:

- `aria-expanded` with `aria-controls` for a control that expands a related region;
- `aria-current="page"` for the current navigation destination;
- `aria-pressed` for a toggle button;
- `aria-invalid` and `aria-describedby` for an invalid field and its approved error description;
- `aria-busy` for a region whose approved contract exposes an in-progress update.

Do not add roles or ARIA attributes merely to appear accessible. Do not manually add `aria-selected`, composite-widget roles, or relationships already managed by an approved primitive.

## Keyboard behavior

Do not implement custom keyboard interaction.

- Rely on approved primitives for keyboard behavior.
- Do not add `onKeyDown`, `onKeyUp`, roving tabindex, key maps, or keyboard shortcuts to recreate an existing control.
- Do not use positive tab order such as `tabIndex={1}`.
- Do not add `tabIndex={0}` to make a non-interactive element behave like a control.
- Do not disable, intercept, or replace keyboard behavior supplied by the browser or approved primitive.

When the required behavior is unavailable through native HTML or an approved primitive, keep that dependent interaction unresolved rather than implementing custom keyboard logic.

## Focus behavior

Do not implement custom focus management.

- Rely on native HTML and focus behavior supplied by approved primitives.
- Do not add imperative mount-time focus, manual focus movement, custom focus trapping, or custom focus restoration.
- Do not remove or suppress an existing focus indicator without an approved replacement supplied by the design system.
- Do not bypass the focus behavior of Dialog, AlertDialog, Sheet, Popover, Select, Menu, or similar approved primitives.

If a future task requires behavior that the approved primitive cannot provide, document the requirement and request developer approval rather than adding focus logic incidentally.

## Tables

Use the repository's shadcn/ui Table primitive for tabular data.

- Reuse the local Table component when it is installed.
- If it is absent, let `atomic-components.md` confirm the missing atom and route exact availability and add mechanics to the `shadcn` skill.
- Do not create a project-authored table primitive or hand-code a raw `table`, `thead`, `tbody`, `tr`, `th`, or `td` abstraction in feature code to bypass the shadcn component.
- Keep business-specific columns, row actions, filters, data mapping, and event callbacks in the owning module presentation layer.
- Do not use a table for a visual card collection that has no row-and-column relationship.

## Unresolved accessibility workflow

An unresolved semantic or accessibility decision blocks only the dependent interaction. Use the
shared unresolved record in `../frontend-coding.md`, adding the required user-facing behavior,
approved primitives inspected, and why their contracts do not satisfy it.

Do not replace the missing behavior with an interactive `div`, custom ARIA widget, custom keyboard handler, custom focus logic, or an inaccessible temporary control. Do not report the dependent interaction as complete.

## Completion evidence

Add to the shared completion record: selected native or approved primitives, button/link and landmark
decisions, heading/label/name/ARIA relationships, and confirmation that built-in keyboard and focus
behavior remains intact.
