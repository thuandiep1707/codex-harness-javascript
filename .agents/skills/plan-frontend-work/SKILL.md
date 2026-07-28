---
name: plan-frontend-work
description: Read project documentation and repository evidence, resolve frontend architecture and adoption gates, decompose a requested change into a dependency-ordered task graph, and prepare bounded handoffs for frontend coding, design, and testing agents. Use before multi-file frontend implementation, UI/UX work, migrations, third-party adoption, security-sensitive changes, or any request that should be delegated across specialized subagents.
---

# Plan Frontend Work

## Goal

Keep the primary agent focused on requirements and decisions. Convert repository documentation and
live evidence into task packets that coding, design, and testing agents can execute without
reinterpreting the original request.

## Workflow

### 1. Read the documentation layer

Read [docs-intake.md](references/docs-intake.md). Start with `.docs/`, then load the minimum
architecture, configuration, and source evidence needed to verify the request. Produce a concise
context digest with authoritative decisions, constraints, unknowns, and conflicts.

### 2. Resolve planning gates

Classify the request using `.docs/agents/skill-catalog.md`.

- Load `design-frontend-module-boundary` when ownership or placement is unresolved.
- Load `audit-frontend-supply-chain` before adopting external packages or source.
- Load `audit-frontend-security` for browser, session, token, input, messaging, worker, upload, or
  runtime threat surfaces.

Stop dependent work when a required decision, authorization, artifact identity, or architecture gate
is unresolved. Planning skills may produce decisions and controls; they do not implement production
code.

### 3. Build the task graph

Read [task-graph.md](references/task-graph.md). Split work into the three execution categories:

1. `design` for provider interaction and design artifacts;
2. `frontend-coding` for production implementation;
3. `testing` for test planning, test code, execution, and evidence.

Make dependencies explicit. Use waves for parallel-safe tasks and serialize tasks that share files,
contracts, or unresolved design decisions.

### 4. Create subagent handoffs

Read [handoff-contracts.md](references/handoff-contracts.md). Create one bounded packet per worker.
Every packet must name the target agent, selected skills, inputs, exact scope, allowed writes,
dependencies, acceptance criteria, validation, and required return evidence.

Do not send the raw user request as the worker specification. Do not let a worker expand its own
scope or make planning decisions that the packet leaves unresolved.

### 5. Coordinate execution

- Keep GPT-5.6 Sol as the primary owner of the task graph and final decisions.
- Send approved implementation packets to `frontend_coder`.
- Send design-provider packets to `design_connector`.
- Send test-plan and approved test-code packets to `test_engineer`.
- Run design and coding in parallel only when coding does not depend on the pending design output.
- Allow test-plan drafting in parallel once behavior and acceptance criteria are stable; wait for the
  production contract before test-code implementation.
- Wait for required handoffs and return changed assumptions or material scope expansion to planning.

### 6. Reconcile and close

Compare every worker result with its packet. Resolve conflicts, run final repository validation,
update required documentation, and report completed tasks, deviations, evidence, and remaining
gates. The primary agent owns the consolidated response.

## Output contract

Return:

- context digest;
- selected planning gates and decisions;
- dependency-ordered task graph with execution waves;
- one task packet per delegated worker;
- approval or blocker state;
- reconciliation and final validation requirements.

## Guardrails

- Keep planning read-heavy; do not implement application or test code from this skill.
- Read relevant documentation rather than every file under `.docs/`.
- Do not parallelize writes to the same files.
- Do not treat an MCP-generated design or code sample as approved production source.
- Do not claim a gate is resolved without evidence or explicit authority.
