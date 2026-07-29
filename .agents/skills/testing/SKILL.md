---
name: testing
description: Implement, run, debug, or review bounded unit, component, and integration tests for a Next.js, React, TypeScript frontend from an approved YAML issue handoff and test-plan artifact. Use only for the testing specialist after the relevant production contract exists; do not use for test planning, routine lint/build validation, project document access, or production implementation.
---

# Frontend Test Implementation

## Load bounded authority

1. Read the assigned `issue-handoff.yaml` and approved `test-plan-artifact.yaml`.
2. Read `.agents/rules/testing.md`, this agent's context rule, and only the source, existing tests,
   package scripts, runner configuration, and setup files required by the handoff.
3. Never read `.docs/` or revise requirements from source observations.
4. Do not install or reconfigure a runner unless the handoff explicitly authorizes it.

## Load only the relevant reference

- [unit-testing.md](references/unit-testing.md) for unit tests.
- [integration-testing.md](references/integration-testing.md) for component or integration tests.
- [assertions-and-waiting.md](references/assertions-and-waiting.md) for asynchronous assertions.
- [configuration.md](references/configuration.md) only for an approved configuration task.
- [authentication.md](references/authentication.md) for approved authenticated scenarios.
- [api-testing.md](references/api-testing.md) for approved API/contract coverage.
- [network-mocking.md](references/network-mocking.md) for an approved network seam.
- [debugging.md](references/debugging.md) only after a failure or flake.

## Implement and execute

1. Preserve the test plan's test layers, scenarios, data, fixtures, seams, and evidence requirements.
2. Use real pure collaborators where practical and mock only approved external or unstable seams.
3. Follow repository placement, naming, and observable-behavior rules.
4. Run the narrowest target first, diagnose the first causal failure, and rerun until deterministic.
5. Run the baseline validation named in the handoff.
6. Return YAML matching `.protocols/test-report.yaml` and `.protocols/agent-report.yaml`.

Do not change production behavior to make a test pass, weaken assertions, add fixed sleeps, hide
failures, update Jira, mutate workflow state, or expand beyond the plan.
