# Atomic Component Rules

Load this rule only when the Coding decomposition gate or frontend router detects component creation,
splitting, placement, or public component-contract work.

This rule owns component decomposition, Atomic/DDD placement, discovery order, and public APIs. It
does not authorize new product scope, architecture, dependencies, or design decisions beyond the
assigned Jira Subtask and supplied evidence.

## Decompose before implementation

For a new or materially reconstructed UI composition, identify meaningful presentation
responsibilities before writing the complete screen/page.

Use this order:

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
3. existing component/shadcn candidate considered;
4. direct consumers and smallest public contract;
5. blocking interaction/state/design decision, if any.

Do not create a component for every DOM node, wrapper, or short JSX fragment. A meaningful component
owns a cohesive presentation responsibility, recognizable reusable pattern, or stable consumer
contract.

A page/screen containing multiple independent presentation responsibilities must remain a composition
root instead of absorbing all implementation into one TSX file.

## Placement

`src/components/ui` is the complete atoms layer. Never create `src/components/atoms`.

| Responsibility | Owner |
| --- | --- |
| Smallest reusable presentation-neutral primitive | `src/components/ui` |
| Small reusable composition of atoms | `src/components/molecules` |
| Reusable self-contained section | `src/components/organisms` |
| Approved reusable page/layout pattern | `src/components/templates` |
| UI with bounded-context language, business rules, permissions, workflow, or module state | `src/modules/<context>/presentation` |

Atomic level and business ownership are separate decisions. Visual size does not make a component
shared. Do not promote module UI based on predicted reuse.

A shared component must remain presentation-neutral and must not know domain entities, module DTOs,
repositories/APIs, module hooks, or business-state interpretation. The owning module maps business
state to neutral props.

## Discovery order

When a required UI responsibility is not yet mapped:

1. search `src/components/ui` and direct consumers;
2. search shared molecules/organisms/templates and the owning module's presentation components;
3. if an atom capability is still missing, use the `shadcn` skill to inspect the approved registry;
4. prefer composition of existing atoms when it preserves the required semantics/interaction;
5. propose a project-authored atom only after local, registry, and meaningful composition options fail.

Registry inspection is not permission to mutate. Do not duplicate, fork, regenerate, or cosmetically
wrap an existing shadcn primitive merely to change ownership or styling.

## Project-authored atom gate

A new project-authored atom requires explicit developer approval. The request must identify:

- exact missing responsibility;
- local/registry/composition alternatives inspected and why they fail;
- owner, filename, public contract, known consumers;
- accessibility, styling, Server/Client, maintenance, and replacement impact.

Do not create the atom while approval is pending. Continue independent assigned work when possible and
return the unresolved decision to Orchestrator.

## Public APIs

### Props

Shared components accept the smallest presentation-oriented props needed by their responsibility,
never whole domain entities, module DTOs, or API/repository models.

### `className` and `style`

- atoms in `src/components/ui` may expose `className` consistent with shadcn composition;
- project-authored molecules, organisms, templates, and module components must not expose unrestricted
  `className` merely to let consumers deep-style owned structure;
- do not expose unrestricted `style` props from project-authored components.

Use approved typed variants or named slots for supported visual/structural variation.

### Variants

Use typed meaningful variants. When the repository convention uses CVA for public visual variants,
follow it. Native semantic booleans such as `disabled`, `required`, `checked`, and `open` remain
allowed. Do not invent boolean styling props as shortcuts.

### Children, slots, callbacks

- arbitrary `children` are allowed only as content where the component contract owns that position;
- named slots must be intentional typed parts of the public API;
- children/slots must not let consumers replace or reorder structure that the component owns;
- prefer semantic callbacks such as `onSelect`, `onDismiss`, `onValueChange` over DOM-detail callbacks;
- pass only the minimum payload the consumer requires;
- render-prop or imperative APIs require explicit approval when simpler typed props/slots/callbacks
  cannot express the requirement.

### Controlled/uncontrolled behavior

Preserve modes already supplied by approved primitives. Choose controlled state only when parent,
URL, business event, async result, or external action must coordinate it. Do not create imperative
refs merely to control otherwise local state.

## Server/Client boundary

Keep components Server-compatible unless the assigned interaction requires a narrow Client boundary.
Load `react-state-runtime.md` when state/effects/browser APIs/runtime behavior are involved.

## Prohibited shortcuts

Do not:

- implement a complete page first and postpone decomposition until it becomes large;
- split files only to satisfy line count without cohesive responsibility;
- hide business semantics behind generic prop names to force shared ownership;
- pass whole parent state merely to enable extraction;
- copy design-provider source into application source as implementation authority;
- create unrestricted styling/slot/callback escape hatches;
- claim completion while a required component contract or ownership decision remains unresolved.

## Completion evidence

Return decomposition decisions, components reused/created, ownership/public-contract decisions, direct
consumer impact, and unresolved component decisions in the implementation report. Oversized
handwritten TSX handling is enforced by the Coding decomposition gate.
