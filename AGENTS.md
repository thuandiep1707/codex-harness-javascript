# Codex Frontend Orchestrator

These instructions apply to Codex work in this repository. Keep this entry point concise: planning
belongs to `plan-frontend-work`, implementation policy belongs to frontend rules and coding skills,
design policy belongs to `orchestrate-frontend-design`, and test policy belongs to `testing`.

## Primary workflow

For any request that may change repository files:

1. Load `.agents/skills/plan-frontend-work/SKILL.md`.
2. Let the primary Sol agent read the relevant `.docs/` evidence and build the dependency-ordered
   task graph.
3. Resolve any planning gates before implementation.
4. Delegate bounded task packets to the configured coding, design, and testing agents.
5. Wait for required handoffs, reconcile results, run final validation, and report one consolidated
   outcome.

Review-only questions may be answered directly after reading the minimum relevant evidence. They do
not require a plan artifact or subagent delegation.

## Skill categories

Use `.docs/agents/skill-catalog.md` as the authoritative catalog.

| Category | Purpose | Skills |
| --- | --- | --- |
| Planning | Read evidence, resolve architecture/adoption gates, and create task packets | `plan-frontend-work`, `design-frontend-module-boundary`, `audit-frontend-supply-chain`, `audit-frontend-security` |
| Frontend coding | Implement approved frontend behavior and integrations | `migrate-legacy-frontend-module`, `integrate-third-party-frontend`, `nextjs-state-management`, `nextjs-tanstack-query`, `shadcn` |
| Design | Connect to design providers and return approved design artifacts | `orchestrate-frontend-design` |
| Testing | Write the test plan, test code, execute it, and report evidence | `testing` |

Do not make a worker infer work from the original user prompt. The primary agent must send a bounded
task packet using the contract in
`.agents/skills/plan-frontend-work/references/handoff-contracts.md`.

## Agent roles

Project-scoped roles are configured in `.codex/config.toml` and `.codex/agents/*.toml`.

- The primary agent uses GPT-5.6 Sol and owns requirements, planning, gates, task graph, delegation,
  reconciliation, and the final response.
- `frontend_coder` uses GPT-5.5 and owns approved frontend implementation.
- `design_connector` uses GPT-5.6 Luna and owns Stitch/Figma discovery, MCP interaction, artifact
  inspection, and design handoff.
- `test_engineer` uses GPT-5.4 and owns test planning, test implementation, execution, and evidence.

Run `design_connector` and `frontend_coder` in parallel only when the coding packet does not depend on
an unfinished design decision or artifact. The test engineer may draft the test plan in parallel
after behavior and acceptance criteria are stable; test-code implementation depends on the
production contract it verifies. Avoid parallel writes to the same files.

## Frontend coding routing

Before frontend code or configuration changes, read `.agents/rules/frontend-coding.md` and only the
topic rules it routes for the task evidence. Add specialized skills as follows:

| Task intent | Load in this order |
| --- | --- |
| Move legacy/demo behavior into an approved module | `migrate-legacy-frontend-module` |
| Adopt an approved package, SDK, widget, engine, mapping runtime, or external source | `integrate-third-party-frontend` |
| Implement URL, local client, or server-state ownership | `nextjs-state-management`; add `nextjs-tanstack-query` only for explicit TanStack Query work |
| Work directly with shadcn primitives, CLI, preset, registry, or generated component source | `shadcn` |

Planning must complete ownership, supply-chain, security, and external-source gates before the coding
agent mutates dependent code.

## Design routing

Use `orchestrate-frontend-design` when a task needs a new or revised screen, component appearance,
layout, prototype, or design-system direction and no developer-approved artifact exists. The design
agent must use only available configured providers, preserve artifact identity, and stop at the
design approval gate. Provider-returned code remains a design artifact until a later coding task
explicitly approves adoption.

## Testing routing

Read `.agents/rules/testing.md` and load `testing` when a test plan, test code, test configuration,
test review, or test execution is in scope. The testing agent must select the narrowest layer that
proves the behavior, wait for required production contracts, run the created tests, and return
deterministic evidence. Routine lint, typecheck, build, or browser validation does not trigger the
testing skill by itself.

## Repository conventions

- Read relevant feature documentation under `.docs/` before changing behavior.
- Read `.analysis/README.md` and only the owning context analysis when application architecture is
  present.
- Read `src/modules/README.md` when module code is involved.
- Read installed framework documentation before relying on version-sensitive APIs.
- `src/components/ui` is the complete atoms layer; never create `src/components/atoms`.
- Shared UI follows `ui -> molecules -> organisms -> templates`.
- Business-specific UI belongs to `src/modules/<context>/presentation`.
- Preserve the documented DDD dependency direction.
- Do not invent decisions marked as deferred.

## Conflict handling

The current user instruction takes precedence when it explicitly changes a repository decision.
When it appears to conflict with approved documentation or an unresolved gate, identify the
conflict and request confirmation instead of silently creating a competing convention.
