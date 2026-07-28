# Subagent Handoff Contracts

## Common task packet

```text
Task ID:
Target agent:
Category:
Goal:
Selected skills and rules:
Authoritative inputs:
Exact scope and allowed writes:
Dependencies and starting state:
Acceptance criteria:
Required validation:
Required return evidence:
Explicit exclusions:
```

Workers must stop and return a blocker when the packet lacks authority, conflicts with repository
evidence, or requires material scope expansion.

## Frontend coding packet

Target `frontend_coder`. Include approved architecture/design inputs, exact production files or
bounded directories, public contracts, allowed dependency changes, and commands to validate.
Exclude test-code ownership unless the packet explicitly grants a small shared fixture change.

The return must list changed files, behavior implemented, commands and results, deviations, and the
stable contract the test agent can consume.

## Design packet

Target `design_connector`. Include the design problem, product and repository context, provider
preference when known, design-system constraints, required screens/states, and artifact format.
Grant no production-source writes.

The return must include provider identity, stable artifact identifiers or links, inspected
screenshots/previews, design decisions, unresolved questions, and approval state.

## Testing packet

Target `test_engineer`. Include behavior contracts, risk, recommended layer, production handoff,
approved runner/configuration scope, and test data constraints.

The agent may draft the test plan before production code is complete. It may write test code only
after the behavior contract and required approval are stable. The return must list scenarios,
fixtures/mocks, changed files, commands, results, artifacts, coverage limits, and residual risk.
