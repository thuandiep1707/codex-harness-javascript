---
name: analyze-frontend-requirements
description: Analyze human-owned frontend project documents and verified source evidence into a YAML requirement and acceptance contract. Use only for Brain analysis or final Brain acceptance when Codex must identify scope, constraints, architecture direction, ambiguity, contradiction, risk, and measurable acceptance criteria before Orchestrator creates tasks, or must verify completed work against the original documents.
---

# Analyze Frontend Requirements

## Analysis

1. Inventory the selected working project's `.docs/` by filename and headings.
2. Read the documents relevant to the user objective, then inspect only the source evidence needed
   to confirm current architecture and behavior.
3. Separate:
   - documented requirement;
   - documented constraint or decision;
   - observed source behavior;
   - evidence-backed technical inference;
   - ambiguity, contradiction, or missing decision.
4. Define included and excluded scope without inventing product behavior.
5. Express every acceptance criterion as observable evidence.
6. Identify required external capabilities and blocking open questions.
7. Return YAML matching `.protocols/analysis-package.yaml`.

Do not create tasks, choose specialists, update Jira, or implement code.

## Acceptance

1. Re-read the authoritative `.docs/`.
2. Compare each requirement and acceptance criterion with the analysis package, handoffs, artifacts,
   source changes, and executed validation.
3. Verify architecture and design constraints separately from test results.
4. Run existing validation when required and safe.
5. Return YAML matching `.protocols/acceptance-report.yaml`.

Use `accepted` only when all blocking requirements are satisfied. Use `revision-required` for
correctable gaps and `blocked` when required evidence or capability is unavailable.

