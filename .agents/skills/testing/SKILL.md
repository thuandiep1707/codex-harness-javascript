---
name: testing
description: Create test plans and design, write, run, debug, or review unit, component, integration, contract, API, and Playwright E2E tests for a Next.js, React, TypeScript, and DDD frontend. Use when a testing task packet explicitly scopes test planning, test code, test configuration, execution, or review; routine lint, typecheck, build, or browser validation does not trigger this skill by itself.
---

# Frontend Testing

## Goal

Select the narrowest reliable test seam, preserve DDD ownership, and return deterministic evidence
without turning generic examples into a second project test convention.

## Load authority and current configuration

1. Read `AGENTS.md`, the testing task packet, its production behavior contract, and any required
   approval state.
2. Read `.agents/rules/testing.md`; it owns applicability, placement, naming, fixtures, mocks,
   documentation, and completion requirements.
3. Read `.agents/rules/frontend-coding.md` and only topic rules triggered by the production behavior
   under test.
4. Inspect `package.json`, installed versions, live Vitest/Playwright configuration, test setup files,
   nearby tests, source contracts, and direct consumers before choosing commands or creating files.

Do not install or reconfigure a runner from a reference snippet. Any missing dependency or test
configuration change requires an approved plan update.

## Select the test layer

Choose the lowest layer that proves the requested behavior:

- **Unit:** pure domain/application logic, mappers, value transformations, and isolated utilities.
- **Component:** rendered component behavior, accessibility semantics, callbacks, local state, and
  controlled visual states.
- **Integration/contract:** module seams, provider behavior, HTTP adapters, request/response mapping,
  and multiple collaborating components.
- **E2E:** critical browser journeys, routing, real rendering, and integration behavior that lower
  layers cannot prove economically.

Do not duplicate the same assertion across layers without a distinct risk. Do not use E2E to prove
pure logic or broad mocks to simulate the implementation under test.

## Load only the relevant reference

- Read [unit-testing.md](references/unit-testing.md) for unit tests.
- Read [integration-testing.md](references/integration-testing.md) for component or integration tests.
- Read [nextjs.md](references/nextjs.md) for Next.js route/App Router E2E behavior.
- Read [react.md](references/react.md) for React-specific E2E or component-runtime behavior.
- Read [locators.md](references/locators.md) for selector design.
- Read [assertions-and-waiting.md](references/assertions-and-waiting.md) for asynchronous assertions.
- Read [configuration.md](references/configuration.md) only for an approved configuration task.
- Read [authentication.md](references/authentication.md) for approved authenticated journeys.
- Read [api-testing.md](references/api-testing.md) for API/contract coverage.
- Read [network-mocking.md](references/network-mocking.md) for an approved external network seam.
- Read [debugging.md](references/debugging.md) only after a test fails or flakes.

Reference installation/setup examples are generic background, not authority to change this
repository. Prefer live project configuration and installed-version documentation when they differ.

## Workflow

### 1. Define the behavior contract

Record the behavior, owner, test layer, observable inputs/outputs, permitted seams, fixtures, expected
states, and why a lower layer is insufficient. For refactors or migrations, distinguish preserved
behavior, known bugs, and explicitly approved changes.

### 2. Design deterministic isolation

Use real pure collaborators where practical. Mock only external or unstable seams. Control network,
time, randomness, storage, browser state, and authentication. Never put real credentials, tokens, or
personal data in fixtures, traces, screenshots, or reports.

### 3. Implement within project placement rules

Follow `.agents/rules/testing.md` for file placement and naming. Use accessible queries and
user-observable assertions for rendered UI. Avoid private implementation assertions, fixed sleeps,
shared mutable state, and assertions that reproduce the algorithm being tested.

### 4. Run the narrowest command, then required baseline

Run the targeted test first. Diagnose the first causal failure and rerun until deterministic. Then run
the repository validation required by the approved change. Do not update snapshots, increase retries,
weaken assertions, or expand timeouts merely to hide a failure.

### 5. Record evidence and documentation

Report commands, versions when material, passed/failed/skipped scenarios, artifacts, coverage limits,
and remaining risk. Update feature documentation and the owning analysis behavior matrix exactly as
required by `AGENTS.md` and `.agents/rules/testing.md`.

## Guardrails

- Test only systems and accounts the developer is authorized to use.
- Do not let a passing mocked test prove an untested browser, server, or authorization boundary.
- Do not create a new test layer before the Decision Gate approves it.
- Do not mark completion without running the created test through the configured runner.
- Do not claim full coverage from one layer, one environment, or one successful run.
