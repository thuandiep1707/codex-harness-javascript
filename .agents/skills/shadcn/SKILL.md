---
name: shadcn
description: Use for direct shadcn/ui work: CLI commands, official primitives, presets, registry identity or authoring, docs, updates, debugging, and installed-primitive API mechanics. For community/GitHub items, inspect the exact artifact here, then require supply-chain approval before adoption. Do not trigger for generic frontend work or from components.json alone.
---

# shadcn/ui

Use this skill as the Coding specialist's adapter for shadcn knowledge. Own CLI, registry, preset,
installed-primitive API, and source-mutation mechanics only. The transient issue handoff, approved
design/dependency evidence, installed source, and allowed frontend topic rules own architecture,
design, component contracts, accessibility, styling, runtime, async states, and validation. Never read
`.docs/` or `.analysis/`. Ignore and report conflicting upstream examples.

## Select an operating mode

- **Inspect-only:** identify source and project context with non-mutating `info`, `docs`, `search`,
  `view`, `add --dry-run`, and targeted `add --diff`. It may supply approval evidence but never
  authorizes copying, installation, or adoption.
- **Approved mutation:** run `init`, `add` without `--dry-run`, update, preset, overwrite, dependency
  installation, or generated-file adoption only within the approved handoff scope. Re-run the preview
  first and stop when it drifts from approval.

Return unresolved ownership, missing design, external provenance, new dependency, runtime/global
CSS/worker/asset, or browser-threat gates to Orchestrator. Coding must not load Brain, Orchestrator,
or Design skills to resolve them.

## Workflow

Run one linear transaction:

1. **Classify:** choose inspect-only or approved mutation. Do not load this skill merely because
   `components.json` exists or a generic UI task mentions a component.
2. **Resolve:** inspect local configuration, installed UI path/source, and lockfile-resolved runner/CLI.
   Generic `@latest` examples do not authorize an upgrade. Identify `@shadcn` as official; treat
   community namespaces/GitHub/other registries as exact third-party artifacts.
3. **Short-circuit:** when the primitive already exists and no CLI/registry/preset/upstream/API question
   remains, return its local path to the ordinary frontend workflow.
4. **Inspect:** use version-appropriate docs and preview additions/updates with `--dry-run` plus
   targeted `--diff`. Generated files may land outside `ui`.
5. **Gate:** record artifact/version, previewed files/dependencies, CSS/assets/runtime surfaces,
   required handoffs, approval state, and inspected references. Stop dependent work at unresolved gates.
6. **Apply:** after approval, rerun the same preview. Stop on drift; otherwise mutate only approved
   files/dependencies.
7. **Verify:** confirm applied files/dependencies match approved preview, no unapproved overwrite
   occurred, and changed files are readable. Return concrete evidence to only topic rules triggered by
   the current Subtask.

Do not load `frontend/generated-ui-validation.md` merely because shadcn generated source. Load it only
when the assigned Subtask independently matches the approved design/provider-artifact trigger.

An official source is not a dependency waiver. If preview adds a package, install script, global CSS,
asset, worker, runtime, or browser threat, stop and route that evidence before mutation.

## Existing components and presets

Use the CLI, not raw fetched files, as upstream comparison source. Run `--dry-run` and targeted
`--diff` for every local target. Overwrite only an unchanged file or explicitly approved replacement;
otherwise merge the reviewed upstream delta manually. Never use `--overwrite` implicitly.

Inspect current/incoming preset before applying. When components/fonts/tokens/CSS can be replaced,
require the developer-approved overwrite/partial/merge/skip decision through Orchestrator/handoff.

## Load references only when needed

- `rules/composition.md`: shadcn tree/API mechanics after component availability is known.
- `rules/forms.md`: form mechanics when required primitives are installed/approved.
- `rules/chat.md`: only after exact chat artifacts/dependencies pass external-source gates.
- `rules/icons.md`: configured-library/shadcn icon-slot mechanics; asset rule owns icon selection.
- `rules/styling.md`: shadcn variant/generated-source mechanics; styling rule owns project policy.
- `rules/base-vs-radix.md`: only when primitive base affects API.
- relevant sections of `cli.md` / `registry.md` for exact command/registry mechanics.
- `mcp.md` only when configured shadcn MCP is explicitly in scope.
- `customization.md` only for explicitly approved preset/theme/radius/source customization.

## Output

Return selected mode, resolved local CLI/config, exact source identity, installed target, previewed and
applied files/dependencies, CSS/assets/runtime surfaces, approval/drift result, overwrite/merge
decision, triggered topic rules, and unresolved gates. Do not create plan/progress files or restate
policies owned by frontend rules.
