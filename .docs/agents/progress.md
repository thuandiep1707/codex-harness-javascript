# Architecture status

## Implemented

- Zero-setup two-project Codex workspace model.
- Root `AGENTS.md` bootstrap.
- Thin primary controller.
- Separate Brain and Orchestrator roles.
- Four isolated specialists: Design, Test Plan, Coding, Testing.
- YAML manifests and protocol templates.
- Specialist `.docs/` prohibition.
- Jira and design-provider missing-capability contract.
- Product-local `.agent/` runtime data layout.
- Git tag/GitHub Release versioning policy.

## Current workflow scope

The implemented workflow targets new frontend systems and new features:

```text
Brain analysis
-> Orchestrator
-> Design + Test Plan
-> Coding + Testing
-> Orchestrator reconciliation
-> Brain acceptance
```

Refactoring and maintenance workflows remain future phases. Do not invent them inside a feature task.

## Explicit non-goals

- CLI or npm runtime for the agent system.
- `workspace:init` or `workspace.yaml`.
- Custom path resolver or workflow engine.
- MCP installation/token management.
- Per-agent text versioning.
