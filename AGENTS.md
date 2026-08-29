# Codex Multi-Agent Delivery System

This repository is the control project for a zero-setup Codex multi-agent workflow. The product repository is a separate project opened in the same Codex workspace. Keep this repository selected as primary so this file is loaded at the start of every chat.

## System truths

Use exactly these durable sources of truth:

- **Control repository:** workflow entry points, agent behavior, internal capabilities, rules, protocols, and Codex configuration.
- **Working project `.docs/`:** human-owned product truth.
- **Jira:** work state and durable execution context.
- **Working project source:** implementation truth.

Chat history is never workflow truth. Do not create `.plans/`, `.progresses/`, `.agent/`, or another runtime workflow database in the product repository.

## Public workflow registry vs internal capabilities

Keep user-facing workflow discovery intentionally small.

### Public workflows

Only packages under `.agents/skills/` are user-facing `$` entry points discoverable by Codex.

Current frontend workflows:

- `$frontend-delivery`: run frontend work continuously from the smallest valid entry through analysis, Jira orchestration, specialist execution, testing, runtime cleanup, child-agent cleanup, and final acceptance.
- `$frontend-planning`: analyze and create/reconcile the Jira work graph, then stop before specialist execution.

Do not place agent implementation knowledge under `.agents/skills/`.

### Internal capabilities

Reusable agent knowledge lives under `.agents/capabilities/` and is private to the owning agent. Internal capabilities must not be exposed as user-facing `$` commands and must not be loaded globally.

Examples:

```text
.agents/capabilities/common/discover-project-stack/
.agents/capabilities/frontend/plan-frontend-work/
.agents/capabilities/frontend/shadcn/
.agents/capabilities/frontend/nextjs-tanstack-query/
.agents/capabilities/frontend/testing/
```

An agent may load an internal capability only when:

1. the capability path is allowlisted in that agent's `manifest.yaml`; and
2. the current workflow/handoff trigger explicitly requires it.

Do not scan or load all capabilities "for safety".

### Terminology

- **Workflow:** user-facing orchestration entry point under `.agents/skills/`.
- **Agent:** role that owns a bounded responsibility.
- **Internal capability:** reusable agent knowledge under `.agents/capabilities/`.
- **Rule:** mandatory behavior/convention.
- **Protocol:** structured communication contract.

## Repository roles

- **Control project:** this repository. Never use it as the target for product implementation.
- **Working project:** the product repository selected by the user in the same workspace. It owns `.docs/`, source, tests, and product configuration only.

## Frontend workflow intent

Frontend lifecycle state and execution intent are separate concepts.

### Execution intent

- `plan-only`: create/reconcile the Jira work graph and stop before specialist execution.
- `deliver`: continue automatically from a valid Jira work graph into dependency-ready specialist execution until acceptance input is ready, pause is requested, or a real blocker/approval gate is reached.

`$frontend-planning` supplies `plan-only`.
`$frontend-delivery` supplies `deliver`.

Do not interpret Orchestrator `planning` mode as automatically meaning "stop after Jira". When intent is `deliver`, Jira planning completion is not an approval gate and the workflow must continue without asking the user to confirm merely because Tasks/Subtasks were created.

## Resolve the workflow lifecycle entry

For every frontend workflow request, identify the working project and resolve the smallest valid lifecycle entry from Jira:

- `new`: no valid Jira workflow exists -> Brain analysis, then Orchestrator planning.
- `resume`: valid analysis/task tree exists and relevant requirements are unchanged -> Orchestrator resume only.
- `replan`: relevant requirements or approved architecture/dependency direction changed -> Brain targeted revalidation, then Orchestrator replans affected scope only.
- `pause`: active workflow must stop now but remain resumable -> Orchestrator pause reconciliation + durable handoff.
- `acceptance`: required executable Subtasks are complete -> Brain acceptance.

A new chat or developer handoff is normally `resume`, not `new`.

### Pause intent detection

When active Jira-backed work exists, treat explicit natural-language intent to stop, pause, hand off, or continue later as `pause`. The user does not need a special command. Phrases such as `dừng lại`, `tạm dừng`, `dừng công việc`, `để mai làm tiếp`, or `bàn giao ở đây` are examples, not an exhaustive command list.

Do not interpret `pause` as merely stopping generation or changing Jira status. Route it to Orchestrator pause mode so runtime resources, active child agents, and Jira continuation state are reconciled before the workflow is reported safely paused.

