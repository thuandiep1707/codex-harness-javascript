# Architecture status

## Implemented

- Zero-setup two-project Codex workspace model.
- Root `AGENTS.md` bootstrap with workflow-entry resolution.
- Separate Brain and Orchestrator roles.
- Four isolated specialists: Design, Test Plan, Coding, Testing.
- YAML manifests and transient protocol templates.
- Specialist `.docs/` prohibition.
- Jira as durable work + execution-context truth.
- Functional hierarchy: Feature → Functional Task → Specialist Subtask.
- Resume flow that reconstructs only parent chain + direct dependencies + latest durable checkpoint.
- Brain `docs-baseline` for cheap resume/replan validation.
- Coding component-decomposition gate and oversized handwritten TSX safety net.
- Git tag/GitHub Release versioning policy.

## Current workflow scope

```text
NEW
-> Brain analysis
-> Orchestrator planning
-> specialist Subtasks
-> Brain acceptance

RESUME
-> workflow-entry resolver
-> Orchestrator resume
-> current specialist Subtask

REPLAN
-> Brain targeted revalidation
-> Orchestrator replan affected scope
```

Chat history is not workflow persistence. Product repositories do not store `.plans/`, `.progresses/`,
`.agent/`, task mirrors, workflow-state files, or local report stores.

## Explicit non-goals

- CLI or npm runtime for the agent system.
- `workspace:init` or `workspace.yaml`.
- Custom path resolver or workflow engine.
- A second workflow state database outside Jira.
- MCP installation/token management.
- Per-agent text versioning.
