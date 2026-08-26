# Atomic Component Rules

Load this rule only when the Coding decomposition gate or frontend router detects component creation, splitting, placement, or public component-contract work.

This rule owns component decomposition, Atomic/DDD placement, discovery order, and public APIs. It does not authorize new product scope, architecture, dependencies, design decisions, or a UI library beyond the assigned Jira Subtask and supplied evidence.

## Decompose before implementation

For a new or materially reconstructed UI composition, identify meaningful presentation responsibilities before writing the complete screen/page.

Use the repository's established shared/module component structure. When the project uses the current Atomic layout, interpret it as:

```text
src/components/ui
        ↓
src/components/molecules
        ↓
src/components/organisms
        ↓
src/components/templates
        ↓
src/modules/<context>/presentation
```

For each meaningful responsibility record in implementation evidence:

1. responsibility;
2. Atomic level or bounded-context owner;
3. existing project component / routed UI-library candidate considered;
4. direct consumers and smallest public contract;
5. blocking interaction/state/design decision, if any.

Do not create a component for every DOM node, wrapper, or short JSX fragment. A meaningful component owns a cohesive presentation responsibility, recognizable reusable pattern, or stable consumer contract.

A page/screen containing multiple independent presentation responsibilities must remain a composition root instead of absorbing all implementation into one TSX file.

## Placement

When the repository uses `src/components/ui` as its primitive layer, keep that convention. Never invent a competing atoms folder merely because another project or library uses one.

| Responsibility | Owner |
| --- | --- |
| Smallest reusable presentation-neutral primitive | repository's approved primitive/atom layer |
| Small reusable composition of primitives | shared molecule/composition layer when present |
| Reusable self-contained section | shared organism/section layer when present |
| Approved reusable page/layout pattern | shared template/layout layer when present |
| UI with bounded-context language, business rules, permissions, workflow, or module state | owning module presentation layer |

Atomic level and business ownership are separate decisions. Visual size does not make a component shared. Do not promote module UI based on predicted reuse.

A shared component must remain presentation-neutral and must not know domain entities, module DTOs, repositories/APIs, module hooks, or business-state interpretation. The owning module maps business state to neutral props.

## Discovery order

When a required UI responsibility is not yet mapped:

1. search the repository's existing primitive/shared component layer and direct consumers;
2. search shared compositions and the owning module's presentation components;
3. inspect the internal UI-library capability routed in the current handoff, if one exists;
4. prefer composition of existing approved primitives when it preserves required semantics/interaction;
5. propose a project-authored primitive only after local, routed-library, and meaningful composition options fail.

A capability path is not adoption authority. For example, use the shadcn capability only when Orchestrator routed it from evidence that the project actually uses/approves shadcn. The same rule applies to MUI, HeroUI, Radix, or future capability packages.

Do not duplicate, fork, regenerate, or cosmetically wrap an existing approved primitive merely to change ownership or styling.

## Project-authored primitive gate

A new project-authored primitive requires explicit developer/architecture authority when it establishes a new shared contract. The request must identify:

- exact missing responsibility;
- local/routed-library/composition alternatives inspected and why they fail;
- owner, filename, public contract, known consumers;
- accessibility, styling, runtime boundary, maintenance, and replacement impact.

Do not create the primitive while approval is pending. Continue independent assigned work when possible and return the unresolved decision to Orchestrator.

## Public APIs

### Props

Shared components accept the smallest presentation-oriented props needed by their responsibility, never whole domain entities, module DTOs, or API/repository models.

### `className` and `style`

Follow the repository's established primitive-library composition contract. Do not assume shadcn-style `className` exposure when another UI system owns component styling.

Project-authored higher-level shared/module components must not expose unrestricted `className` or `style` merely to let consumers deep-style owned structure. Use approved typed variants or named slots for supported visual/structural variation.

### Variants

Use typed meaningful variants following the installed project's convention. Native semantic booleans such as `disabled`, `required`, `checked`, and `open` remain allowed. Do not introduce a variant library or boolean styling API just because a capability package exists.

### Children, slots, callbacks

- arbitrary `children` are allowed only as content where the component contract owns that position;
- named slots must be intentional typed parts of the public API;
- children/slots must not let consumers replace or reorder structure that the component owns;
- prefer semantic callbacks such as `onSelect`, `onDismiss`, `onValueChange` over DOM-detail callbacks;
- pass only the minimum payload the consumer requires;
- render-prop or imperative APIs require explicit approval when simpler typed props/slots/callbacks cannot express the requirement.

### Controlled/uncontrolled behavior

Preserve modes already supplied by approved primitives. Choose controlled state only when parent, URL, business event, async result, or external action must coordinate it. Do not create imperative refs merely to control otherwise local state.

## Runtime boundary

Preserve the framework/runtime boundary already established by project evidence. For Next.js/React Server/Client concerns, load `react-state-runtime.md` when state/effects/browser APIs/runtime behavior are involved.

## Prohibited shortcuts

Do not:

- implement a complete page first and postpone decomposition until it becomes large;
- split files only to satisfy line count without cohesive responsibility;
- hide business semantics behind generic prop names to force shared ownership;
- pass whole parent state merely to enable extraction;
- copy design-provider source into application source as implementation authority;
- create unrestricted styling/slot/callback escape hatches;
- infer a UI library from this rule instead of the routed capability/project evidence;
- claim completion while a required component contract or ownership decision remains unresolved.

## Completion evidence

Return decomposition decisions, components reused/created, ownership/public-contract decisions, direct consumer impact, routed UI capability used (if any), and unresolved component decisions in the implementation report. Oversized handwritten TSX handling is enforced by the Coding decomposition gate.