If no active Jira-backed workflow exists, obey the user's stop request normally and do not create a fake Jira handoff.

## Project-stack discovery and capability routing

Brain may detect the existing implementation environment through `.agents/capabilities/common/discover-project-stack/CAPABILITY.md` using cheap evidence first:

1. dependency manifest and lockfile;
2. framework/library configuration;
3. representative imports only when needed;
4. deeper source inspection only to resolve a material ambiguity.

Detection is not technology selection. Do not turn missing evidence into a default such as shadcn, Lucide, MUI, HeroUI, Zustand, TanStack Query, or another dependency.

Brain records evidence-backed implementation-environment facts in `analysis-package.yaml`. Orchestrator combines that profile with the current Subtask trigger and specialist manifest to select the smallest internal-capability set for execution.

Examples:

```text
Project evidence: @mui/material + @mui/icons-material
→ route MUI-family capability when available
→ do not route shadcn/Lucide merely because the control repo contains them

Project evidence: components.json + shadcn/Radix usage + lucide-react
→ route shadcn/Lucide-compatible capabilities for the relevant Subtask

No clear UI library evidence
→ unresolved
→ do not invent a default UI library
```

A detected installed dependency is evidence of current usage/availability, not permission to install, upgrade, replace, or standardize it.

## Primary controller boundary

The primary chat is a thin workflow controller. It may:

- resolve the requested public workflow;
- identify the working project;
- resolve lifecycle entry and execution intent;
- spawn configured agents through Codex native subagent/multi-agent delegation;
- pass structured protocol objects;
- supervise direct child-agent lifecycle;
- report workflow status.

It must not perform Brain/Orchestrator/specialist work itself, load internal capability packages directly for implementation, or persist workflow state into the product repository.

### Agent delegation transport

Internal agent execution must use Codex native subagent/multi-agent delegation.

- Brain, Orchestrator, and Specialists are private child-agent executions, not independent user-visible conversations.
- Never create, fork, or open a user-visible chat/thread as a substitute for internal agent delegation.
- Never use `create_thread`, `fork_thread`, new-chat actions, or equivalent conversation APIs as a fallback for native subagent execution.
- If a native subagent spawn attempt fails or is temporarily unavailable, retry the same native delegation up to **5 total attempts** before blocking. Each retry must target the same intended agent role and bounded handoff; do not broaden scope or switch transport.
- A failed spawn attempt is a runtime transport failure, not authorization to execute the delegated role in the primary chat, mutate unrelated workflow state, or create a visible conversation.
- Only after all 5 native delegation attempts fail may the affected stage return `runtime-capability-blocked`.
- A Codex runtime/UI regression may expose a legitimate native child thread in Recent. That does not change the harness contract: the harness must never intentionally create a separate user-visible conversation for internal agent execution.

### Conversation isolation

Conversation isolation is separate from context isolation:

```text
Primary/user chat
= the only intentional user-visible workflow conversation

Brain / Orchestrator / Specialists
= internal native child-agent execution only
```

Context isolation controls what an agent may read. Conversation isolation controls where that agent may execute. Never bypass either boundary through chat history, visible conversation creation, or thread forking.

### Child-agent lifecycle

Every parent agent owns every child agent it successfully spawns until explicit close has been requested and closure is verified.

A completed `wait_agent`, returned report, disconnected subchat, hidden panel, or completed Jira Subtask does not mean the child has been disposed.

Parent lifecycle contract:

1. register each successfully spawned child-agent identifier in a transient runtime ledger;
2. capture the child result and any runtime-resource cleanup evidence;
3. if the child still has an active turn when it must stop, interrupt that turn when the runtime supports it;
4. explicitly close the child agent;
5. verify that the child is no longer active before releasing its slot or completing the parent stage;
6. apply the same cleanup on completed, blocked, failed, timeout, interrupted, pause, cancel, and revision paths.

Primary Controller owns Brain and Orchestrator child cleanup. Orchestrator owns Design, Test Plan, Coding, and Testing child cleanup.

If an owned child cannot be closed or closure cannot be verified, return `runtime-cleanup-blocked`. Never silently detach and rely on the desktop application to eventually dispose it.

### Runtime resource lifecycle

Long-lived runtime resources created inside a child execution are transient execution resources, not product state.

Apply `.agents/rules/runtime-resource-lifecycle.md` whenever an agent starts a dev/preview server, watcher, browser process, background service, or other process that may outlive the immediate command.

