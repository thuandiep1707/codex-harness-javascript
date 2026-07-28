# shadcn Icon Mechanics

Use this reference only for icon behavior implemented by installed shadcn
components. Use the repository asset and Atomic rules to select an icon, approve
a custom SVG, and design project-authored icon props.

## Resolve the configured library

Read `iconLibrary` from current shadcn project context before importing an icon.
Resolve the actual installed package; do not assume Lucide from an upstream
example. An absent icon package or changed library is dependency evidence for the
main shadcn gate.

## Respect component-owned slots

Inspect installed component source before adding icon attributes or classes.
When the component contract uses `data-icon="inline-start"` or
`data-icon="inline-end"`, apply that slot marker instead of reproducing its
spacing manually.

Do not add width, height, margin, or color classes when the installed component
already owns those styles. Route a requested visual override to the repository
asset and styling rules rather than treating this imported reference as
approval.

## Keep API ownership outside this reference

Do not introduce a string-to-icon map, polymorphic icon prop, wrapper component,
or shared icon abstraction from this file. Those are project component-contract
decisions owned by the Atomic and asset rules.
