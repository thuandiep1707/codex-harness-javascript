# Atomic Component Rules

Load this rule only when the canonical router in `../frontend-coding.md` matches component creation,
generation, splitting, placement, change, shadcn primitive use, or public props, variants, children,
slots, or callbacks.

This rule defines component decomposition, discovery, ownership, and public APIs. It does not authorize application implementation, package installation, a shadcn registry change, or a new design-system primitive outside an approved task plan.

Use only the modes supported by task evidence:

- **Existing component:** preserve ownership and inspect direct consumers before changing its contract.
- **New composition:** decompose, search, classify Atomic level and DDD owner, then define the smallest contract.
- **Missing atom:** complete local discovery, then hand exact shadcn availability or registry mechanics to the `shadcn` skill.
- **Project-authored atom:** use only after local, official-primitive, and composition options fail and the developer approves it.

This rule owns component responsibility, Atomic/DDD placement, discovery order, public contracts, and
the custom-atom gate. The `shadcn` skill owns exact CLI, registry identity, preview, install,
overwrite, and generated-source mechanics. Styling values and semantic behavior remain owned by
their topic rules.

## Required decomposition before implementation

Decompose an approved design from the smallest meaningful presentation responsibilities upward before writing the screen or page:

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

- Do not implement a complete screen first and postpone component classification until the file becomes large.
- Treat Atomic level and DDD ownership as separate decisions. Visual size alone does not make a component globally shared.
- A meaningful component owns a cohesive presentation responsibility, a recognizable design-system pattern, or a stable consumer contract. Do not create a component for every DOM node, layout wrapper, or short JSX fragment.
- Component decomposition and file extraction do not by themselves justify runtime code splitting. Apply the runtime rule separately when task evidence requires it.

Before implementation, record a decomposition map for each meaningful element:

1. Its presentation responsibility.
2. Its Atomic level or bounded-context owner.
3. The existing component or shadcn candidate considered.
4. Its direct consumers and smallest meaningful public contract.
5. Any state, interaction, styling, asset, or deferred-design decision that blocks it.

Design-provider HTML, JSX, CSS, SVG, component names, and generated source are design evidence only. Do not copy them into application source or let them redefine repository ownership and component contracts.

## Atomic levels and ownership

`src/components/ui` is the complete atoms layer. It contains both:

- components installed from the shadcn/ui registry; and
- developer-approved project-authored atoms that follow the repository's current shadcn conventions.

Never create `src/components/atoms`.

Use these placement rules:

| Responsibility                                                                            | Owner                                |
| ----------------------------------------------------------------------------------------- | ------------------------------------ |
| Smallest reusable, presentation-neutral primitive                                         | `src/components/ui`                  |
| Small reusable composition of atoms with a stable presentation contract                   | `src/components/molecules`           |
| Reusable, self-contained section composed from lower levels                               | `src/components/organisms`           |
| Approved, controlled page or workspace pattern                                            | `src/components/templates`           |
| UI carrying bounded-context language, rules, permissions, workflow, or module-owned state | `src/modules/<context>/presentation` |

A shared component must have a presentation-neutral responsibility, a stable presentation contract
for known consumers or an approved pattern, and no business rules, use cases, repository/API
knowledge, module hooks/context, or domain-state interpretation. The owning module maps business
state to neutral props. Visual size alone never makes a component shared.

Do not promote a module component to a shared layer based only on predicted reuse. Do not move business semantics into a generic prop name to disguise module ownership.

## Component discovery and shadcn decision order

Use this order whenever a required UI responsibility is not yet mapped:

1. Search `src/components/ui` and its direct consumers for an existing atom and public API.
2. Search existing shared molecules, organisms, and templates, then the owning module's presentation components.
3. When an atom is still missing, identify the exact capability and hand registry availability to the `shadcn` skill, which resolves `components.json`, the local CLI, source identity, and installed-version evidence.
4. If the shadcn handoff returns an official candidate, use it only through the approved preview, gate, and apply flow.
5. If shadcn does not provide it, determine whether existing atoms can compose the responsibility. Place a multi-element stable composition at the correct higher Atomic level; do not mislabel it as an atom.
6. Propose a project-authored atom only when the local system, the matching shadcn registry, and meaningful composition cannot satisfy the requirement.

An approximate name match is not sufficient. The candidate must preserve the required semantics, interaction, and public contract.

