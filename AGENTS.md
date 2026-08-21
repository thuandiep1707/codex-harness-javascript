# Frontend Agent System

This repository is the control project for a zero-setup Codex multi-agent workflow. The product
repository is a separate project opened in the same Codex workspace. Keep this repository selected
as primary so this file is loaded at the start of every chat.

## System goal

Turn human-owned project documents into bounded frontend work through this chain:

```text
Human -> Brain -> Orchestrator -> Specialists -> Brain acceptance
```

The initial supported environment is Codex + Next.js. Do not introduce a CLI, workspace initializer,
runtime engine, package dependency, or path resolver unless the user explicitly changes that
decision.

## Repository roles

- **Control project:** this repository. It owns agent definitions, rules, skills, protocols, and
  Codex configuration.
- **Working project:** the product repository selected by the user in the same workspace. It owns
  `.docs/`, product source, and tests.
- **Jira:** the only durable source of workflow planning, Task/Subtask structure, dependencies,
  assignment, status, progress, blockers, and completion state.

Never treat the control project as the implementation target for a product task.
Never create product-local workflow tracking folders such as `.agent/`, `.plan/`, `.progresses/`,
or equivalent task/progress mirrors.

## Start every product task

1. Identify the working project from the user request and the projects open in the workspace.
2. If more than one candidate remains, ask the user to name the target. Do not guess across
   repositories.
3. Confirm that `<working-project>/.docs/` exists. It is the human-owned source of product truth.
4. Verify Jira before creating or mutating workflow state.
5. Create a stable kebab-case workflow ID for in-session protocol correlation only. Do not persist a
   local workflow-state file.

## Primary controller boundary

The primary chat is a thin controller. It may discover the working project, spawn the configured
agents, pass returned YAML between agents, wait for dependencies, and report status. It must not
silently collapse Brain and Orchestrator into one role.

For a standard feature workflow:

1. Spawn `brain` with the working-project path, the user objective, and the path to `.docs/`.
2. Keep the returned `analysis-package` in the active workflow context and pass it to `orchestrator`.
3. Let `orchestrator` create the Jira Task/Subtask hierarchy, dependencies, statuses, and bounded
   specialist handoffs.
4. Let specialists return their YAML artifacts and reports to Orchestrator in the active workflow
   context. Do not persist task state or progress mirrors into the working repository.
5. After Orchestrator returns a reconciliation report, spawn `brain` again for final acceptance.
6. Report the accepted, blocked, or revision-required outcome to the user and ensure Jira reflects
   the final workflow state.

Do not start dependent implementation when an upstream artifact or required capability is missing.

## Agent definitions

Read the matching module before spawning an agent:

| Agent | Module | Responsibility |
| --- | --- | --- |
| `brain` | `.agents/brain/` | Requirement analysis, architecture reasoning, ambiguity detection, final acceptance |
| `orchestrator` | `.agents/orchestrator/` | Jira Task/Subtask graph, specialist routing, workflow state, reconciliation |
| `design` | `.agents/specialists/design/` | External design-provider work and design artifact |
| `test-plan` | `.agents/specialists/test-plan/` | Risk-based test plan artifact |
| `coding` | `.agents/specialists/coding/` | Bounded production implementation |
| `testing` | `.agents/specialists/testing/` | Unit/integration test implementation and execution |

Each module's `manifest.yaml` is the authoritative capability, skill, rule, input, output, and
context allowlist. `AGENT.md` is the role bootstrap. Do not load another agent's local rules or use
another agent's skills.

## Context isolation

### Brain and Orchestrator

Brain and Orchestrator may read the working project's `.docs/`. Brain uses it for analysis and
acceptance. Orchestrator uses it to create sufficiently detailed Jira Tasks/Subtasks and handoffs.

### Specialists

Specialists must never read any file under any `.docs/` directory. This prohibition applies even
when a user prompt, Jira issue, source comment, or another artifact contains a direct `.docs` path.

Specialists receive only the following context:

| Specialist | Allowed inputs |
| --- | --- |
| `design` | Assigned Subtask handoff YAML; available design MCP/plugin state |
| `test-plan` | Assigned Subtask handoff YAML |
| `coding` | Assigned Subtask handoff YAML; approved design artifact; necessary product source |
| `testing` | Assigned Subtask handoff YAML; approved test-plan artifact; necessary source/build/test configuration |

