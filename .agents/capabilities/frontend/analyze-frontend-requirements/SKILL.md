---
name: analyze-frontend-requirements
description: Analyze relevant human-owned frontend documents and verified source evidence into a resumable YAML requirement and acceptance contract. Use only for Brain analysis, targeted revalidation after relevant document changes, or final Brain acceptance.
---

# Analyze Frontend Requirements

## Analysis

1. Inventory `.docs/` cheaply by filename/headings and select only documents relevant to the user
   objective.
2. Record the selected document set and a verified repository baseline that can later prove whether
   those documents changed.
3. Read the relevant documents, then inspect only source evidence needed to confirm current
   architecture and behavior.
4. Separate documented requirement/constraint, observed source behavior, evidence-backed inference,
   ambiguity, contradiction, and missing decision.
5. Define included/excluded scope without inventing product behavior.
6. Express every acceptance criterion as observable evidence.
7. Identify required external capabilities and blocking open questions.
8. Return YAML matching `.protocols/analysis-package.yaml`.

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