Registry inspection does not authorize mutation. Consume the shadcn handoff record for source
identity, previewed files and dependencies, approval state, and drift. Do not duplicate its CLI
workflow here or overwrite an existing component without explicit developer approval.

## Project-authored atom approval gate

Creating a project-authored atom requires explicit developer approval. Report the exact
responsibility; local atoms, direct consumers, and matching shadcn evidence inspected; rejected
composition alternatives; proposed owner, filename, contract, and consumers; accessibility, styling,
Server/Client, maintenance, and replacement impact; and planned contract validation.

Do not create the atom while approval is pending. Continue independent issue work and consolidate the unresolved atom decision at task end.

After approval, place the atom in `src/components/ui` using live `components.json`, nearby shadcn
conventions, the configured primitive base (currently Radix where required), `cn`, CVA for public
visual variants, approved tokens/utilities, and applicable prop/ref/`data-slot`/semantic patterns. It
must remain presentation-neutral, Server-compatible unless its approved interaction requires a narrow
client boundary, narrowly typed without escape hatches, and validated for its interaction/contract.

## Component public APIs

### Presentation props

Shared components accept the smallest presentation-oriented props required by their responsibility,
never domain entities, module DTOs, API/repository models, or other module-owned types. The owning
module maps those values to neutral labels, tones, variants, identifiers, and semantic callbacks.

### `className` and `style`

- Only atoms in `src/components/ui` may expose `className`, consistent with shadcn composition.
- Molecules, organisms, templates, and module components must not expose `className`.
- No project-authored component may expose a `style` prop.
- Higher-level visual differences use approved typed variants and named slots; consumers must not deep-style, reorder, or replace owned internal structure.

Apply `.agents/rules/frontend/styling-layout.md` to every class and variant value, including classes passed to an atom.

### Variants

- Every project-authored component with public visual variants must implement them with CVA.
- Do not introduce CVA when a component has no variant.
- Use typed, meaningful variant values. Do not implement visual modes with conditional class strings, inline styles, or new boolean styling props.
- Native semantic boolean state such as `disabled`, `required`, `checked`, and `open` remains allowed.
- Preserve boolean state or behavior contracts supplied by existing upstream shadcn components. Their existence does not authorize new project-authored boolean styling APIs.

### Children, slots, and render props

- Components may accept arbitrary `ReactNode` children as content.
- Named slot APIs are allowed when each slot is an intentional, typed part of the component's public contract. Consumers may provide slot content only at the positions owned by that contract.
- `children` and slots do not authorize consumers to replace, reorder, deeply style, or bypass structure owned by an organism or template.
- Render-prop APIs are disallowed by default. Introducing one requires explicit developer approval with evidence that typed props, children, named slots, variants, and semantic callbacks cannot express the requirement.

### Event callbacks

- Molecules and organisms may expose typed semantic event callbacks.
- Name callbacks after the user or component action, such as `onSelect`, `onDismiss`, or `onValueChange`, instead of exposing internal DOM structure.
- Pass only the minimum payload required by the consumer. A shared callback must not return a domain entity or module-owned DTO.
- Atoms may preserve native or upstream shadcn event contracts where those contracts are part of the primitive API.

### Controlled and uncontrolled contracts

- Preserve controlled and uncontrolled modes already provided by shadcn primitives. Do not fork a primitive to remove or reinvent them.
- Use an uncontrolled component when its state is entirely local and users operate it through the primitive's built-in trigger or interaction contract.
- Use a controlled component when a parent, external action, business event, URL state, or asynchronous result must open, close, select, reset, or otherwise coordinate it.
- Do not create an imperative ref API to control an otherwise uncontrolled component.
- Do not design a new project-authored component to support both modes unless approved consumer evidence requires both.

## Prohibited shortcuts

Do not duplicate, fork, regenerate, or cosmetically wrap a local shadcn atom; place business UI in a
shared layer; extract files for line counts; pass whole parent state merely to enable extraction; add
unrestricted slots, `className`, or callbacks; copy provider source; or claim completion while a
required atom, contract, or design-system decision remains unresolved.

## Unresolved decisions and reporting

A missing atom or component contract is a local blocker, not permission to invent one and not necessarily a blocker for the entire issue.

Use the shared unresolved record in `../frontend-coding.md`. Add the decomposition map, local
components and composition alternatives inspected, the shadcn handoff result when applicable,
ownership and public-contract decisions, and any approved registry or custom addition.
