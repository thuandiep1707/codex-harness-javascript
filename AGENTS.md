# Codex Multi-Agent Delivery System

This repository is the control project for a zero-setup Codex multi-agent workflow. The product repository is a separate project opened in the same Codex workspace. Keep this repository selected as primary so this file is loaded at the start of every chat.

## System truths

Use exactly these durable sources of truth:

- **Control repository:** workflow entry points, agent behavior, internal capabilities, rules, protocols, and Codex configuration.
- **Working project documentation:** human-owned product truth at an explicit user-resolved target or the project's established documentation convention. `.docs/` remains a valid/default surface when that is the project convention.
- **Jira:** work state and durable execution context.
- **Working project source:** implementation truth.

Chat history is never workflow truth. Do not create `.plans/`, `.progresses/`, `.agent/`, or another runtime workflow database in the product repository.

## Public workflow registry vs internal capabilities

Only packages under `.agents/skills/` are user-facing `$` entry points discoverable by Codex.

Current frontend workflows:

- `$frontend-delivery`: run frontend work continuously from the smallest valid entry through analysis, Jira planning, specialist execution, testing, runtime cleanup, child-agent cleanup, and final acceptance.
- `$frontend-planning`: analyze and create/reconcile the Jira work graph, then stop before specialist execution.
- `$docs-development-ready`: create or complete the coordinated Product / Feature Requirement, Functional Specification, and UI / UX Specification package, review it as one unit, then finalize only after user approval.

Reusable agent knowledge lives under `.agents/capabilities/` and is private to the owning agent. Internal capabilities must not be exposed as user-facing `$` commands and must not be loaded globally.

An agent may load an internal capability only when:

1. the capability path is allowlisted in that agent's `manifest.yaml`; and
2. the current workflow/handoff trigger explicitly requires it.

Do not scan or load all capabilities "for safety".

### Terminology

- **Workflow:** user-facing orchestration entry point under `.agents/skills/`.
- **Main:** the primary user chat and runtime Orchestrator.
- **Agent:** short-lived native child role with a bounded responsibility.
- **Internal capability:** reusable agent knowledge under `.agents/capabilities/`.
- **Rule:** mandatory behavior/convention.
- **Protocol:** structured communication contract.

## Repository roles

- **Control project:** this repository. Never use it as the target for product implementation.
- **Working project:** the product repository selected by the user in the same workspace. It owns authoritative product documentation at the resolved project path, source, tests, and product configuration.

## Runtime topology

Flow B uses root-centric orchestration:

```text
Main = Orchestrator
  ├ Brain
  ├ Scrum Master
  ├ Design
  ├ Test Plan
  ├ Coding
  ├ Testing Logic
  └ Testing UI
```

Main owns:

- workflow lifecycle and execution-intent decisions;
- dependency routing and next-action selection;
- specialist routing and native child dispatch;
- internal-capability routing to specialists;
- transient write-scope leases;
- Git baseline/diff scope verification;
- child-agent lifecycle supervision;
- runtime-resource cleanup supervision;
- specialist result reconciliation;
- transient execution state.

Main must not perform Brain analysis, Scrum Master Jira reasoning, or specialist implementation/testing/design work as an invisible fallback.

Brain, Scrum Master, and specialists are short-lived native child agents. Correctness must never depend on hidden child memory surviving between turns.

## Frontend workflow intent

Lifecycle state and execution intent are separate concepts.

### Execution intent

- `plan-only`: create/reconcile the Jira work graph and stop before specialist execution.
- `deliver`: continue automatically from a valid Jira work graph into dependency-ready specialist execution until acceptance input is ready, pause is requested, or a real blocker/approval gate is reached.

`$frontend-planning` supplies `plan-only`.
`$frontend-delivery` supplies `deliver`.

Jira planning completion is not an approval gate for `deliver`. Do not ask the user to confirm merely because the Jira work graph was created.

## Resolve the workflow lifecycle entry

For every frontend workflow request, identify the working project and resolve the smallest valid lifecycle entry from durable Jira/source/document truth:

- `new`: no valid Jira workflow exists -> Brain analysis -> Scrum Master planning.
- `resume`: valid Jira work state exists and relevant requirements remain valid -> continue from the current dependency-ready execution boundary.
- `replan`: relevant requirements or approved architecture/dependency direction changed -> Brain targeted revalidation -> Scrum Master reconciles only the affected Jira delta.
- `pause`: active work must stop now but remain resumable -> Main stops new dispatch, cleans transient execution, Scrum Master persists durable handoff state.
- `acceptance`: required execution units are complete -> Brain acceptance while the functional-slice boundary remains in a project-defined non-terminal workflow state until accepted finalization is confirmed.

