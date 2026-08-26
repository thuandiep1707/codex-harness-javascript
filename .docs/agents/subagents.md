# Agent runtime map

## Public workflow entry points

| Workflow | Execution intent | Result |
| --- | --- | --- |
| `$frontend-delivery` | `deliver` | Continue end-to-end until acceptance/pause/blocker |
| `$frontend-planning` | `plan-only` | Create/reconcile Jira work graph then stop |

Lifecycle `planning/resume/pause` is separate from execution intent. Planning mode does not imply plan-only.

## Runtime roles

| Role | Codex agent | Responsibility |
| --- | --- | --- |
| Primary controller | main chat | Resolve public workflow, working project, lifecycle entry, execution intent; spawn roles; report outcome |
| Brain | `brain` | Analyze relevant `.docs`, detect implementation environment, record baseline, targeted revalidation, final acceptance |
| Orchestrator | `orchestrator` | Jira hierarchy, execution intent, capability routing, resume, pause/handoff, specialist coordination, reconciliation |
| Design | `design` | Use connected design provider and return design evidence |
| Test plan | `test-plan` | Produce a bounded risk-based test-plan result |
| Coding | `coding` | Implement one bounded Coding Subtask using routed internal capabilities |
| Testing | `testing` | Implement/run one bounded Testing Subtask using routed internal capabilities |

The primary controller is intentionally thin. Brain does not create tasks. Orchestrator does not perform specialist implementation. Chat history is never required to resume valid Jira work.

## Internal capability model

Internal capabilities live under `.agents/capabilities/**`, outside Codex public workflow discovery.

Brain may use `discover-project-stack` to detect current framework/UI/icon/state/testing evidence. Orchestrator maps that evidence + Subtask trigger + specialist manifest to the smallest capability set and records the routed identifiers in the Subtask/handoff.

Specialist rule:

```text
manifest allowlist
∩ handoff internal-capabilities
= capabilities allowed to load
```

Do not load every manifest capability. Missing/conflicting stack evidence is unresolved, not a reason to default to a library.

## Jira hierarchy

```text
Feature context
  -> Task: functional slice
      -> Subtask: specialist execution unit
```

Parent Tasks are scope/acceptance boundaries. Specialists execute Subtasks only. Orchestrator creates only the specialist Subtasks actually required by a functional slice.

## Context boundary

Brain may read relevant `.docs` for analysis/revalidation/acceptance plus bounded source/config evidence for stack discovery. Orchestrator may read relevant `.docs` during planning/replanning and minimal Jira/source evidence during resume/pause. Specialists may not read `.docs`.

Every specialist receives a transient handoff composed from Feature context + Task delta + Subtask delta + direct dependency evidence + routed internal capability identifiers. Orchestrator alone updates Jira.

## Delivery sequence

```text
$frontend-delivery
→ Brain analysis + stack discovery
→ Orchestrator planning (intent=deliver)
→ Jira graph + capability routing
→ ready specialists
→ reconciliation
→ Brain acceptance
```

No confirmation gate after Jira planning unless a real unresolved authority/blocker exists.

## Planning-only sequence

```text
$frontend-planning
→ Brain analysis
→ Orchestrator planning (intent=plan-only)
→ Jira graph
→ STOP
```

## Resume

1. Resolve current Jira Subtask.
2. Verify relevant docs have not materially changed since baseline.
3. Load Feature + parent Task + current Subtask + direct dependencies + routed capability identifiers + latest durable checkpoint/result.
4. Validate routing against cheap current source/config evidence.
5. Run only the required specialist.

## Pause

1. Primary controller recognizes natural-language pause intent and stops new dispatch.
2. Orchestrator collects available specialist/source evidence without starting new implementation.
3. Reconcile proven execution state against Jira; write missing `[RESULT]`/status corrections first.
4. Persist one concise Vietnamese `[HANDOFF]` at the unfinished continuation point.
5. Return `paused` only after Jira persistence succeeds; otherwise `pause-blocked`.

Custom-agent TOMLs intentionally omit MCP configuration. External capabilities are inherited from the user session and must already be connected.
