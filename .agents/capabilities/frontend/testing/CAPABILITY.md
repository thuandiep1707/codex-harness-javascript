---
name: testing
description: Implement, run, debug, and report bounded non-browser developer self-tests selected by Test Plan for one parent Coding execution unit. Use only for Testing Logic; do not use for test planning, product-document access, production implementation, or Jira work management.
---

# Frontend Logic Self-Testing

Use only after Main supplies:

- a transient `verification-handoff`;
- the current `test-plan-artifact`;
- bounded production source/current source state;
- existing tests and runner configuration relevant to the selected logic targets.

## Scope

Execute only Test Plan targets whose layers are unit, component, or integration.

Load detailed references only when required by the selected target:

- `unit-testing.md`
- `react.md`
- `integration-testing.md`
- `api-testing.md`
- `assertions-and-waiting.md`
- `network-mocking.md`
- `authentication.md`
- `configuration.md`
- `debugging.md`
- `nextjs.md`

Do not load every reference by default.

## Iteration

Keep routine run/diagnose/proven-test-only-fix/rerun work inside the same Testing Logic child.

Fix a test/harness only when current Test Plan evidence and production behavior clearly prove the mismatch is test-only and the change stays inside the allowed test-write scope.

If evidence indicates a production defect, stop test mutation and return that defect to Main for the same parent Coding execution unit.

Do not create Jira work, update Jira, call another specialist, rerun Test Plan yourself, modify production behavior, or expand the verification scope.

## Output

Return `.protocols/test-report.yaml` and `.protocols/agent-report.yaml` with evidence only for the selected verification targets.