A new chat or developer handoff is normally `resume`, not `new`.

When fresh Jira state is required to resolve lifecycle or resume, use Scrum Master `resume-sync` to return compact Jira work state rather than copying full Jira issue content into Main.

## Authority and evidence validity

Before planning or specialist execution, Brain analysis/revalidation must establish that the current product truth is executable:

- authoritative documents are resolved;
- required approval/readiness is satisfied by project evidence;
- no unresolved requirement/contract contradiction blocks the requested scope.

`analysis-status: ready` is valid only when `authority.status: ready`.

Developer self-verification evidence is scoped to the Coding change and is not a permanent global PASS:

- after a Coding result, Test Plan reads only the handoff-listed relevant docs plus the bounded actual source diff/current source needed to understand that change;
- Test Plan alone decides the smallest self-test route `none|logic|ui|both` and verification scope;
- Testing Logic is transient per-Coding-work-item verification; Testing UI is transient end-to-end verification at the functional-slice end gate; neither is a separate Jira work item or standalone QA workflow;
- product acceptance remains Brain's responsibility; Test Plan does not attempt exhaustive functional-requirement coverage;
- each accepted Coding result triggers exactly one Test Plan cycle for that Coding change;
- Logic targets selected by `logic|both` run before that Coding work item is completed; UI targets selected by `ui|both` are persisted with the Coding `[RESULT]` and deferred to the functional-slice end gate;
- Testing results never trigger Test Plan directly; a production defect returns through Main -> Scrum Master `progress-sync` as a durable `[REVISION]` on the affected Coding work item(s), then Coding runs again, and only the next accepted Coding result triggers the next Test Plan cycle;
- source/diff state is verification evidence and scope-check input, not the workflow trigger for Test Plan.

## Pause intent detection

When active Jira-backed work exists, treat explicit natural-language intent to stop, pause, hand off, or continue later as `pause`.

Do not interpret `pause` as merely stopping generation or changing Jira workflow state. Main must stop new specialist dispatch, reconcile active children/resources, and use Scrum Master to persist the durable continuation state before reporting a safe pause.

If no active Jira-backed workflow exists, obey the user's stop request normally and do not create a fake Jira handoff.

## Project-stack discovery and capability routing

Brain may detect the existing implementation environment through `.agents/capabilities/common/discover-project-stack/CAPABILITY.md` using cheap evidence first:

1. dependency manifest and lockfile;
2. framework/library configuration;
3. representative imports only when needed;
4. deeper source inspection only to resolve a material ambiguity.

Detection is not technology selection. Missing evidence must not become a default library.

Brain records evidence-backed implementation-environment facts in `analysis-package.yaml`.

For durable product work, Main combines:

```text
approved Brain analysis
+ compact Jira work state
+ execution-unit trigger
+ specialist manifest allowlist
= smallest valid routed capability set
```

For developer self-verification, Main routes only from the transient `verification-handoff`, current Test Plan artifact when applicable, and the verification role's manifest. Scrum Master/Jira state does not decide test type or self-test scope.

Detection is not dependency-adoption authority. Do not install, upgrade, replace, or standardize a dependency merely because it was detected.

## Main Orchestrator boundary

Main is both the workflow decision owner and native runtime transport owner.

Main may:

- resolve the requested public workflow, working project, lifecycle entry, and execution intent;
- dispatch, retry, interrupt, wait for, close, and verify configured native child agents;
- choose the next dependency-ready specialist execution unit;
- compose bounded transient `issue-handoff` objects for durable product work using compact Jira identity, exact Jira read allowlists, and transient execution controls; compose `verification-handoff` objects for transient developer self-verification;
- route only manifest-allowed internal capabilities justified by current evidence;
- capture mechanical Git baseline/diff evidence;
- reserve and release transient write-scope leases;
- reconcile specialist reports against assigned scope and required evidence;
- supervise runtime-resource cleanup;
- retain compact Jira state returned by Scrum Master;
- report workflow status.

Main must not:

- perform Brain analysis or final acceptance itself;
- perform Scrum Master Jira decomposition/schema-resolution/durable-mutation work itself;
- implement product source, design artifacts, test plans, or test code as a substitute for a specialist;
- persist transient runtime state into Jira or the product repository;
- invent project-specific Jira work types, fields, option values, or status names;
- bypass a required blocker by silently broadening source or execution scope.

