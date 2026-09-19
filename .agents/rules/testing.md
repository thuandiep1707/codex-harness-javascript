# Frontend Testing Rules

Apply this rule only to a Testing Logic or Testing UI execution unit that creates, changes, runs, or reviews frontend
tests. The Jira execution unit and transient handoff already decide that testing work is in scope; do not
create a local test plan, ask a separate yes/no testing decision gate, or update `.analysis/`/`.docs/`.

Load only the routed internal testing capability allowed by the current testing specialist manifest for concrete runner
and test-workflow guidance.

## Authority and boundary

Use this order:

1. assigned testing execution unit + transient handoff;
2. approved test-plan evidence supplied by Main when required;
3. relevant production contract/source and current test-runner configuration;
4. this rule + routed testing capability.

Never read `.docs/`, infer missing product behavior from chat history, modify Jira, or expand parent
functional-slice scope. Return a blocker when expected behavior/test authority is insufficient.

## Role ownership

- Testing Logic owns non-browser unit/component/integration tests and their harness only. It never writes or runs Playwright/E2E/browser tests.
- Testing UI owns Playwright/E2E/browser tests and browser harness only when write scope is explicitly assigned. It never writes or runs Vitest/RTL logic tests.
- Neither testing role writes production behavior. A production defect is returned to Main for Coding routing.
- Coding does not own real-browser acceptance. Browser proof required by Test-plan is executed by Testing UI.

Do not broaden a handoff to cross these ownership boundaries merely because a failing assertion is nearby.

## Specialist iteration

Within one assigned testing Subtask, keep routine test iteration inside the same specialist lifecycle:

1. run the narrowest relevant test;
2. diagnose the failure against the current handoff/Test-plan contract;
3. when the mismatch is proven test-only and inside allowed write scope, correct only that test/harness issue;
4. rerun and repeat while role, contract, and scope remain unchanged;
5. return to Main only when complete or when a production defect, authority ambiguity, scope expansion, dependency, or cross-role validation boundary is reached.

Do not create a new specialist cycle for each ordinary triage/fix/rerun step.

## Failure attribution

A failing broad suite does not automatically become current feature scope.

- `current-change`: baseline evidence shows the scenario was green before the relevant current change and now fails, or the approved contract change directly makes the old test stale.
- `pre-existing`: baseline evidence shows the same failure existed before the current change.
- `unknown`: no reliable baseline proves attribution.

Pre-existing or unknown failures must not be silently adopted as feature remediation. They block only when the current Test-plan, acceptance contract, or repository-required gate explicitly requires that validation to be green. A test-only correction still requires clear current-contract evidence; attribution uncertainty is not permission to weaken tests.

## Test placement

### Unit and component

Colocate with implementation under `src/`:

```text
<name>.test.ts
<name>.test.tsx
```

### Module/integration

Use the established repository pattern, typically:

```text
src/modules/<context>/__tests__/integration/<scenario>.test.ts
tests/integration/<flow>.test.ts
```

### E2E/browser

Testing UI only: use the established top-level E2E location when its assigned execution unit explicitly requires browser journey coverage, for example `e2e/` or `tests/e2e/`. Testing Logic must treat these paths as outside its write/run ownership.

### Fixtures/mocks

Keep module-owned fixtures/mocks with the module test boundary. Use shared test folders only for truly
cross-cutting test data/infrastructure.

Do not introduce a new test folder convention merely because an example above exists; preserve live
repository evidence.

## Test design

- Test observable contract/behavior, not private implementation details.
- Prefer real pure collaborators and small fakes over broad mocks.
- Do not mock private functions or copy the implementation algorithm into assertions.
- Keep tests deterministic by controlling time, randomness, network, storage, and external seams when
  the assigned test layer requires it.
- Choose the narrowest useful test layer from approved test-plan evidence; do not add unrelated
  coverage to appear thorough.
- Never weaken an assertion, production behavior, lint/type rules, or runner configuration merely to
  make tests pass.

## Execution

Run the narrowest behavioral test command required by the approved Test-plan/handoff. Generic lint, format, typecheck, build, commit-hook, or CI gates remain owned by the working project's repository contract.

- Run a generic validation command only when the handoff or established repository contract explicitly requires it for this testing stage.
- Do not duplicate project hooks/CI merely because the current environment did not execute them.
- If required project hooks are expected but unavailable/not installed, report the environment/setup gap instead of reconstructing their command set as harness policy.

If execution starts a long-lived process such as `npm run dev`, `npm run preview`, a framework server,
watcher, browser server, or background service, apply `.agents/rules/runtime-resource-lifecycle.md`:

- register ownership immediately when the process starts;
- track actual PID/process identity and actual bound ports when available;
- clean the owned process tree on every exit path;
- verify known owned ports are released;
- never terminate an unrelated process based only on port occupancy.

Record:

- commands run;
- pass/fail results;
- relevant failure cause, attribution (`current-change|pre-existing|unknown`), and correction;
- skipped required validation and reason;
- runtime resources acquired/released/unresolved;
- residual risk or blocker.

If a test exposes a production defect, report it to Main. Do not silently alter production
behavior unless the current specialist assignment explicitly authorizes production changes (normally
it does not).

## Completion

Return one `test-report` and one `agent-report` object directly to Main. Do not persist runtime reports
into the product repository and do not update Jira directly. `completed` requires the assigned test
scope, required validation evidence, and cleanup of owned runtime resources to be satisfied
deterministically.
