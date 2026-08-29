# Frontend Testing Rules

Apply this rule only to a Testing specialist Subtask that creates, changes, runs, or reviews frontend
tests. The Jira Subtask and transient handoff already decide that testing work is in scope; do not
create a local test plan, ask a separate yes/no testing decision gate, or update `.analysis/`/`.docs/`.

Load only the routed internal testing capability allowed by the Testing manifest for concrete runner
and test-workflow guidance.

## Authority and boundary

Use this order:

1. assigned Testing Subtask + transient handoff;
2. approved test-plan evidence supplied by Orchestrator when required;
3. relevant production contract/source and current test-runner configuration;
4. this rule + routed testing capability.

Never read `.docs/`, infer missing product behavior from chat history, modify Jira, or expand parent
Task scope. Return a blocker when expected behavior/test authority is insufficient.

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

Use the established top-level E2E location when the assigned Subtask explicitly requires browser
journey coverage, for example `e2e/` or `tests/e2e/`.

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

Run the narrowest targeted command first, then the baseline validation explicitly required by the
handoff/current repository contract.

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
- relevant failure cause and correction;
- skipped required validation and reason;
- runtime resources acquired/released/unresolved;
- residual risk or blocker.

If a test exposes a production defect, report it to Orchestrator. Do not silently alter production
behavior unless the current specialist assignment explicitly authorizes production changes (normally
it does not).

## Completion

Return one `test-report` and one `agent-report` object to Orchestrator. Do not persist runtime reports
into the product repository and do not update Jira directly. `completed` requires the assigned test
scope, required validation evidence, and cleanup of owned runtime resources to be satisfied
deterministically.