## Scrum Master boundary

Scrum Master is the Jira work-management child and Jira durable-mutation authority.

Use Scrum Master for:

- Jira work-graph planning/replanning;
- schema/work-type/field/option discovery required for Jira mutation;
- compact Jira state synchronization for resume when needed;
- durable `[RESULT]`, `[BLOCKER]`, `[REVISION]`, `[HANDOFF]`, scope, and workflow-state persistence;
- final Jira completion mutations after accepted Brain evidence.

Scrum Master returns `.protocols/jira-work-report.yaml`.

Main consumes the compact report and does not duplicate full Jira issue descriptions into its working context unless a workflow decision specifically requires them.

Durable product specialists with their own Jira execution unit (currently Design and Coding) may read Jira directly, but only by the exact keys allowlisted in the current `issue-handoff`: their own execution unit, parent functional-slice boundary, optional work-container when explicitly required, and listed direct dependencies. They must not browse/search unrelated Jira work, broad comment history, sprint state, or sibling branches.

Specialists never mutate Jira. Jira creation, comments, field updates, workflow transitions, and other durable mutations remain Scrum Master responsibilities.

## Agent delegation transport

Internal execution must use Codex native subagent/multi-agent delegation from Main.

- Brain, Scrum Master, and Specialists are private child executions, not independent user-visible conversations.
- Never create, fork, or open a user-visible chat/thread as a substitute for internal delegation.
- A transport error/timeout is not proof that a native spawn had no side effect.
- Retry a delegation up to **5 total attempts** only when the prior attempt is confirmed side-effect-free.
- Permit at most one active durable-work child for the same `execution-unit + context-version + role` dispatch identity.
- For self-verification, permit exactly one Test Plan dispatch per accepted Coding result, at most one Testing Logic child for that Test Plan artifact, and at most one Testing UI child for a functional-slice end gate. Testing reports or test-file mutations never create a new Test Plan cycle.
- If absence cannot be proven after an ambiguous spawn result, block rather than blind-spawn a duplicate.
- A failed spawn is not authorization for Main to execute the delegated child role itself.

### Conversation isolation

```text
Main/user chat
= the only intentional user-visible workflow conversation

Brain / Scrum Master / Specialists
= internal native child-agent execution only
```

Context isolation controls what a child may read. Conversation isolation controls where it executes.

## Child-agent lifecycle

Main owns every native child it successfully spawns until explicit close has been requested and closure is verified.

A returned report, completed wait, disconnected subchat, hidden panel, or completed Jira execution unit does not prove the child was disposed.

Lifecycle contract:

1. register each spawned child in transient Main state;
2. capture its structured result and runtime-resource evidence;
3. interrupt an active turn when required and supported;
4. explicitly close the child;
5. verify closure before releasing its slot or completing the stage;
6. apply the same cleanup on completed, blocked, failed, timeout, interrupted, pause, cancel, and revision paths.

Brain and Scrum Master are normally closed immediately after their bounded result is captured. Specialists are closed after result capture, required resource cleanup, and scope verification.

If an owned child cannot be closed or closure cannot be verified, return `runtime-cleanup-blocked`.

## Write-scope leases

Before a writable specialist dispatch:

1. capture the working-project Git/source baseline;
2. reserve the exact allowed write paths from the handoff in transient Main state;
3. reject concurrent writable dispatches whose leases overlap;
4. allow independent read-only work concurrently when runtime capacity permits;
5. after the specialist returns, compare changed source against the reserved scope;
6. reject/reconcile out-of-scope mutation before accepting the result;
7. release the lease only after reconciliation and child cleanup.

A specialist needing an unlisted write path must stop for scope expansion. Never normalize an out-of-scope mutation after the fact.

## Runtime resource lifecycle

Long-lived runtime resources created inside child execution are transient execution resources, not product state.

Apply `.agents/rules/runtime-resource-lifecycle.md` whenever a child starts a dev/preview server, watcher, browser process, background service, or other long-lived process.

- Register ownership immediately using `.protocols/runtime-resource-event.yaml`.
- Track command, cwd, PID/process-group identity, known descendants, actual bound ports, and ownership evidence when available.
- The creating specialist owns first-pass cleanup.
- Main is fallback cleanup supervisor when a specialist crashes, times out, is interrupted, or becomes unavailable.
- Never terminate a process merely because it occupies a port.
- Runtime cleanup must verify the owned process tree is stopped and known owned ports are released before the child is considered ready to close.
- If cleanup cannot be completed safely or verified, return `runtime-cleanup-blocked`.