- Register ownership immediately using `.protocols/runtime-resource-event.yaml`; do not wait for the final report.
- Track command, cwd, PID/process-group identity, known descendants, actual bound ports, and ownership evidence when available.
- Actual auto-selected ports must be tracked; do not assume the requested port was used.
- The creating specialist is responsible for first-pass cleanup on every exit path.
- Orchestrator is fallback cleanup supervisor when a specialist crashes, times out, is interrupted, or becomes unavailable.
- Never terminate a process merely because it owns a port. Port occupancy alone is not ownership evidence.
- Runtime cleanup must verify the owned process tree is stopped and known owned ports are released before the child is considered ready to close.
- If cleanup cannot be completed safely or verified, return `runtime-cleanup-blocked` and record unresolved resources.

The runtime resource ledger is transient. Do not persist it as a product-repository workflow database or use Jira as a live process registry.

### `$frontend-delivery`

For `new`:

1. Spawn Brain with user objective, working-project identity, relevant `.docs`, and bounded source/config evidence.
2. Brain returns `analysis-package`, including `implementation-environment` evidence when relevant.
3. Close and verify the Brain analysis child after its result is captured.
4. Spawn Orchestrator with lifecycle `planning` and execution intent `deliver`.
5. Orchestrator creates/reconciles Jira Feature context, functional Tasks, required specialist Subtasks, dependencies, and routed internal-capability identifiers.
6. Do not stop for plan confirmation. Continue into dependency-ready specialist Subtasks.
7. Orchestrator reconciles each specialist result, cleans owned runtime resources, closes/verifies each specialist child, and only then unblocks downstream work.
8. When all required executable Subtasks are complete and Orchestrator has no unresolved runtime/child cleanup, capture its reconciliation result and close/verify the Orchestrator child.
9. Spawn Brain for final acceptance, then close/verify the Brain acceptance child before reporting `accepted`.

For `resume`, skip Brain analysis and Orchestrator decomposition when Jira validity markers and relevant `.docs` baseline remain valid.

For `replan`, revalidate only changed relevant requirements/evidence and replan only affected scope. Close/verify every Brain/Orchestrator child used for the replan stage after its result is captured.

Interrupt continuous delivery only for real authority/capability gates such as material ambiguity, unapproved dependency/architecture adoption, destructive or sensitive external action, unresolved human design choice, missing required provider, material scope expansion, or unresolved runtime cleanup.

### `$frontend-planning`

Run Brain analysis/revalidation as required, close/verify the Brain child after its result is captured, then spawn Orchestrator with execution intent `plan-only`. Stop after the Jira task graph is valid, capture the Orchestrator result, and close/verify the Orchestrator child. Do not dispatch Design, Test Plan, Coding, or Testing specialists.

### Resume work

Reconstruct only:

1. current specialist Subtask;
2. parent functional Task;
3. Feature context;
4. direct completed dependencies and latest durable results/checkpoint;
5. routed internal-capability identifiers for the Subtask;
6. relevant current source/provider state.

Do not read the entire Jira project, sprint, comment history, or unrelated task tree merely to continue one Subtask.

### Pause work

For explicit pause while Jira-backed work is active:

1. Stop new specialist dispatch immediately.
2. Resolve active/incomplete Jira scope, available specialist evidence, active child-agent identifiers, runtime-resource ledger, and relevant current source identity.
3. Spawn Orchestrator in `pause` mode if a usable Orchestrator child is not already active. Do not spawn Brain.
4. Reconcile proven execution results/status against Jira.
5. Clean specialist-owned runtime resources and close/verify active specialist children.
6. Persist proven missing `[RESULT]` evidence/status corrections first.
7. Persist one concise `[HANDOFF]` checkpoint for the unfinished continuation point using `.protocols/pause-checkpoint.yaml`.
8. Capture the Orchestrator pause result, close/verify the Orchestrator child, then report safe pause.

If Jira persistence fails, stop new execution but return `pause-blocked`. If known runtime resources or child agents cannot be cleaned/closed and verified, return `runtime-cleanup-blocked`; never claim a safe pause while known execution resources remain active.

## Jira validity markers

Feature context must make these facts recoverable:

```text
analysis: ready
task-tree: ready
context-version: <version>
docs-baseline: <verified baseline>
relevant-documents: <recoverable set/reference>
```

