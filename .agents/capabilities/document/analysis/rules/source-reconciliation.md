# Source Reconciliation

Build one working truth before document authoring.

## Truth roles

- Source code = current implementation truth.
- Existing docs = existing intent and historical context.
- Developer prompt = newest requested change or intent.

## Conflict handling

- For current behavior, source code wins.
- For requested change, the developer prompt wins.
- Existing rationale/context is retained when it is not overridden by the prompt and is not contradicted by current evidence.
- Conflicts that cannot be resolved safely are recorded as uncertainties; do not guess.

## Hard rule

Do not author separate document sections directly from isolated sources before reconciliation is complete. Reconcile first, build one unified working context, then author from that context.