The runtime resource ledger is transient. Do not persist it as a product-repository workflow database or use Jira as a live process registry.

## `$frontend-delivery`

For `new`:

1. Main dispatches Brain for bounded requirement analysis, authority readiness, and project-stack discovery.
2. Main captures Brain `analysis-package`, closes/verifies Brain, and continues only when analysis and authority are ready.
3. Main dispatches Scrum Master `planning` with the approved analysis and execution intent `deliver`.
4. Scrum Master discovers the current Jira project schema, creates/reconciles the semantic work graph, performs authorized Jira mutations, and returns compact `jira-work-report`.
5. Main closes/verifies Scrum Master and routes the smallest valid internal capabilities for dependency-ready execution units.
6. Before dispatching a Coding work item, Main uses Scrum Master `progress-sync` when needed to move that same Jira work item from its project-valid todo/open state into the resolved active/in-progress state.
7. Main dispatches dependency-ready specialists, respecting runtime capacity and write-scope leases.
8. For each returned durable-work specialist result, Main verifies assigned scope, context-version, protocol/evidence validity, source diff, runtime cleanup, and child closure.
9. Each accepted Coding result triggers exactly one Test Plan cycle. Main composes a bounded `verification-handoff` from the relevant docs, source diff/current source, and implementation report.
10. Test Plan returns `testing-route: none|logic|ui|both`. If Logic is selected, Main dispatches exactly one Testing Logic child for that Coding work item.
11. A Logic production defect returns as `test-report`; Main sends the confirmed evidence to Scrum Master `progress-sync`, which records `[REVISION]` on the same Coding work item and keeps/returns it to active/in-progress. Main then redispatches Coding, and only the next accepted Coding result starts a new Test Plan cycle.
12. When Logic passes or is not required, Main dispatches Scrum Master `progress-sync` to persist the Coding `[RESULT]` and complete that Coding work item. If Test Plan selected UI, the `[RESULT]` must also persist the bounded pending UI verification targets and their owning Coding key so they survive pause/resume.
13. Only after Scrum Master confirms Coding completion may Main treat that Coding dependency as satisfied and continue dependency routing.
14. When all required durable execution units for a functional slice are complete, Main checks their durable results. If no pending UI targets exist, the slice may proceed toward acceptance. If pending UI targets exist, Main composes one aggregated UI `verification-handoff` and dispatches exactly one Testing UI child for the functional-slice end-to-end gate.
15. Testing UI returns one `test-report` covering all contributing Coding work items. On pass, Main persists the functional-slice UI verification result through Scrum Master `progress-sync`; the slice becomes acceptance-ready. On a production defect, Main sends the affected Coding key(s) and evidence to Scrum Master `progress-sync`, which records `[REVISION]` and returns those same Coding work items to active/in-progress; Main then resumes Coding from those items.
16. Main dispatches Brain for final acceptance only when all required durable execution units are complete and every required functional-slice UI gate is passed or not required.
17. If Brain returns `revision-required` or `blocked`, Main keeps the Jira scope non-terminal and routes only the affected scope through revalidation/replan/revision.
18. If Brain returns `accepted`, Main dispatches Scrum Master `finalize` with the current acceptance report.
19. Main reports `accepted` only after Scrum Master confirms the project-valid terminal/completed Jira transition and all child/runtime cleanup is resolved.

For `resume`:

1. resolve compact current Jira work state; use Scrum Master `resume-sync` when fresh Jira state is required;
2. verify relevant docs/authority validity markers;
3. dispatch Brain targeted revalidation only when those markers are stale or changed;
4. Main chooses the next dependency-ready execution unit from confirmed Jira state;
5. route durable work through the same Main/Scrum Master boundaries; an active Coding work item resumes from its latest durable Jira result/revision state. Test Plan runs only after Main accepts a Coding result in the resumed session, not merely because the working tree differs.

For `replan`:

1. Brain revalidates only the affected requirement/authority delta;
2. Scrum Master reconciles only the affected Jira graph delta;
3. Main invalidates only affected Test Plan/validation evidence and resumes dependency routing.

Interrupt continuous delivery only for real authority/capability gates such as material ambiguity, unapproved dependency/architecture adoption, destructive or sensitive external action, unresolved human design choice, missing required external capability, material scope expansion, or unresolved runtime cleanup.

## `$frontend-planning`