Before `resume`, compare relevant `.docs` changes against `docs-baseline` using cheap repository metadata first. If relevant requirements did not change, do not rerun Brain. Material change -> `replan`.

## Jira work model

Use:

```text
Feature context
  -> Task: one functional slice
      -> Subtask: one specialist execution unit
```

Parent Task is an acceptance/scope boundary, not an executable specialist assignment. Specialists execute Subtasks only. Create only specialist Subtasks actually required by the functional slice.

All human-facing Jira titles, descriptions, acceptance criteria, dependency explanations, blockers, results, and handoff notes must be Vietnamese. Technical identifiers/paths/APIs/component names/Jira keys/commands/machine metadata remain exact when needed.

Use context inheritance:

- Feature stores common product/architecture context and implementation-environment metadata needed for routing.
- Task stores functional-slice delta.
- Subtask stores specialist execution delta plus the minimal routed internal-capability identifiers required for deterministic execution/resume.
- Orchestrator composes Feature + Task + Subtask + direct dependency evidence into transient `issue-handoff`.

Do not duplicate full parent context at lower levels.

## Durable Jira checkpoints

Jira replaces repository progress files. Do not append routine reasoning or step-by-step activity.

Use concise durable notes:

- `[BLOCKER]`: information/capability prevents assigned work.
- `[RESULT]`: completed output + validation evidence.
- `[REVISION]`: correction required after review/reconciliation.
- `[HANDOFF]`: checkpoint for another session/developer to continue unfinished work.

A handoff records only continuation essentials: source repository/branch/commit when relevant, completed scope, remaining scope, validation state, blockers, and next work item/action.

On explicit pause, `[HANDOFF]` is mandatory whenever unfinished scope remains. Jira status change alone is not a valid pause checkpoint.

## Agent definitions

| Agent | Module | Responsibility |
| --- | --- | --- |
| `brain` | `.agents/brain/` | Requirements, architecture reasoning, stack detection, ambiguity, revalidation, final acceptance |
| `orchestrator` | `.agents/orchestrator/` | Jira hierarchy, execution intent, capability routing, resume, pause/handoff, specialist coordination, reconciliation, child/resource cleanup supervision |
| `design` | `.agents/specialists/design/` | External design-provider execution |
| `test-plan` | `.agents/specialists/test-plan/` | Risk-based test-plan result |
| `coding` | `.agents/specialists/coding/` | Bounded production implementation using routed internal capabilities |
| `testing` | `.agents/specialists/testing/` | Bounded test implementation/execution using routed internal capabilities |

Each module's `manifest.yaml` is authoritative for inputs, outputs, context allowlist, rules, external/runtime capabilities, and **internal-capability allowlist**. `AGENT.md` is the role bootstrap.

Specialists may load only internal capability paths both allowlisted by their manifest and explicitly routed in the current handoff.

## Context isolation

Brain may read relevant `.docs` for analysis/revalidation/acceptance and bounded source/config evidence for implementation-environment discovery.

Orchestrator may read relevant `.docs` during planning/replanning and minimal Jira/source context during resume/pause.

Specialists must never read `.docs`. They receive only bounded transient handoff + allowed dependency evidence + necessary source/provider state + explicitly routed internal capability paths.

If context/routing is insufficient, return a blocker. Never bypass isolation using chat history or broad source archaeology.

## Structured protocols

Use templates under `.protocols/`:

- `analysis-package.yaml`
- `issue-handoff.yaml`
- `pause-checkpoint.yaml`
- `agent-report.yaml`
- `runtime-resource-event.yaml`
- `design-artifact.yaml`
- `test-plan-artifact.yaml`
- `implementation-report.yaml`
- `test-report.yaml`
- `reconciliation-report.yaml`
- `acceptance-report.yaml`

These are transient communication contracts, not product-repository runtime files. Persist only compact durable Jira context/evidence needed for resume and human control.

## Missing external capabilities

MCP servers, plugins, tokens, and authentication are user-managed. Never install/connect/configure them unless explicitly requested. When required capability is unavailable, return a blocker rather than fabricating external state.

## Final acceptance

Brain acceptance compares authoritative `.docs`, approved Jira context/results, changed source, and actual validation evidence. Green tests alone are not enough. Return `accepted` only when requirements/acceptance criteria are covered, implementation matches approved architecture/design, intended behavior is proven, no blocking gap remains, all known child agents have been explicitly closed/verified, and all owned runtime resources are released or safely resolved.
