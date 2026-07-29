---
name: plan-frontend-work
description: Convert an approved frontend analysis package into a dependency-ordered execution graph, detailed Jira issues, isolated YAML handoffs, specialist waves, workflow state, and a reconciliation report. Use only for the Orchestrator after Brain analysis; do not use for requirement analysis, architecture ownership decisions, product implementation, visual design, test planning, test implementation, or final acceptance.
---

# Plan Frontend Work

## 1. Validate inputs and capabilities

Read the analysis package, protocol templates, agent manifests, and only the project documents or
source evidence needed to make each issue executable. Verify Jira before external mutation. Return a
`missing-capability` blocker if it is unavailable.

Do not reopen Brain decisions. Send requirement, scope, architecture, or acceptance conflicts back
to Brain or the user.

## 2. Build the task graph

Read [task-graph.md](references/task-graph.md). Split work across:

1. `design`;
2. `test-plan`;
3. `coding`;
4. `testing`.

Record why any category is omitted. Make dependencies, write surfaces, execution waves, and exit
conditions explicit.

## 3. Create Jira issues and YAML handoffs

Read [handoff-contracts.md](references/handoff-contracts.md). Create or update the Jira issue first,
then mirror the exact assignment into:

```text
<working-project>/.agent/tasks/<workflow-id>/<task-id>.yaml
```

Do not pass raw `.docs/`, document paths, the original user prompt, hidden reasoning, or another
agent's rules/skills to a specialist.

## 4. Coordinate specialist waves

- Run `design` and `test-plan` in the preparation wave when required.
- Validate and persist their YAML artifacts.
- Start `coding` only after its required design artifact is approved.
- Start `testing` only after its test-plan artifact and production contract are available.
- Avoid parallel writes to the same files or contract.
- Update Jira and `.agent/state/` after each transition.

Never perform missing specialist work as a fallback.

## 5. Reconcile

Compare every report with its issue handoff, persist artifacts, update Jira, and return YAML matching
`.protocols/reconciliation-report.yaml`.

Use `completed` only when every required task and artifact is complete. Use `revision-required` for
recoverable scope or evidence gaps and `blocked` for missing capabilities or unresolved authority.
