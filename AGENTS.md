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
  `.docs/`, product source, tests, and local `.agent/` workflow data.

Never treat the control project as the implementation target for a product task.

## Start every product task

1. Identify the working project from the user request and the projects open in the workspace.
2. If more than one candidate remains, ask the user to name the target. Do not guess across
   repositories.
3. Confirm that `<working-project>/.docs/` exists. It is the human-owned source of product truth.
4. Ensure `<working-project>/.agent/` contains `artifacts/`, `state/`, `tasks/`, and `reports/`.
5. Keep `.agent/` local. Prefer adding `/.agent/` to
   `<working-project>/.git/info/exclude`; do not edit the shared `.gitignore` unless requested.
6. Create a stable kebab-case workflow ID and use it for all local files and external issue links.

## Primary controller boundary

The primary chat is a thin controller. It may discover the working project, spawn the configured
agents, persist their returned YAML, wait for dependencies, and report status. It must not silently
collapse Brain and Orchestrator into one role.

For a standard feature workflow:

1. Spawn `brain` with the working-project path, the user objective, and the path to `.docs/`.
2. Save the returned YAML as
   `<working-project>/.agent/artifacts/<workflow-id>/analysis-package.yaml`.
3. Spawn `orchestrator` with the working-project path and analysis-package path.
4. Let `orchestrator` create Jira issues, YAML handoffs, workflow state, and specialist work.
5. After Orchestrator returns a reconciliation report, spawn `brain` again for final acceptance.
6. Save the returned YAML as
   `<working-project>/.agent/reports/<workflow-id>/acceptance-report.yaml`.
7. Report the accepted, blocked, or revision-required outcome to the user.

Do not start dependent implementation when an upstream artifact or required capability is missing.

## Agent definitions

Read the matching module before spawning an agent:

| Agent | Module | Responsibility |
| --- | --- | --- |
| `brain` | `.agents/brain/` | Requirement analysis, architecture reasoning, ambiguity detection, final acceptance |
| `orchestrator` | `.agents/orchestrator/` | Task graph, Jira, specialist routing, workflow state, reconciliation |
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
acceptance. Orchestrator uses it to create sufficiently detailed Jira issues and handoffs.

### Specialists

Specialists must never read any file under any `.docs/` directory. This prohibition applies even
when a user prompt, Jira issue, source comment, or another artifact contains a direct `.docs` path.

Specialists receive only the following context:

| Specialist | Allowed inputs |
| --- | --- |
| `design` | Assigned `issue-handoff.yaml`; available design MCP/plugin state |
| `test-plan` | Assigned `issue-handoff.yaml` |
| `coding` | Assigned `issue-handoff.yaml`; approved `design-artifact.yaml`; necessary product source |
| `testing` | Assigned `issue-handoff.yaml`; approved `test-plan-artifact.yaml`; necessary source/build/test configuration |

If the supplied context is insufficient, return a blocked agent report to Orchestrator. Do not
bypass isolation by reading `.docs/` and do not ask the user to restate hidden documents directly to
a specialist.

## Protocol

All structured communication uses YAML and the templates under `.protocols/`:

- `analysis-package.yaml`
- `issue-handoff.yaml`
- `agent-report.yaml`
- `design-artifact.yaml`
- `test-plan-artifact.yaml`
- `implementation-report.yaml`
- `test-report.yaml`
- `reconciliation-report.yaml`
- `acceptance-report.yaml`
- `workflow-state.yaml`

Markdown may appear inside multiline YAML fields, but the outer contract remains YAML. Use
`kebab-case` for IDs, keys, filenames, and ordinary folders.

Store product-workflow data only under the working project's `.agent/` directory:

```text
.agent/
├── artifacts/<workflow-id>/
├── state/<workflow-id>.yaml
├── tasks/<workflow-id>/
└── reports/<workflow-id>/
```

Specialists depend on artifacts, not on another agent's prompt, rules, skills, hidden reasoning, or
chat history.

## Orchestrator execution flow

The standard new-feature flow has two specialist waves:

1. **Preparation:** run `design` and `test-plan` when required and parallel-safe.
2. **Implementation:** run `coding` after the approved design artifact exists; run `testing` after
   the test plan and the relevant production contract exist.

Orchestrator may omit an unnecessary specialist only when the analysis package and task graph record
why. Avoid parallel writes to the same files or public contracts.

Orchestrator alone updates Jira and `.agent/state/`. Specialists must not update Jira, reassign
tasks, or mutate workflow state.

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

Brain acceptance must compare the original `.docs/`, analysis package, Jira/task handoffs, design
and test-plan artifacts, changed source, implementation/test reports, and actual validation
evidence.

A green test run is not sufficient by itself. Return `accepted` only when requirements and
acceptance criteria are covered, implementation matches approved design and architecture, tests
prove the intended behavior, and no blocking gap remains.
