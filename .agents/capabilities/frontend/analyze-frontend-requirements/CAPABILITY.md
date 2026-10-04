---
name: analyze-frontend-requirements
description: Analyze relevant human-owned frontend documents and verified source evidence into a resumable YAML requirement and acceptance contract. Use only for Brain analysis, targeted revalidation after relevant document changes, or final Brain acceptance.
---

# Analyze Frontend Requirements

## Analysis

1. Inspect the user request first for any explicitly referenced document, document path, folder, or
   documentation scope relevant to the requested work. User-provided documentation references may
   appear in any natural-language form and must not depend on a fixed keyword or prompt syntax.
2. When a usable user-referenced documentation scope exists, use it as the primary document scope for
   the requested work. Do not rediscover or replace that scope merely by scanning the broader
   documentation tree. Additional documents may still be discovered when materially required as
   supporting analytic/context evidence.
3. When the user provides no usable documentation reference, inventory `.docs/` cheaply by
   filename/headings and select only documents relevant to the user objective.
4. Record the selected document set and a verified repository baseline that can later prove whether
   those documents changed.
5. Read the relevant documents, then inspect only source evidence needed to confirm current
   architecture and behavior.
6. Separate documented requirement/constraint, observed source behavior, evidence-backed inference,
   ambiguity, contradiction, and missing decision.
7. Define included/excluded scope without inventing product behavior.
8. Express every acceptance criterion as observable evidence.
9. Identify required external capabilities and blocking open questions.
10. Return YAML matching `.protocols/analysis-package.yaml`.

### Document intake

Interpret documentation references semantically from the user request rather than matching a fixed
field name or keyword.

Examples of equivalent user intent include, but are not limited to:

- `docs: .docs/rescue-page-redesign`
- `Tài liệu: .docs/rescue`
- `Tham khảo: .docs/rescue`
- `dùng tài liệu trong .docs/rescue`
- `xem spec ở .docs/rescue/spec.md`

A user-referenced documentation scope is the primary document scope for the requested work. After
reading it, classify the material by evidence and authority rather than by the wording the user used
to reference it. Do not assume that every referenced file is a requirement/specification merely
because the user supplied its path.

Broaden document discovery beyond the referenced scope only when materially required to obtain
supporting analytic/context evidence or resolve a relevant authority/contract ambiguity. Do not
replace the user-referenced scope with a separately rediscovered document set.

### Source scope

Treat a user-supplied module or source scope as the starting anchor, not a hard directory boundary.

Follow source dependencies outside that anchor only when they are materially required to explain the
requested behavior, architecture, state flow, or integration. Do not stop merely because a relevant
dependency crosses the initial module boundary.

Stop expanding when the requested scope is sufficiently explained by current project evidence, or
when a required dependency cannot be resolved from accessible project evidence. Do not broaden source
inspection for unrelated implementation details.

### Preserve material relationships

When one behavior is supported by evidence from multiple categories, preserve the material
relationship between those facts.

Do not reduce a connected behavior chain into unrelated statements merely to fit separate protocol
sections. Where relevant, retain the direction of the relationship, such as `invokes`, `reads from`,
`writes to`, `depends on`, `transforms`, `receives from`, `renders from`, or `is constrained by`.

Preserve only relationships needed for downstream reasoning about requirements, behavior,
architecture, state/data flow, integration contracts, or acceptance. Do not reproduce every
intermediate helper or dependency when it does not materially affect those decisions.

Keep these relationships inside the existing `analysis-package` fields. Do not create a separate
analysis graph, secondary protocol, or alternate output format.

Do not create tasks, choose specialists, update Jira, or implement code.

## Revalidation

Use only after cheap repository metadata shows that at least one relevant document changed after the
stored `docs-baseline`.

1. Read the changed relevant documents first.
2. Re-check only requirements, architecture decisions, acceptance criteria, and source evidence that
   depend on those changes.
3. Preserve unaffected approved analysis instead of rebuilding the package from scratch.
4. Return the revised analysis package plus a new baseline.

## Acceptance

1. Read only authoritative relevant `.docs/` needed to verify the final feature scope.
2. Compare each requirement and acceptance criterion with approved Jira context, specialist results,
   source changes, and executed validation.
3. Verify architecture/design constraints separately from test success.
4. Run existing validation when required and safe.
5. Return YAML matching `.protocols/acceptance-report.yaml`.

Use `accepted` only when all blocking requirements are satisfied. Use `revision-required` for
correctable gaps and `blocked` when required evidence or capability is unavailable.
