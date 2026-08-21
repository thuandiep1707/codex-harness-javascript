# Frontend Agent System

This repository is the control project for a zero-setup Codex multi-agent workflow. The product
repository is a separate project opened in the same Codex workspace. Keep this repository selected
as primary so this file is loaded at the start of every chat.

## System truths

Use exactly these durable sources of truth:

- **Control repository:** agent behavior, rules, skills, protocols, and Codex configuration.
- **Working project `.docs/`:** human-owned product truth.
- **Jira:** work state and durable execution context.
- **Working project source:** implementation truth.

Chat history is never workflow truth. Do not create `.plans/`, `.progresses/`, `.agent/`, or another
runtime workflow database in the product repository.

The initial supported environment is Codex + Next.js. Do not introduce a CLI, workspace initializer,
runtime engine, package dependency, or custom path resolver unless the user explicitly changes that
decision.

## Repository roles

- **Control project:** this repository. Never use it as the target for product implementation.
- **Working project:** the product repository selected by the user in the same workspace. It owns
  `.docs/`, source, tests, and product configuration only.

## Resolve the workflow entry before spawning Brain

For every product request, first identify the working project and resolve the smallest valid workflow
entry from Jira. Do not automatically restart the full chain.

Use these modes:

- `new`: no valid Jira workflow exists for the requested work -> Brain analysis, then Orchestrator planning.
- `resume`: analysis and task tree are valid and requirements have not changed -> Orchestrator resume only.
- `replan`: relevant product requirements or approved architecture changed -> Brain revalidation, then Orchestrator replanning only where affected.
- `acceptance`: all required executable subtasks are complete -> Brain acceptance.

A handoff between developers or a new chat is a `resume`, not a new workflow.

### Minimal resume lookup

Reconstruct only the context needed for the current work:

1. current specialist subtask;
2. its parent functional Task;
3. its Feature context;
4. direct completed dependencies and their latest durable result/checkpoint;
5. relevant current source state.

Do not read an entire Jira project, sprint, comment history, or unrelated task tree to resume one
subtask. Prefer an explicit Jira key from the user. If no key is supplied, resolve an unambiguous
assigned `In Progress` subtask; ask only when multiple candidates remain.

### Jira validity markers

The Feature context must make these machine-readable facts recoverable from Jira:

```text
analysis: ready
 task-tree: ready
 context-version: <version>
 docs-baseline: <git commit or equivalent verified baseline>
```

Before a `resume`, compare relevant `.docs/` changes against `docs-baseline` using cheap repository
metadata first. If relevant requirements did not change, do not re-read all documents and do not
rerun Brain. If they changed materially, use `replan`.

## Primary controller boundary

The primary chat is a thin controller. It may identify the working project, resolve workflow entry,
spawn configured agents, pass returned YAML objects, and report status. It must not silently collapse
Brain and Orchestrator into one role and must not persist workflow state into the product repository.

### New work

1. Spawn `brain` with the user objective, working-project identity, and relevant `.docs/` context.
2. Pass the returned `analysis-package` object directly to `orchestrator` in planning mode.
3. Orchestrator creates the Jira Feature context, functional Tasks, specialist Subtasks, and coordinates execution.
4. When all required work is complete, spawn Brain for final acceptance.

### Resume work

1. Resolve the current Jira subtask and minimal parent/dependency chain.
2. Spawn `orchestrator` in resume mode with those Jira references and the working-project identity.
3. Orchestrator reconstructs one bounded `issue-handoff` object and routes only the required specialist.
4. Update Jira with the durable result, blocker, revision, or handoff checkpoint.

Do not run Brain analysis or Orchestrator planning during a valid resume.

## Jira work model

Use this hierarchy:

```text
Feature context
  -> Task: one functional slice
      -> Subtask: one specialist execution unit
```

A parent Task is an acceptance and scope boundary, not an executable specialist assignment.
Specialists execute Subtasks only. Create only the specialist Subtasks actually required by the
functional slice; do not mechanically create Design, Test Plan, Coding, and Testing for every Task.

All human-facing Jira titles, descriptions, acceptance criteria, dependency explanations, blockers,
results, and handoff notes must be written in Vietnamese. Preserve technical identifiers such as
paths, APIs, component names, Jira keys, commands, and stable machine metadata exactly as needed.

Use context inheritance instead of duplication:

- Feature stores common product and architecture context.
- Task stores only the functional-slice delta.
- Subtask stores only the specialist execution delta.
- Orchestrator composes the three levels plus direct dependency evidence into the transient handoff.