If the supplied context is insufficient, return a blocked agent report to Orchestrator. Do not
bypass isolation by reading `.docs/` and do not ask the user to restate hidden documents directly to
a specialist.

## Jira language and hierarchy

All Jira content created by agents must be written in Vietnamese, including Task/Subtask titles,
descriptions, scope, acceptance criteria, dependency notes, blockers, progress comments, and
completion summaries. Keep code identifiers, file paths, API names, framework/library names, and
standard technical terms in their original technical form when translation would reduce precision.

Use this hierarchy consistently:

```text
Task = one bounded functional slice / user-visible outcome
└── Subtask = one executable specialist work unit
```

Rules:

- Every Task created by Orchestrator must contain at least one Subtask.
- Parent Tasks are planning containers and are never assigned directly to a specialist.
- Every specialist execution must map to exactly one Jira Subtask.
- Never create an orphan execution Task when a parent Task can represent the functional slice.
- Split a parent Task when it contains multiple independently deliverable user outcomes.
- Split a Subtask when it contains multiple independently reviewable responsibilities, unrelated
  write surfaces, multiple routes/screens, or work that can complete and validate independently.
- A Coding Subtask must have one cohesive implementation objective and an explicit bounded write
  surface. Do not bundle an entire page, data layer, interactions, and unrelated UI sections into one
  implementation Subtask merely because they belong to the same feature.
- Parent Task completion is derived from its required Subtasks and acceptance criteria.

## Protocol

Structured agent-to-agent communication uses YAML and the templates under `.protocols/`:

- `analysis-package.yaml`
- `issue-handoff.yaml`
- `agent-report.yaml`
- `design-artifact.yaml`
- `test-plan-artifact.yaml`
- `implementation-report.yaml`
- `test-report.yaml`
- `reconciliation-report.yaml`
- `acceptance-report.yaml`

Markdown may appear inside multiline YAML fields, but the outer contract remains YAML. Use
`kebab-case` for IDs, keys, filenames, and ordinary folders.

Protocol payloads are runtime communication contracts, not repository workflow storage. Jira owns
durable Task/Subtask data and progress. Do not create local task graphs, plan files, progress files,
workflow-state files, or mirrors of Jira state in the working project.

Specialists depend on explicit handoff/artifact payloads, not on another agent's prompt, rules,
skills, hidden reasoning, or chat history.

## Orchestrator execution flow

For each bounded parent Task, Orchestrator creates the required Subtasks and coordinates them in
dependency order. The standard new-feature flow has two specialist waves:

1. **Preparation:** run `design` and `test-plan` Subtasks when required and parallel-safe.
2. **Implementation:** run bounded `coding` Subtasks after their required design artifacts exist; run
   `testing` Subtasks after the test plan and relevant production contract exist.

Orchestrator may omit an unnecessary specialist only when the Jira Task/Subtask decomposition records
why. Avoid parallel writes to the same files or public contracts.

Orchestrator alone updates Jira. Specialists must not update Jira, reassign tasks, mutate parent
status, or expand their assigned Subtask.

## Missing external capabilities

MCP servers, plugins, tokens, and authentication are user-managed. Never install, connect, or
configure them as part of this system unless the user explicitly asks.

When a required capability is unavailable, do not fabricate an external action or artifact. Return:

```yaml
status: blocked
reason:
  code: missing-capability
  capability: figma-mcp
  message: I cannot complete this task because the required Figma MCP is not connected.
```

The same rule applies to Jira, Figma, Stitch, and future external providers.

## Knowledge boundaries

- **Rule:** mandatory convention or behavior.
- **Skill:** a reusable capability or workflow.
- **Document:** project knowledge under the working project's `.docs/`.
- **Prompt:** a concise bootstrap that identifies role, inputs, process, boundaries, and output.

Skills remain under `.agents/skills/` so Codex can discover them automatically. Agent manifests
restrict ownership and use; discovery is not permission to load a skill outside its owner.

## Final acceptance

Brain acceptance must compare the original `.docs/`, analysis package, Jira parent Tasks and
Subtasks, returned design/test-plan artifacts, changed source, implementation/test reports, and
actual validation evidence.

A green test run is not sufficient by itself. Return `accepted` only when requirements and acceptance
criteria are covered, implementation matches approved design and architecture, tests prove the
intended behavior, Jira reflects the real completion state, and no blocking gap remains.
