# Frontend Subagents

## Model map

| Role | Model | Responsibility |
| --- | --- | --- |
| Primary planner | GPT-5.6 Sol | Read docs, resolve gates, build the task graph, delegate, reconcile, and answer |
| `frontend_coder` | GPT-5.5 | Implement approved frontend production code |
| `design_connector` | GPT-5.6 Luna | Use configured Stitch/Figma MCP tools and return design handoffs |
| `test_engineer` | GPT-5.4 | Write test plans and approved test code, run tests, and report evidence |

The primary role is configured directly in `.codex/config.toml`. The three worker roles are defined
under `.codex/agents/` and registered from the same project config.

## Coordination

1. The primary agent loads `plan-frontend-work` and creates bounded task packets.
2. Start design and coding together only when the coding task does not depend on unfinished design.
3. Start the test plan after behavior and acceptance criteria are stable.
4. Start test-code implementation after the production contract is available.
5. Wait for required handoffs and let the primary agent reconcile all results.

Custom agent files omit MCP server declarations intentionally. Codex therefore inherits configured
MCP servers from the parent session, allowing `design_connector` to use whichever Stitch or Figma
integration is actually installed and authorized.
