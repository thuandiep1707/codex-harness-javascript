---
name: plan-frontend-testing
description: Convert one bounded transient frontend issue handoff into a risk-based test-plan artifact without reading project documents or implementation source. Use only for the Test-plan specialist when Orchestrator supplies complete behavior, acceptance criteria, scope, constraints, and expected evidence; do not use to write, execute, debug, or review test code.
---

# Plan Frontend Testing

1. Read only the assigned transient `issue-handoff` object.
2. Confirm objective, observable behavior, acceptance criteria, scope, and constraints are sufficient.
   Return `context-insufficient` instead of reading `.docs/`, source, or chat history.
3. Map every acceptance criterion to every test layer actually required to prove it:
   - unit for pure logic;
   - component for rendered behavior/local interaction that does not require a real browser;
   - integration for collaborating modules/adapters without real-browser proof;
   - browser when proving the behavior requires rendered real-browser observation or interaction;
   - no test layer only when the criterion is explicitly covered by non-test evidence supplied in the handoff.
   Never leave an assigned acceptance criterion without an evidence path.
4. Set exactly one `testing-route`: `none`, `logic`, `ui`, or `both`. Derive it from the complete acceptance coverage; this decision is authoritative for testing specialist routing.
5. Preserve the supplied `context-version`. On a material scope/contract revision, revalidate only affected acceptance criteria; unchanged coverage remains valid.
6. Define positive, negative, boundary, loading, empty, error, permission, and recovery scenarios only
   when supported by the handoff.
7. Define test data, fixtures, deterministic mock boundaries, environment needs, execution order,
   expected evidence, limitations, and residual risk.
8. Avoid duplicate assertions across layers unless they prove distinct risks.
9. Return objects matching `.protocols/test-plan-artifact.yaml` and `.protocols/agent-report.yaml`.

Do not inspect source, choose implementation file placement, configure a runner, write tests, execute
commands, update Jira, or create/mutate a second workflow-state store.