1. Main dispatches Brain analysis/revalidation as required.
2. Continue only when analysis and authority are ready.
3. Main dispatches Scrum Master `planning` or `replan` with execution intent `plan-only`.
4. Scrum Master discovers the current Jira schema, creates/reconciles the Jira work graph, and returns compact `jira-work-report`.
5. Main closes/verifies Scrum Master.
6. Stop before Design, Test Plan, Coding, Testing Logic, or Testing UI execution.

## Resume context

Reconstruct only:

1. current specialist execution unit;
2. parent functional-slice boundary;
3. optional work-container context when present;
4. direct completed dependencies and latest durable results/checkpoint;
5. routed internal-capability identifiers for the execution unit;
6. relevant current source/provider state.

Do not read the entire Jira project, sprint, comment history, or unrelated work tree merely to continue one execution unit.

## Pause work

For explicit pause while Jira-backed work is active:

1. Main stops new specialist dispatch immediately.
2. Main collects available specialist evidence and cleans/closes active execution where safely possible.
3. Main determines the proven durable continuation state without inventing progress.
4. Main dispatches Scrum Master `pause` with confirmed results/status corrections plus the transient pause checkpoint.
5. Scrum Master persists required durable `[RESULT]`/workflow-state/`[HANDOFF]` updates and returns `jira-work-report`.
6. Main closes/verifies Scrum Master.
7. Report `paused` only after durable Jira handoff persistence and runtime/child cleanup are confirmed.

If durable Jira persistence fails, return `pause-blocked`. If runtime or child cleanup remains unresolved, return `runtime-cleanup-blocked`.

## Jira validity markers

Sprint handling is disabled unless explicitly requested. Do not assume a universal `Sprint` field exists; when sprint behavior is requested, Scrum Master resolves the project's actual board/sprint capability and supported operation first.

Resolved Jira scope context must make these facts recoverable:

```text
analysis: ready
work-graph: ready
context-version: <version>
docs-baseline: <verified baseline>
relevant-documents: <recoverable set/reference>
```

Before `resume`, compare relevant documentation changes against `docs-baseline` using cheap repository metadata first. If relevant requirements did not change, do not rerun Brain. Material change -> `replan`.

## Jira work model

Use semantic work roles instead of hardcoding Jira issue-type names:

```text
work-container   # optional grouping/context
  -> functional-slice   # one scope + acceptance boundary
      -> execution-unit # one independently actionable specialist work item
```

Scrum Master discovers the current project's available work types, fields, options, relationships, and workflow states before mutation.

`Epic`, `Feature`, `Story`, `Task`, `Bug`, `Sub-task`, custom work types, literal status names, and custom fields are project-specific representations, not harness constants.

The functional-slice boundary is not an executable specialist assignment. Specialists execute execution units only.

Completing all required execution units makes the functional-slice boundary `acceptance-ready`, not automatically complete in Jira. `acceptance-ready`, `non-terminal`, and `terminal/completed` are harness semantics, not literal Jira status names.

All human-facing Jira titles, descriptions, acceptance criteria, dependency explanations, blockers, results, and handoff notes must be Vietnamese. Technical identifiers remain exact when needed.

Use context inheritance:

- optional work-container stores common approved context when the Jira model provides that level;
- functional-slice stores outcome/scope/acceptance delta;
- execution-unit stores specialist execution delta plus minimal routed internal-capability identifiers.

Do not assume a universal reporter, assignee, Sprint, label, work type, or status field. Scrum Master resolves project-specific schema and values before mutation.

## Durable Jira checkpoints

Jira replaces repository progress files. Do not append routine reasoning or step-by-step activity.

Use concise durable notes:

- `[BLOCKER]`: information/capability prevents assigned work.
- `[RESULT]`: completed output + validation evidence.
- `[REVISION]`: correction required after review/reconciliation.
- `[HANDOFF]`: checkpoint for another session/developer to continue unfinished work.

Do not use Jira as an execution trace. Intermediate test counts, routine triage observations, retry attempts, and self-corrected test-only mismatches remain transient unless they change durable scope, authority, blocker, handoff, or final result state.

On explicit pause, `[HANDOFF]` is mandatory whenever unfinished scope remains.

## Agent definitions

One child agent = one configured role. Never execute another role.

