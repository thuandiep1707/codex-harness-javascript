# Customization & Theming

Use this reference only after the developer approves a shadcn preset, theme,
radius, CSS-variable, or component-source customization. The repository design,
Atomic, and styling authorities own whether the customization is allowed and
where it belongs.

Do not install a theme provider, add a dependency, create a token, edit global
CSS, add a variant, expose `className`, or create a wrapper merely because an
upstream example demonstrates that capability.

## Inspect the local theme surface

Resolve current values from `components.json`, the lockfile-resolved CLI, the
configured `tailwindCssFile`, installed component source, and live CSS/config.
Confirm at least:

- configured base, style, icon library, and CSS-variable mode;
- actual light/dark selector and existing provider ownership;
- existing semantic variable names and Tailwind mapping;
- current radius and component variants;
- local modifications that a preset or upstream update could replace.

Live project source wins over this imported reference.

## Understand shadcn variable mechanics

Shadcn themes commonly define semantic variables in `:root` and a dark-mode
selector, map them to Tailwind utilities, and consume those utilities from
generated components. Common paired variables use `name` and
`name-foreground`; exact names, color format, and mappings depend on the local
version and preset.

Treat changes to `--radius` as global component impact. Treat a new semantic
variable or changed dark-mode/provider setup as a project styling/runtime
decision, not a shadcn default.

## Apply a preset as a mutation transaction

Use only the lockfile-resolved command forms documented in [cli.md](./cli.md).
Before applying a preset:

1. Inspect current configuration, CSS, fonts, components, and local changes.
2. Preview the incoming impact.
3. Ask for the explicit overwrite, partial, merge, or skip decision required by
   the main skill.
4. Route new packages, global CSS, assets, runtime, or browser threats to their
   owning gates.
5. After approval, rerun the preview and stop on drift.
6. Apply only the approved delta and verify the transaction.

Preset codes are opaque. Pass an approved code to the CLI; do not decode or
resolve it manually.

## Customize component source conditionally

Inspect built-in variants and local consumers first. If an approved design cannot
use the installed contract, return the missing decision to the Atomic and
styling rules. They own whether to add a variant, change generated source,
compose a higher-level component, or introduce a shared token.

Use [rules/styling.md](./rules/styling.md) only to understand shadcn-owned variant
and source mechanics. It does not authorize project styling.

## Compare updates safely

Use `add <component> --dry-run` and targeted `--diff` with the lockfile-resolved
CLI. Follow [the safe update workflow](./SKILL.md#update-existing-components-safely)
for overwrite and manual-merge decisions. Never use raw upstream files as the
comparison authority.
