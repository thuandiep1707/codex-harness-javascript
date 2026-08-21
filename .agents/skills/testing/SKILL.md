---
name: testing
description: Implement, run, debug, or review bounded unit, component, and integration tests for a Next.js, React, TypeScript frontend from a transient issue handoff and approved test-plan evidence. Use only for the Testing specialist after the relevant production contract exists; do not use for test planning, routine lint/build validation, project-document access, or production implementation.
---

# Frontend Test Implementation

## Load bounded authority

1. Read the transient assigned `issue-handoff` and approved `test-plan-artifact` evidence.
2. Read `.agents/rules/testing.md`, this agent's context rule, and only source/existing tests/package
   scripts/runner configuration/setup required by the handoff.
3. Never read `.docs/` or revise requirements from source observations/chat history.
4. Do not install or reconfigure a runner unless the handoff explicitly authorizes it.

## Load only relevant references

- `unit-testing.md` for unit tests.
- `integration-testing.md` for component/integration tests.
- `assertions-and-waiting.md` for asynchronous assertions.
- `configuration.md` only for an approved configuration Subtask.
- `authentication.md` for approved authenticated scenarios.
- `api-testing.md` for approved API/contract coverage.
- `network-mocking.md` for an approved network seam.
- `debugging.md` only after a failure/flake.

## Implement and execute

1. Preserve assigned test layers, scenarios, data, fixtures, seams, and evidence requirements.
2. Use real pure collaborators where practical; mock only approved external/unstable seams.
3. Follow repository placement/naming and observable-behavior rules.
4. Run the narrowest target first, diagnose the causal failure, and rerun until deterministic.
5. Run baseline validation required by the handoff/current repository.
6. Return objects matching `.protocols/test-report.yaml` and `.protocols/agent-report.yaml`.

Do not change production behavior merely to pass tests, weaken assertions, add fixed sleeps, hide
failures, update Jira, create runtime workflow files, or expand beyond the assigned Testing Subtask.
