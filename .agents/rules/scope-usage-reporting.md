# Report actual skill and rule usage

Every child role (Brain, Orchestrator, Document, Design, Test Plan, Coding, Testing) must include
`scope-usage` matching `.protocols/scope-usage.yaml` in each response to the Primary Controller.
This is factual self-reported audit metadata, not runtime instrumentation or token accounting.

## Meaning and collection

- A scope skill is a public `SKILL.md` or private `CAPABILITY.md` actually available to and applied
  by this child. Use the exact control-repository-relative path with `/` separators. For external
  skills, preserve the supplied canonical identifier. Do not report display names or aliases.
- A scope rule is a rule document actually supplied/read by this child. A specific section may use
  a `#section-anchor` suffix when only that section was loaded/applied. This includes applicable
  rules embedded in a bootstrap document; do not pretend an unread file was loaded.
- `loaded_scope_skills` / `loaded_scope_rules` record content actually read or supplied in context.
  A path mentioned in a manifest, catalog, routing list, or parent report is not loaded content.
- `used_scope_skills` / `used_scope_rules` record the subset actually applied to this invocation's
  work. Include a rule when its guard was evaluated (even if the action was ruled unnecessary),
  enforced a boundary, or changed an output/validation decision. Mere reading does not imply use.
- Track these sets transiently as loading/application happens. Before each return, deduplicate
  and sort paths; add one concise `usage-evidence` entry per used skill/rule describing observable
  application (for example, validation performed or a protected boundary respected). Include this
  reporting rule itself when applied. Never include hidden reasoning, document contents, secrets,
  or tool transcripts. Do not load additional packages just to populate the audit.
- Keep cumulative sets for this child invocation across controller turns, including use of material
  already in context. Increment the response sequence per return. A fresh child/retry receives a new
  controller-assigned invocation ID and starts fresh; do not copy another child's usage as your own.
  If identity was not supplied, request it from the controller rather than inventing a runtime ID.
- `complete` with `[]` means known none for that category, not unknown. Use `partial` with concrete
  limitations for missing observations, truncated prior context, or uncertain provenance; use
  `unavailable` when nothing can be established. Report known entries honestly. Do not claim exact
  loading totals when the runtime may have injected unobservable context.

## Response integration and exit paths

- Specialists: include metadata once in `agent-report`, not duplicated in their domain artifact.
- Brain: include it in `analysis-package` or `acceptance-report` as appropriate.
- Orchestrator: include its own usage in every `reconciliation-report`, including
  `awaiting-controller`, planning completion, pause, blocked, and failed outcomes. Forwarded specialist
  usage remains attributed to the specialist and is never merged into Orchestrator's own sets.
- Document: embed it alongside the existing workflow state and payload on clarification, approval,
  finalization, and blocked returns; no second response object is required.
- Include metadata on completed, blocked, failed, and interrupted exits whenever a response is
  possible. For a crash/forced interrupt with no report, only the controller may emit a synthetic
  `unavailable` audit record, clearly attributed as controller-observed and never as child testimony.

## Controller validation and developer visibility

Primary Controller supplies a unique invocation ID with each native child handoff and correlates
returned `report-id` with its actual child ID, agent role, work item/mode, and response sequence.
Pass this ID as transport metadata alongside the handoff, without editing an Orchestrator-supplied
`issue-handoff` payload. Reuse it for the lifetime of the same child invocation, not across new children.
Preserve metadata when forwarding results and capture it before closing the child.

Validate version, correlation, completeness, nonempty canonical paths, deduplication, and that every
used path occurs in the corresponding loaded list and has matching evidence. Compare skills against
the manifest allowlist and specialist routing; out-of-scope usage is a boundary violation, not an
invitation to widen the allowlist. Ask a still-live child to correct malformed/missing metadata only;
do not rerun product work. If correction is impossible, label the audit partial/unavailable with the
exact gap. Never fabricate an empty successful audit, block cleanup, or keep a child alive solely
to obtain telemetry. Existing scope-violation and product-acceptance gates still apply.

After each returned child report, emit a compact developer-visible `Scope usage` record in the primary
conversation with child ID, role, invocation/report ID, work item or mode, completeness, exact
`used_scope_skills`, exact `used_scope_rules`, loaded-but-unused paths, and limitations. Show `[]`
explicitly for known-empty sets. On repeated turns show changed entries plus the report ID of the
last full snapshot (or `unchanged`); keep the full latest snapshot available in the conversation and
include the latest per-child audit in the final workflow response. Do not rely on a hidden child panel,
counts alone, or a tool transcript being visible. Label synthetic records clearly.

This conversation record is the default inspection surface; do not add a product-repository log,
workflow database, Jira comment per turn, or external telemetry service. Loaded-but-unused entries
are configuration-review candidates, not authority to remove mandatory rules. Usage reports cannot
prove token savings or expose instructions the child cannot observe.
