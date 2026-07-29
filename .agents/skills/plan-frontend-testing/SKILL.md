---
name: plan-frontend-testing
description: Convert one bounded frontend issue handoff into a YAML risk-based test-plan artifact without reading project documents or implementation source. Use only for the test-plan specialist when Orchestrator supplies complete behavior, acceptance criteria, scope, constraints, and expected evidence; do not use to write, execute, debug, or review test code.
---

# Plan Frontend Testing

1. Read only the assigned `issue-handoff.yaml`.
2. Confirm that objective, observable behavior, acceptance criteria, scope, and constraints are
   sufficient. Return `context-insufficient` instead of reading `.docs/` or source.
3. Map every acceptance criterion to the lowest test layer that proves it:
   - unit for pure logic;
   - component for rendered behavior and local interaction;
   - integration for collaborating modules, adapters, or UI flows.
4. Define positive, negative, boundary, loading, empty, error, permission, and recovery scenarios
   only when supported by the handoff.
5. Define test data, fixtures, deterministic mock boundaries, environment needs, execution order,
   expected evidence, limitations, and residual risk.
6. Avoid duplicate assertions across layers unless they prove distinct risks.
7. Return YAML matching `.protocols/test-plan-artifact.yaml` and
   `.protocols/agent-report.yaml`.

Do not inspect source, choose file placement, configure a runner, write tests, execute commands,
update Jira, or mutate workflow state.

