# Frontend Developer Self-Testing Rules

Apply this rule only to transient Testing Logic or Testing UI self-verification selected by the current Test Plan for one owning Coding work item.

Testing is not a separate Jira work stream. Test Plan, Testing Logic, and Testing UI do not create Jira execution units, do not update Jira, and do not perform final product acceptance.

## Authority and boundary

Use this order:

1. transient `verification-handoff`;
2. current `test-plan-artifact`;
3. bounded production source/current source state and existing tests needed by the selected targets;
4. current test-runner/browser configuration;
5. this rule and any routed testing capability.

Never read `.docs`; Test Plan already resolved the bounded developer self-verification targets from relevant docs + actual source change.

Do not broaden the Test Plan scope, infer additional product requirements, or turn self-verification into exhaustive functional testing.

## Role ownership

- Testing Logic owns only selected unit/component/integration self-tests and their harness.
- Testing UI owns only selected Playwright/real-browser self-tests and browser harness.
- Testing Logic never writes/runs Playwright/E2E/browser tests.
- Testing UI never writes/runs Vitest/RTL logic tests.
- Neither role writes production behavior.
- A production defect returns to Main for the same owning Coding work item.

## No-loop lifecycle

For one `context-version + source-state + role`, Main dispatches at most one Testing child.

Inside that child, keep routine test iteration local:

1. run the narrowest selected verification;
2. diagnose against the Test Plan target and current production behavior;
3. if the mismatch is proven test-only and inside allowed test-write scope, fix only the test/harness;
4. rerun until the selected target passes or a non-test boundary is reached.

Do not return to Main between routine test-only iterations.

Return to Main only when:

- selected verification completes;
- evidence indicates a production defect;
- authority/scope is insufficient;
- required external/runtime capability is unavailable; or
- cleanup cannot be completed.

A test-only mismatch must not trigger a new Test Plan or new Testing child.

A production defect ends the current Testing child. Main may route one bounded revision to the same owning Coding work item. Only after production source or relevant product context actually changes may Main invoke Test Plan again for the affected delta.

## Failure attribution

A failing broad suite does not automatically become current change scope.

Use:

- `current-change`: reliable evidence ties the failure to the current changed behavior/source state;
- `pre-existing`: reliable baseline shows the failure existed before the current change;
- `unknown`: evidence cannot establish attribution.

Pre-existing or unknown failures are reported as limitations/blockers only when the selected verification target or repository-required gate depends on them. Do not silently adopt unrelated remediation.

## Test placement

Preserve the working repository's established conventions.

Typical examples only:

- unit/component: colocated `<name>.test.ts[x]`;
- integration: established module/integration test location;
- browser: established Playwright/E2E location.

Do not invent a new project-wide test layout from this harness.

## Test design

- Verify observable behavior/risk selected by Test Plan, not private implementation details.
- Use the smallest useful layer and deterministic seams.
- Do not duplicate coverage across layers unless Test Plan identifies a distinct risk.
- Never weaken assertions, lint/type rules, runner configuration, or production behavior merely to make tests pass.
- Write only inside `verification.allowed-test-write-paths` supplied by Main from the Test Plan.

## Runtime resources

If test execution starts a long-lived server, watcher, browser process, or background service, apply `.agents/rules/runtime-resource-lifecycle.md`.

Track and clean only resources proven to be owned by the current child. Never terminate a process based only on port occupancy.

## Completion

Return one `test-report` and one `agent-report` directly to Main.

The `coding-execution-key` in the test report identifies the owning durable Coding work item; it does not represent a separate Jira testing unit.
