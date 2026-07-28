---
name: shadcn
description: Use for direct shadcn/ui work: CLI commands, official primitives, presets, registry identity or authoring, docs, updates, debugging, and installed-primitive API mechanics. For community/GitHub items, inspect the exact artifact here, then require supply-chain approval before adoption. Do not trigger for generic frontend work or from components.json alone.
---

# shadcn/ui

Use this skill as the repository adapter for imported shadcn knowledge. Own CLI,
registry, preset, installed-primitive API, and source-mutation mechanics only.
`AGENTS.md`, approved analysis, installed source, and frontend topic rules own
architecture, design, component contracts, accessibility, styling, runtime,
async states, and testing. Ignore and report any conflicting upstream example.

## Select an operating mode

- **Inspect-only:** identify source and project context with non-mutating `info`,
  `docs`, `search`, `view`, `add --dry-run`, and targeted `add --diff`. It may
  supply plan evidence but never authorizes copying, installation, or adoption.
- **Approved mutation:** run `init`, `add` without `--dry-run`, update, preset,
  overwrite, dependency installation, or generated-file adoption only within the
  approved scope. Re-run the preview first and stop when it drifts from approval.

Route unresolved ownership to `design-frontend-module-boundary`, but reuse a
still-valid approved boundary record; do not rerun boundary design merely because
an official primitive is entering the already approved `src/components/ui` atoms
path. Route missing design to `orchestrate-frontend-design`, external provenance
or new dependency evidence to `audit-frontend-supply-chain`, feature
runtime/global CSS/workers/assets to `integrate-third-party-frontend`, and browser
threats to `audit-frontend-security`.

## Workflow

Run one linear transaction:

1. **Classify:** choose inspect-only or approved mutation. Do not load this skill
   merely because `components.json` exists or a generic UI task mentions a
   component.
2. **Resolve:** inspect local configuration, installed UI path/source, and the
   lockfile-resolved runner and CLI. Generic `@latest` examples do not authorize
   an upgrade. Identify `@shadcn` as official; treat community namespaces, GitHub
   addresses, and other registries as third-party exact artifacts.
3. **Short-circuit:** when the primitive already exists and no CLI, registry,
   preset, upstream comparison, or shadcn API question remains, return its local
   path to the ordinary frontend workflow. Do not search registries or refresh
   `info` without evidence.
4. **Inspect:** use version-appropriate docs and preview additions or updates with
   `--dry-run` plus targeted `--diff`. Generated files may land outside `ui`.
5. **Gate:** record artifact/version, previewed files, dependencies,
   CSS/assets/runtime surfaces, required handoffs, approval state, and inspected
   references. Stop dependent work at every unresolved gate.
6. **Apply:** after approval, rerun the same preview. Stop on drift; otherwise
   mutate only the approved files and dependencies.
7. **Verify transaction:** confirm the applied file/dependency set matches the
   approved preview, no unapproved overwrite occurred, and every changed file is
   readable. Return the concrete diff to only the frontend topic rules triggered
   by its evidence.

Do not load `frontend/generated-ui-validation.md` merely because the shadcn CLI
generated source files. Load it only when the parent task independently matches
the approved design/provider-artifact trigger in `frontend-coding.md`.

An official source is not a dependency waiver. If its preview adds a package,
install script, global CSS, asset, worker, runtime, or browser threat, stop and
route that evidence before mutation.

## Update existing components safely

Use the CLI, not raw fetched files, as the upstream comparison source. Run
`--dry-run` and a targeted `--diff` for every local target. Overwrite only an
unchanged file or an explicitly approved replacement; otherwise merge the
reviewed upstream delta manually. Never use `--overwrite` implicitly.

## Handle presets deliberately

Inspect the current and incoming preset before applying it. Ask the developer to
choose overwrite, partial, merge, or skip when components, fonts, tokens, or CSS
can be replaced. Read only the preset sections in [cli.md](./cli.md); never decode
preset values manually.

## Load references only when needed

- Read [rules/composition.md](./rules/composition.md) for shadcn component
  tree/API mechanics and only after checking component availability. Let the
  Atomic and semantics rules decide whether and where to use the pattern.
- Read [rules/forms.md](./rules/forms.md) for a form task whose required
  primitives are installed or approved for addition. Let the approved design and
  semantics rule choose the control and behavior.
- Read [rules/chat.md](./rules/chat.md) only after the exact chat artifacts and
  dependencies pass the external-source gate.
- Read [rules/icons.md](./rules/icons.md) only for configured-library and shadcn
  icon-slot mechanics; use the repository asset rule for icon selection.
- Read [rules/styling.md](./rules/styling.md) only for shadcn variant and generated
  source mechanics; use the repository styling rule for project policy.
- Read [rules/base-vs-radix.md](./rules/base-vs-radix.md) only when the current
  primitive base affects the component API.
- Read only the relevant command or preset section in [cli.md](./cli.md).
- Read the task-routed sections in [registry.md](./registry.md) for registry
  identity, adoption evidence, or authoring.
- Read [mcp.md](./mcp.md) only when a configured/available shadcn MCP is explicitly
  in scope; ordinary CLI work does not load it.
- Read [customization.md](./customization.md) only when approved shadcn preset,
  theme-variable, radius, or component-source customization is in scope.

## Return one evidence record

Return the selected mode, resolved local CLI/config, exact source identity,
installed target, previewed and applied files/dependencies, CSS/assets/runtime
surfaces, approval and drift result, overwrite/merge decision, triggered topic
rules, and unresolved gates. This record is the handoff; do not restate the
frontend policies owned by those rules.