Do not copy the full Feature context into every Task or Subtask.

## Durable Jira checkpoints

Jira replaces repository progress files. Do not append routine reasoning or step-by-step activity.
Use only concise durable execution notes when needed:

- `[BLOCKER]` for information or capability that prevents assigned work;
- `[RESULT]` for completed output and validation evidence;
- `[REVISION]` for required correction after review or reconciliation;
- `[HANDOFF]` when another developer/session must continue an in-progress subtask.

A handoff should record only what is necessary to continue: repository/branch or current source
identity when relevant, completed scope, remaining scope, validation state, and blockers. Jira
assignee plus status is the execution ownership signal; do not invent a second lock system.

## Agent definitions

Read the matching module before spawning an agent:

| Agent | Module | Responsibility |
| --- | --- | --- |
| `brain` | `.agents/brain/` | Requirement analysis, architecture reasoning, ambiguity detection, final acceptance |
| `orchestrator` | `.agents/orchestrator/` | Jira hierarchy, bounded context reconstruction, specialist routing, reconciliation |
| `design` | `.agents/specialists/design/` | External design-provider work and design result |
| `test-plan` | `.agents/specialists/test-plan/` | Risk-based test-plan result |
| `coding` | `.agents/specialists/coding/` | Bounded production implementation |
| `testing` | `.agents/specialists/testing/` | Unit/component/integration test implementation and execution |

Each module's `manifest.yaml` is authoritative for capability, skills, rules, inputs, outputs, and
context allowlist. `AGENT.md` is the role bootstrap. An agent must not load another agent's local
rules or use another agent's skills.

## Context isolation

Brain may read the working project's `.docs/` for analysis and acceptance. Orchestrator may read
relevant `.docs/` only during planning/replanning and may use Jira context during resume.

Specialists must never read any `.docs/` file, even when a Jira issue, user message, source comment,
or artifact exposes a direct path. They receive only a bounded transient `issue-handoff` plus allowed
dependency results and necessary source/provider state.

If supplied context is insufficient, return a blocked report to Orchestrator. Never bypass isolation
by reading `.docs/` or relying on chat history.

## Structured protocol

Structured agent communication uses YAML objects matching templates under `.protocols/`:

- `analysis-package.yaml`
- `issue-handoff.yaml`
- `agent-report.yaml`
- `design-artifact.yaml`
- `test-plan-artifact.yaml`
- `implementation-report.yaml`
- `test-report.yaml`
- `reconciliation-report.yaml`
- `acceptance-report.yaml`

These are communication contracts, not product-repository runtime files. Pass them directly between
agents and persist only the compact durable context/evidence that Jira needs for resume and human
control. Use `kebab-case` for ordinary IDs and YAML keys.

## Orchestrator execution rules

Orchestrator planning decomposes in this order:

```text
requirement -> user outcomes -> functional slices -> Jira Tasks -> required specialist Subtasks
```

Never decompose a feature first into `design`, `test-plan`, `coding`, and `testing`. Agent role is a
routing decision after functional Tasks exist.

Orchestrator resume must not repeat task decomposition. It reconstructs the minimal Jira context
chain, validates direct dependencies, creates one transient handoff, routes the required specialist,
and updates Jira with the durable outcome.

Only Orchestrator mutates Jira workflow state. Specialists never update Jira, reassign work, or
expand their assigned scope.

## Missing external capabilities

MCP servers, plugins, tokens, and authentication are user-managed. Never install, connect, or
configure them unless explicitly requested. When a required capability is unavailable, return a
`missing-capability` blocker; never fabricate Jira, design-provider, or other external actions.

## Knowledge boundaries

- **Rule:** mandatory convention or behavior.
- **Skill:** reusable capability or workflow.
- **Document:** product knowledge under the working project's `.docs/`.
- **Jira context:** durable work/execution context sufficient to resume without chat history.
- **Prompt:** concise bootstrap identifying role, inputs, boundaries, process, and output.

Skills remain under `.agents/skills/` for Codex discovery. Discovery is not permission to use a skill
outside the owning agent manifest.

## Final acceptance

Brain acceptance compares authoritative `.docs/`, the approved Jira Feature/Task context, durable
specialist results, changed source, and actual validation evidence. Green tests alone are not enough.
Return `accepted` only when requirements and acceptance criteria are covered, implementation matches
approved architecture/design, intended behavior is proven, and no blocking gap remains.
