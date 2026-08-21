# Architecture status

## Implemented

- Zero-setup two-project Codex workspace model.
- Root `AGENTS.md` bootstrap.
- Thin primary controller.
- Separate Brain and Orchestrator roles.
- Four isolated specialists: Design, Test Plan, Coding, Testing.
- YAML manifests and runtime protocol templates.
- Specialist `.docs/` prohibition.
- Jira and design-provider missing-capability contract.
- Jira-only durable workflow state; no product-local plan/progress/task-state folders.
- Mandatory Jira `Task -> Subtask` execution hierarchy.
- Vietnamese Jira content policy for agent-created work.
- Mandatory TSX/component decomposition guardrails for Coding.
- Git tag/GitHub Release versioning policy.

## Current workflow scope

The implemented workflow targets new frontend systems and new features:

```text
Brain analysis
-> Orchestrator
-> Jira Task/Subtasks
-> Design + Test Plan
-> bounded Coding + Testing Subtasks
-> Orchestrator reconciliation
-> Brain acceptance
```

Refactoring and maintenance workflows remain future phases. Do not invent them inside a feature task.

## Explicit non-goals

- CLI or npm runtime for the agent system.
- `workspace:init` or `workspace.yaml`.
- Custom path resolver or workflow engine.
- Product-local `.agent/`, `.plan/`, `.progresses/`, or workflow-state mirrors.
- MCP installation/token management.
- Per-agent text versioning.
