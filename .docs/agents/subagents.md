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
| Primary controller | main chat | Resolve workflow/lifecycle; own native child-agent lifecycle, Jira connector transport, and runtime cleanup supervision; execute Orchestrator controller actions |
| Brain | `brain` | Analyze relevant `.docs`, detect implementation environment, record baseline, targeted revalidation, final acceptance |
| Orchestrator | `orchestrator` | Jira/workflow decisions, capability routing, specialist dispatch decisions, resume, pause/handoff decisions, reconciliation |
| Design | `design` | Use connected design provider and return design evidence |
| Test plan | `test-plan` | Produce a bounded risk-based test-plan result |
| Coding | `coding` | Implement one bounded Coding Subtask using routed internal capabilities |
| Testing | `testing` | Implement/run one bounded Testing Subtask using routed internal capabilities |

The Primary Controller is intentionally thin but is the only runtime transport owner. Brain does not create tasks. Orchestrator does not perform specialist implementation, invoke native child-agent lifecycle APIs, or call Jira directly. Chat history is never required to resume valid Jira work.

## Controller action loop

Orchestrator makes the decision; Primary Controller performs the transport:

```text
Orchestrator
→ controller-action (jira-call | dispatch-specialist)
→ Primary Controller executes exactly
→ confirmed controller-action-result
→ same Orchestrator child
→ next action or terminal result
```

Keep one Orchestrator child alive across an active workflow instead of respawning it after every specialist result. Specialists are short-lived sibling children spawned and closed by the Primary Controller.

A tool missing inside the Orchestrator child is not a workflow capability failure. Only a failed Primary Controller transport attempt establishes Jira/native-dispatch unavailability.

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

Parent Tasks are scope/acceptance boundaries. Specialists execute Subtasks only. Orchestrator decides only the specialist Subtasks actually required by a functional slice; Primary Controller executes the resulting Jira connector calls.

## Context boundary

Brain may read relevant `.docs` for analysis/revalidation/acceptance plus bounded source/config evidence for stack discovery. Orchestrator may read relevant `.docs` during planning/replanning and minimal supplied Jira/source evidence during resume/pause. Specialists may not read `.docs`.

Every specialist receives a transient handoff composed from Feature context + Task delta + Subtask delta + direct dependency evidence + routed internal capability identifiers. Specialists return results to Primary Controller, which forwards the confirmed result to the active Orchestrator child. Only Primary Controller calls Jira; Orchestrator decides what Jira action is required.

## Delivery sequence

```text
$frontend-delivery
→ Brain analysis + stack discovery
→ close Brain
→ one Orchestrator child (intent=deliver)
→ controller-action loop
   ├─ jira-call → Primary → result → Orchestrator
   └─ dispatch-specialist → Primary → specialist → cleanup/close → result → Orchestrator
→ Orchestrator terminal reconciliation
→ close Orchestrator
→ Brain acceptance
```

No confirmation gate after Jira planning unless a real unresolved authority/blocker exists.

## Planning-only sequence

```text
$frontend-planning
→ Brain analysis
→ close Brain
→ one Orchestrator child (intent=plan-only)
→ jira-call controller-action loop
→ confirmed Jira graph
→ close Orchestrator
→ STOP
```

## Resume

1. Resolve current Jira Subtask.
2. Verify relevant docs have not materially changed since baseline.
3. Load Feature + parent Task + current Subtask + direct dependencies + routed capability identifiers + latest durable checkpoint/result.
4. Validate routing against cheap current source/config evidence.
5. Spawn one Orchestrator child and execute only the required specialist through the Primary Controller action loop.

## Pause

1. Primary Controller recognizes natural-language pause intent and stops new specialist dispatch.
2. Primary Controller collects/cleans active specialist runtime state and supplies proven evidence to Orchestrator.
3. Orchestrator decides missing `[RESULT]`/status/HANDOFF Jira operations and returns exact `jira-call` actions.
4. Primary Controller executes the Jira calls and returns confirmations to the same Orchestrator child.
5. Return `paused` only after Jira persistence and runtime cleanup succeed; otherwise `pause-blocked` or `runtime-cleanup-blocked`.
6. Close/verify Orchestrator before reporting the workflow safely paused.

Custom-agent TOMLs intentionally omit Jira/native-dispatch configuration for Orchestrator. Runtime transport is owned by the Primary Controller/session; specialist-specific external capabilities must already be connected and authorized.
