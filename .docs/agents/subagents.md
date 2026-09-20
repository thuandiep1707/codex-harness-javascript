# Agent runtime map

## Migration baseline

This branch defines the Flow B runtime topology. It changes orchestration placement only.

Existing safety, scope, validation, cleanup, authority, and capability-routing boundaries remain in force unless a later migration commit changes topology-specific wording explicitly.

## Public workflow entry points

| Workflow | Execution intent | Result |
| --- | --- | --- |
| `$frontend-delivery` | `deliver` | Continue end-to-end until acceptance/pause/blocker |
| `$frontend-planning` | `plan-only` | Create/reconcile Jira work graph then stop |

Lifecycle state remains separate from execution intent.

## Runtime roles

| Role | Codex agent | Responsibility |
| --- | --- | --- |
| Main Orchestrator | main chat | Own workflow decisions, dependency routing, specialist dispatch, native child lifecycle, write-scope leases, runtime cleanup supervision, and transient execution state |
| Brain | `brain` | Analyze authoritative product context, detect implementation environment, targeted revalidation, and final acceptance |
| Scrum Master | `scrum-master` | Create/reconcile Jira work graph and perform authorized durable Jira mutations; return compact Jira work state to Main |
| Design | `design` | Use connected design provider and return design evidence |
| Test plan | `test-plan` | Transiently decide the smallest developer self-verification route/scope for a Coding change from bounded relevant docs + actual source diff |
| Coding | `coding` | Implement one bounded durable Coding execution unit using routed internal capabilities |
| Testing Logic | `testing-logic` | Transient per-Coding-work-item non-browser self-test gate selected by Test Plan |
| Testing UI | `testing-ui` | Transient end-to-end real-browser gate for the functional slice using deferred UI targets |

There is no Orchestrator child in Flow B. The main chat is the Orchestrator.

Brain, Scrum Master, and specialists are short-lived native child agents. Chat history is never durable workflow truth.

## Main orchestration loop

Main owns the decision and runtime transport directly:

```text
Main
→ dispatch bounded child
→ child executes assigned role
→ child returns structured result
→ Main verifies result / cleanup / scope
→ Main selects the next dependency-ready action
```

Main must not perform specialist implementation work itself.

Independent specialist work may run concurrently only when existing runtime-capacity and write-scope rules allow it.

## Jira ownership

Scrum Master is the Jira write authority for workflow structure and durable workflow updates.

Specialists do not access Jira directly in the current Flow B contract. Scrum Master owns Jira reads/mutations and Main supplies specialists only the bounded Jira-derived handoff/evidence required for execution.

Main should retain only compact Jira execution state needed for routing, such as issue keys, dependencies, statuses, context version, and target role. Full Jira issue content should not be copied into Main unless a workflow decision specifically requires it.

## Internal capability model

Internal capabilities live under `.agents/capabilities/**`, outside Codex public workflow discovery.

Brain may detect current framework/UI/icon/state/testing evidence. Main combines approved analysis, current Jira work state, execution-unit trigger, and specialist manifest to select the smallest valid capability set.

Specialist rule:

```text
manifest allowlist
∩ routed internal-capabilities
= capabilities allowed to load
```

Missing/conflicting project evidence remains unresolved; do not invent a default dependency or library.

## Jira work model

```text
work-container   # optional grouping/context
  -> functional-slice   # scope + acceptance boundary
      -> execution-unit # specialist-owned executable work
```

These are harness semantics, not Jira issue-type names. Scrum Master discovers the current project's work types, fields, options, relationships, and workflow states, then maps the semantic work model to what that project actually supports.

Functional slices remain scope/acceptance boundaries. Durable product specialists such as Design/Coding execute Jira execution units.

Test Plan and Testing Logic are transiently attached to an owning Coding work item; Testing UI is a transient functional-slice end gate aggregating UI targets from completed Coding work items. None of them is a separate Jira work item or expands the durable work graph.

Scrum Master creates or reconciles the Jira graph. Main decides execution order from confirmed Jira work state and dependency readiness.

## Context boundary

Brain may read authoritative documentation plus bounded source/config evidence required for analysis, revalidation, and acceptance.

Scrum Master receives the approved analysis/workflow request necessary to create or reconcile Jira state and returns a compact Jira work report.

Design/Coding remain bounded by their durable issue handoff. Test Plan is the explicit exception to the normal specialist document boundary: it may read only the relevant product documents listed in its transient verification handoff plus the bounded actual source diff/current source needed to plan self-verification. Testing Logic/UI do not read product docs and consume Test Plan's bounded targets. No specialist may use chat history as requirement truth.

## Delivery sequence

```text
$frontend-delivery
→ Main resolves lifecycle entry
→ Brain analysis/revalidation when required
→ close Brain
→ Scrum Master creates/reconciles Jira work graph
→ close Scrum Master
→ Main dispatches dependency-ready durable product work
   ├─ Coding
   └─ Design
→ after each accepted Coding result: transient Test Plan
→ Logic target: Testing Logic now, per Coding work item
→ UI target: persist pending UI evidence with Coding result
→ after all durable work in slice: one end-to-end Testing UI gate
→ production defect -> `[REVISION]` on affected existing Coding work item(s)
→ Main verifies reports, source scope, runtime cleanup, and child closure
→ Scrum Master persists only final durable Coding result/blocker/revision/checkpoint when needed
→ close Scrum Master
→ Brain acceptance
→ close Brain
→ Scrum Master performs final authorized Jira finalization
→ close Scrum Master
→ Main reports terminal workflow state
```

No confirmation gate exists after Jira planning unless a real authority/blocker condition requires one.

## Planning-only sequence

```text
$frontend-planning
→ Main resolves lifecycle entry
→ Brain analysis/revalidation when required
→ close Brain
→ Scrum Master creates/reconciles Jira work graph
→ Main receives compact Jira work report
→ close Scrum Master
→ STOP
```

## Resume

1. Main resolves the current Jira-backed workflow state.
2. Verify relevant authority/docs baseline using existing validity rules.
3. Run targeted Brain revalidation only when required.
4. Use Scrum Master only when Jira graph reconciliation or durable Jira mutation is required.
5. Main dispatches only dependency-ready bounded specialist work.
6. Continue from durable Jira/source truth rather than hidden child memory.

## Pause

1. Main stops new specialist dispatch.
2. Main collects proven specialist/runtime state and performs required cleanup.
3. Scrum Master persists the required durable Jira result/handoff state.
4. Main reports `paused` only after Jira persistence and runtime cleanup are confirmed.

## Final acceptance

1. Main gathers only the approved Jira/results/source/validation evidence required by Brain acceptance.
2. Brain returns `accepted`, `revision-required`, or `blocked`.
3. Only an accepted Brain result authorizes Scrum Master to perform final Jira completion mutations.
4. Main reports completion only after those Jira mutations, child cleanup, and runtime cleanup are confirmed.

