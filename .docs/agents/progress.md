# Architecture status

## Implemented

- Zero-setup two-project Codex workspace model.
- Root `AGENTS.md` bootstrap with public-workflow selection and lifecycle-entry resolution.
- Public `$` discovery restricted to `.agents/skills/` workflows only.
- Internal agent knowledge under `.agents/capabilities/**`, hidden from user workflow discovery.
- Public frontend workflows: `frontend-delivery` and `frontend-planning`.
- Separate execution intent (`deliver|plan-only`) from lifecycle (`new|resume|replan|pause|acceptance`).
- Flow B runtime topology: Main is the Orchestrator.
- Main owns dependency routing, capability routing, specialist dispatch, reconciliation, write-scope leases, child lifecycle, and runtime cleanup supervision.
- Brain owns requirement analysis, authority readiness, project-stack discovery, targeted revalidation, and final acceptance.
- Scrum Master owns Jira schema discovery, semantic work-graph creation/reconciliation, compact Jira state synchronization, and authorized durable Jira mutations.
- Five isolated specialist roles: Design and Coding own durable product execution; Test Plan, Testing Logic, and Testing UI are transient developer self-verification roles.
- Durable product work uses bounded `issue-handoff`; developer self-verification uses bounded `verification-handoff` with relevant docs/source evidence.
- Specialists return structured results directly to Main and do not mutate Jira.
- Removed baseline hard-locks that assumed shadcn/Lucide/Tailwind/TanStack merely because control-repo knowledge exists.
- Jira is durable work + execution-context truth.
- Semantic Jira work model: optional work-container -> functional-slice -> specialist execution-unit, dynamically mapped to each project's available Jira work types, fields, relationships, and workflow states.
- Jira field/work-type/status assumptions are resolved through Scrum Master discovery instead of hard-coded project schema.
- Resume reconstructs only the minimal semantic parent chain, direct dependencies, routed capability identifiers, latest durable checkpoint, and relevant source state.
- Pause stops new dispatch, reconciles transient execution, then persists required durable `[RESULT]` / workflow-state / `[HANDOFF]` state through Scrum Master.
- Explicit child-agent close/verification and runtime-resource/process/port cleanup lifecycle.
- Brain `docs-baseline` for cheap resume/replan validation.
- Coding component-decomposition gate and oversized handwritten TSX safety net.
- Git tag/GitHub Release versioning policy.

## Active runtime topology

```text
Main = Orchestrator
  ├ Brain
  ├ Scrum Master
  ├ Design
  ├ Test Plan
  ├ Coding
  ├ Testing Logic
  └ Testing UI
```

Brain, Scrum Master, and specialists are short-lived native child agents.

Chat history is not workflow persistence. Product repositories do not store `.plans/`, `.progresses/`, `.agent/`, task mirrors, workflow-state files, or local report stores.

## Public workflow scope

```text
$frontend-delivery
NEW/REPLAN
-> Main resolves lifecycle
-> Brain analysis/revalidation
-> close Brain
-> Scrum Master planning/replan
-> close Scrum Master
-> Main routes dependency-ready durable execution units
-> Design/Coding execution + Main reconciliation
-> after Coding change: transient Test Plan from relevant docs + actual source diff
-> transient Testing Logic/UI only when selected
-> production defect returns to the same Coding execution unit
-> Scrum Master progress-sync only when durable Coding result/blocker/revision persistence is required
-> Brain acceptance
-> Scrum Master finalize when accepted
-> terminal report

$frontend-planning
NEW/REPLAN
-> Main resolves lifecycle
-> Brain analysis/revalidation
-> close Brain
-> Scrum Master planning/replan
-> confirmed Jira work graph
-> close Scrum Master
-> STOP

RESUME
-> Main resolves current durable state
-> Scrum Master resume-sync only when fresh Jira state is required
-> targeted Brain revalidation only when validity markers are stale
-> Main continues dependency-ready execution

PAUSE
-> Main stops new dispatch
-> collect/clean transient execution state
-> Scrum Master persists durable result/handoff state
-> close Scrum Master
-> report paused only after Jira persistence + cleanup
```

## Flow B ownership

### Main

- lifecycle and execution-intent resolution;
- dependency-ready action selection;
- specialist routing and dispatch;
- capability routing from Brain evidence + Jira state + execution-unit trigger + specialist manifest;
- write-scope leases and source-diff validation;
- specialist report reconciliation;
- child lifecycle and runtime cleanup supervision;
- compact transient workflow state.

### Brain

- authoritative requirement analysis;
- implementation-environment discovery;
- targeted revalidation;
- final acceptance.

### Scrum Master

- Jira work-type/field/option/workflow discovery;
- semantic work-graph planning/replanning;
- compact resume synchronization;
- authorized durable Jira updates;
- pause handoff persistence;
- accepted-scope finalization.

### Specialists

- bounded role-specific execution;
- no Jira mutation;
- no direct authoritative product-document access except Test Plan's explicitly handoff-listed relevant documents for self-verification planning;
- no scope expansion without returning a blocker to Main.

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
