# Architecture status

## Implemented

- Zero-setup two-project Codex workspace model.
- Root `AGENTS.md` bootstrap with public-workflow selection + lifecycle-entry resolution.
- Public `$` discovery restricted to `.agents/skills/` workflows only.
- Internal agent knowledge moved to `.agents/capabilities/**` and hidden from user workflow discovery.
- Public frontend workflows: `frontend-delivery` and `frontend-planning`.
- Separate execution intent (`deliver|plan-only`) from lifecycle mode (`planning|resume|pause`).
- Brain evidence-based `discover-project-stack` capability for framework/UI/icon/state/testing detection.
- Orchestrator capability routing from analysis evidence + Subtask trigger + specialist manifest allowlist.
- Specialist handoff carries only routed internal capability identifiers; specialists do not load all capabilities.
- Removed baseline hard-locks that assumed shadcn/Lucide/Tailwind/TanStack simply because control-repo knowledge exists.
- Separate Brain and Orchestrator roles.
- Four isolated specialists: Design, Test Plan, Coding, Testing.
- YAML manifests and transient protocol templates.
- Specialist `.docs/` prohibition.
- Jira as durable work + execution-context truth.
- Functional hierarchy: Feature → Functional Task → Specialist Subtask.
- Resume flow reconstructing only parent chain + direct dependencies + routed capability identifiers + latest durable checkpoint.
- Pause flow reconciling execution evidence, persisting missing Jira result/status corrections, and writing durable `[HANDOFF]` before safe pause.
- Brain `docs-baseline` for cheap resume/replan validation.
- Coding component-decomposition gate and oversized handwritten TSX safety net.
- Git tag/GitHub Release versioning policy.

## Public workflow scope

```text
$frontend-delivery
NEW/REPLAN
-> Brain analysis + stack discovery
-> Orchestrator planning (intent=deliver)
-> Jira graph + capability routing
-> specialist Subtasks
-> reconciliation
-> Brain acceptance

$frontend-planning
NEW/REPLAN
-> Brain analysis + stack discovery
-> Orchestrator planning (intent=plan-only)
-> Jira graph
-> STOP

RESUME
-> workflow-entry resolver
-> Orchestrator resume
-> current specialist + routed capabilities

PAUSE
-> primary controller recognizes stop/pause intent
-> Orchestrator freezes new dispatch
-> reconcile actual execution evidence with Jira
-> persist missing RESULT/status updates
-> persist durable HANDOFF
-> paused
```

Chat history is not workflow persistence. Product repositories do not store `.plans/`, `.progresses/`, `.agent/`, task mirrors, workflow-state files, or local report stores.

## Extension direction

New domains should add a small number of public workflows and any number of hidden internal capabilities, for example:

```text
$backend-delivery
$backend-planning

.agents/capabilities/backend/nestjs/...
.agents/capabilities/backend/mongoose/...
```

Adding an internal capability must not increase user `$` picker noise.

## Explicit non-goals

- CLI/npm runtime for the agent system.
- `workspace:init` or `workspace.yaml`.
- Custom workflow engine/state database outside Jira.
- MCP installation/token management.
- Exposing every internal capability as a user command.
- Hard-coding a project UI/state/data library without source/architecture evidence.