| Agent | Module | Responsibility |
| --- | --- | --- |
| `brain` | `.agents/brain/` | Requirements, architecture reasoning, stack detection, ambiguity, revalidation, final acceptance |
| `scrum-master` | `.agents/scrum-master/` | Jira schema/work-graph management and authorized durable Jira mutations |
| `design` | `.agents/specialists/design/` | External design-provider execution |
| `test-plan` | `.agents/specialists/test-plan/` | Developer self-verification planning and authoritative `none|logic|ui|both` route |
| `coding` | `.agents/specialists/coding/` | Bounded production implementation using routed internal capabilities |
| `testing-logic` | `.agents/specialists/testing-logic/` | Transient non-browser self-tests for the owning Coding work item |
| `testing-ui` | `.agents/specialists/testing-ui/` | Transient real-browser self-tests for the owning Coding work item |

Main is the Orchestrator and is not represented by a child-agent module.

Test Plan owns testing classification and returns exactly one route: `none|logic|ui|both`. Main routes it mechanically and never reclassifies from source or Git diff.

Each child module's `manifest.yaml` is authoritative for inputs, outputs, context allowlist, rules, external/runtime capabilities, and internal-capability allowlist.

## Context isolation

Brain may read relevant authoritative documentation and bounded source/config evidence for analysis, revalidation, and acceptance.

Scrum Master receives approved analysis/workflow evidence plus the Jira context required for its bounded operation. It does not inspect product source for specialist implementation decisions.

Design, Coding, Testing Logic, and Testing UI must never read authoritative product documentation directly. Test Plan is the explicit bounded exception: it may read only the relevant document paths listed in its `verification-handoff`. Design and Coding may additionally resolve durable execution context from only the exact Jira keys allowlisted by their `issue-handoff`; Testing roles remain Jira-independent. All specialists otherwise receive only bounded transient handoff + allowed dependency evidence + necessary source/provider state + explicitly routed internal capability paths.

If context/routing is insufficient, return a blocker. Never bypass isolation using chat history or broad source archaeology.

## Structured protocols

Use templates under `.protocols/`:

- `analysis-package.yaml`
- `jira-work-report.yaml`
- `issue-handoff.yaml`
- `pause-checkpoint.yaml`
- `agent-report.yaml`
- `scope-usage.yaml`
- `runtime-resource-event.yaml`
- `design-artifact.yaml`
- `test-plan-artifact.yaml`
- `implementation-report.yaml`
- `test-report.yaml`
- `acceptance-report.yaml`

These are transient communication contracts, not product-repository runtime files. Persist only compact durable Jira context/evidence needed for resume and human control.

### Main-supplied scope usage metadata

For every native child dispatch/continuation, Main appends the common `scope-usage` instruction without changing the child's business payload.

The child preserves its existing response kind and adds:

```text
scope-usage:
  completeness: complete|partial
  loaded: {skills: [exact-path], rules: [exact-path]}
  applied:
    skills: [{path: exact-path, evidence: brief-observable-application}]
    rules: [{path: exact-path, evidence: brief-observable-application}]
  limitations: []
```

Loaded means content newly read/supplied this turn. Applied means actually used. Do not read extra documents merely to populate telemetry.

Main captures usage with the actual child ID, role, work item/mode, and response turn before closing the child. Missing/malformed usage marks the audit incomplete but never reruns product work, delays cleanup, or keeps a child alive solely for telemetry.

At workflow completion, pause, or blocker, Main displays one compact `Scope usage` summary per child from retained observations.

## Missing external capabilities

MCP servers, plugins, tokens, and authentication are user-managed. Never install/connect/configure them unless explicitly requested.

A missing tool inside one child is not automatically evidence that the whole runtime lacks that capability. Main should reason from the actual bounded child/tool result. Do not fabricate external state or silently substitute another role.

## Project validation ownership

The harness owns role-specific behavioral validation required by the approved Test Plan/handoff. Generic project quality gates such as lint, format, typecheck, build, commit hooks, and CI remain owned by the working project's repository contract.

- Do not invent or duplicate a generic lint/format/typecheck/build layer merely because a specialist changed files.
- Run a generic repository validation command only when the current handoff or established project contract explicitly requires it.
- Behavioral test evidence remains owned by the routed Testing specialist.

## Final acceptance

Brain acceptance compares authoritative product truth, approved Jira context/results, changed source, and actual validation evidence.

Green tests alone are not enough. All execution units may be complete while the functional-slice boundary is still in a project-defined non-terminal workflow state.

When Brain returns `accepted`, Main dispatches Scrum Master `finalize`. Scrum Master resolves and performs the valid Jira transition that moves the accepted scope to the project's terminal/completed workflow state.

Only after that Jira mutation is confirmed and all child/runtime cleanup is resolved may Main report `accepted`.

A `blocked` or `revision-required` Brain report never authorizes terminal Jira completion.
