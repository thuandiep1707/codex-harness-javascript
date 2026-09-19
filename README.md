# Codex Harness for JavaScript

[![Release](https://img.shields.io/github/v/release/thuandiep1707/codex-harness-javascript)](https://github.com/thuandiep1707/codex-harness-javascript/releases)
[![License](https://img.shields.io/github/license/thuandiep1707/codex-harness-javascript)](LICENSE)
[![GitHub Template](https://img.shields.io/badge/GitHub-Template-181717?logo=github)](https://github.com/thuandiep1707/codex-harness-javascript/generate)
[![JavaScript](https://img.shields.io/badge/JavaScript-Harness-F7DF1E?logo=javascript&logoColor=000)](https://github.com/thuandiep1707/codex-harness-javascript)

A workflow-driven multi-agent harness for OpenAI Codex that turns product docs and current source into Jira-backed planning, implementation, testing, pause/resume handoff, execution-resource cleanup, and final acceptance.

**Public workflows:** `$frontend-delivery` · `$frontend-planning` · `$docs-development-ready`

> This repository is a declarative control plane, not a standalone agent runtime. Codex provides the execution environment; this repository provides workflows, agent behavior, rules, protocols, lifecycle controls, and progressively loaded capability knowledge.

## Architecture Overview

<p align="center">
  <img
    src=".github/assets/architecture-overview.jpg"
    alt="Codex Harness for JavaScript architecture overview"
    width="100%"
  />
</p>

This overview shows how public workflows move through Brain, Orchestrator, Specialists, internal Capabilities, and Jira-backed durable state across the full delivery lifecycle.

## Why this exists

Long-running AI coding work becomes unreliable when important context lives only in chat history.

A session can end. A different developer may continue the work. Requirements can change after planning. Multiple specialists may need different context. A project may already use MUI, HeroUI, Radix, TanStack Query, Zustand, or another stack that should not be silently replaced by a hard-coded default. Child agents and dev/test servers can also outlive their intended task unless their lifecycle is explicitly managed.

This harness is built around five ideas:

- workflow state should survive chat sessions and developer handoffs;
- users should launch complete workflows, not dozens of internal skills;
- specialists should receive bounded context and load only the knowledge they need;
- existing project evidence should drive implementation routing instead of library assumptions;
- child agents and runtime resources should be explicitly cleaned up instead of relying on desktop/runtime garbage collection.

## What makes it different

| Principle | What it means |
| --- | --- |
| **Workflow-first interface** | Only complete user-facing workflows appear in the `$` picker. Internal capabilities stay private. |
| **Jira-backed execution context** | Jira stores durable work state, results, handoffs, and continuation context instead of relying on chat memory. |
| **Pause / Resume by design** | A natural-language pause request creates a durable handoff before the workflow stops. A later session resumes from the smallest valid Jira context. |
| **Progressive capability loading** | Agents load only routed capabilities for the current subtask instead of loading the whole knowledge base. |
| **Evidence-based stack discovery** | The harness inspects the existing project before routing UI, state, data, testing, or framework capabilities. |
| **Explicit execution cleanup** | Primary Controller owns native child-agent lifecycle; specialists clean runtime resources they create, with controller-level fallback supervision. |
| **Strict agent boundaries** | One child agent keeps one configured role: Brain reasons, Orchestrator owns workflow/Jira decisions and routing, Primary Controller owns runtime transport, and Specialists execute bounded work. |
| **Acceptance beyond green tests** | Completion requires final acceptance against authoritative docs, Jira context, source changes, validation evidence, clean execution resources, and confirmed post-acceptance Jira finalization. |

## Quick Start

### 1. Use the template or clone the repository

Use **Use this template** on GitHub, or clone the repository as your control project.

No runtime package needs to be installed for the harness itself.

### 2. Open the harness and your product project in the same workspace

```text
workspace/
├── codex-harness-javascript/   ← primary / control repo
└── your-product-project/       ← working repo
```

The control repo owns agent behavior. The product repo owns product docs and implementation source.

### 3. Provide the required external context

For the bundled frontend workflows:

- make authoritative product documentation available at the project's resolved or established documentation location; `.docs/` remains the supported default convention;
- make the current product source available in the same workspace;
- connect Jira so the harness can persist planning, execution state, results, pause handoffs, and resume context;
- connect optional design providers only when the requested work requires them.

The harness does not store credentials or silently install external integrations.

### 4. Launch a workflow

Documentation package:

```text
$docs-development-ready
Prepare the development-ready product, functional, and UI/UX specification package.
```

Planning only:

```text
$frontend-planning
Break the current recruitment scope into Jira work. Do not implement it yet.
```

End-to-end delivery:

```text
$frontend-delivery
Implement the recruitment scope from the approved product docs end-to-end.
```

`$frontend-delivery` does **not** stop just because Jira Tasks/Subtasks were created. It continues through dependency-ready specialist work, testing, reconciliation, runtime cleanup, child-agent closure, and final acceptance unless it reaches a real blocker, approval gate, or explicit pause.

## Example

```text
$frontend-delivery
Implement user management from the approved product docs.
```

The workflow resolves the current lifecycle entry and then coordinates the system:

```text
product docs + current source
        ↓
Brain
authority readiness
+ requirement analysis
+ project-stack discovery
        ↓
Orchestrator
Jira planning + specialist routing
        ↓
Test Plan
acceptance coverage
+ none | logic | ui | both
        ↓
Coding
        ↓
Testing Logic / Testing UI
        ↓
acceptance-ready
        ↓
Brain Acceptance
        ↓
Orchestrator Finalize
        ↓
Parent Task Done
```

If the work is interrupted:

```text
"pause here"
    ↓
stop new dispatch
    ↓
collect execution evidence
    ↓
clean owned runtime resources
    ↓
close active child agents
    ↓
reconcile Jira + persist [HANDOFF]
    ↓
paused
```

A later session can resume without depending on the previous chat transcript.

## Public Workflows

Only packages under `.agents/skills/` are user-facing workflow entry points.

| Workflow | Purpose |
| --- | --- |
| `$frontend-delivery` | Run frontend work end-to-end from authoritative docs/source through Jira planning, specialist execution, testing, cleanup, final acceptance, and Jira finalization. |
| `$frontend-planning` | Analyze the requested frontend scope, create the Jira Feature/Task/Subtask graph, and stop before implementation. |
| `$docs-development-ready` | Create or complete the coordinated Product / Feature Requirement, Functional Specification, and UI / UX Specification package, then finalize it after approval. |

Everything else is internal capability knowledge and should not appear in the `$` picker.

## How the Harness Works

### Truth model

```text
Control repo                  = Workflow + Agent Behavior Truth
Working project documentation = Product Truth
Jira                          = Work + Execution Context Truth
Product source                = Implementation Truth
```

Chat history is never workflow truth.

The product repository does not need a second hidden workflow database such as `.plans/`, `.progresses/`, or `.agent/` state folders.

### Execution intent and lifecycle are separate

```text
Execution intent
├── plan-only
└── deliver

Lifecycle entry
├── NEW
├── RESUME
├── REPLAN
├── PAUSE
└── ACCEPTANCE
```

Examples:

```text
$frontend-delivery + NEW
→ Brain → Jira planning → specialist execution → cleanup → Acceptance

$frontend-planning + NEW
→ Brain → Jira planning → STOP

$frontend-delivery + RESUME
→ reuse valid Jira context → continue the current executable Subtask
```

Planning is a lifecycle operation. It does not automatically mean the workflow should stop; the execution intent decides whether planning is the destination or only one stage of delivery.

## Progressive Capability Loading

Reusable knowledge lives under `.agents/capabilities/`, not in the public workflow registry.

Examples:

```text
.agents/capabilities/common/discover-project-stack/
.agents/capabilities/frontend/plan-frontend-work/
.agents/capabilities/frontend/shadcn/
.agents/capabilities/frontend/nextjs-tanstack-query/
.agents/capabilities/frontend/nextjs-state-management/
.agents/capabilities/frontend/testing/
```

An agent may load an internal capability only when:

1. the capability is allowed by that agent's manifest;
2. the Orchestrator routes it for the current specialist Subtask.

The system does not load every capability "just in case".

This keeps the public command surface small and the execution context focused even as the harness grows to more domains and libraries.

## Project Stack Discovery

Before implementation routing, Brain can use the internal `discover-project-stack` capability to inspect cheap evidence first:

```text
package.json / lockfile
        ↓
framework config
        ↓
UI / component config
        ↓
representative imports when needed
        ↓
deeper source only when evidence conflicts
```

It can detect evidence for areas such as:

```text
framework
UI library
icon library
styling system
client-state library
server-state library
test runner
package manager
```

For example, if a product already uses:

```text
@mui/material
@mui/icons-material
@tanstack/react-query
```

that evidence should drive capability routing. Coding should not silently switch the project to shadcn, Lucide, Zustand, or another library simply because the harness contains knowledge about it.

**Detection is not adoption.** Finding a package does not authorize installing, upgrading, replacing, or standardizing dependencies.

If the required project capability is not available, the workflow should surface a blocker instead of pretending a fallback is valid.

## Jira Work Model

```text
Feature Context
  └── Task: one Functional Slice
        └── Subtask: one independently actionable specialist work unit
```

The Orchestrator decomposes work by user outcome and functional boundary:

```text
requirement
→ user outcomes
→ functional slices
→ Tasks
→ specialist Subtasks
```

It does not start by splitting a feature into Design / Coding / Testing buckets or by file/component ownership.

Routine triage, diagnosis, retry, and test-only iteration stay inside the owning specialist lifecycle. They do not become new Jira Subtasks unless the discovered work is independently actionable and needs its own specialist ownership/scope.

Completing all executable Subtasks makes the parent Task `acceptance-ready`, not Done. Brain performs final acceptance first; only an accepted result followed by Orchestrator finalization may transition the parent Task to Done.

Context is inherited rather than duplicated:

- Feature stores common approved product and architecture context;
- Task stores the functional-slice delta;
- Subtask stores the specialist execution delta and routed capability identifiers;
- Specialist receives a transient handoff and does not independently rebuild full product context.

## Pause / Resume

Pause is a durable workflow checkpoint, not a simple `stop responding` command.

When the user expresses clear pause intent, the workflow coordinates runtime cleanup and durable Jira reconciliation:

```text
Primary Controller freezes new dispatch
→ collects available execution evidence
→ cleans specialist-owned runtime resources
→ closes and verifies active specialist children
→ Orchestrator reconciles confirmed state
→ requests missing RESULT/status/HANDOFF Jira actions
→ Primary Controller executes and confirms them
→ paused
```

A handoff records only continuation essentials such as source identity, completed scope, remaining scope, validation state, blockers, and the next Jira action.

If the durable checkpoint cannot be written, the harness reports `pause-blocked`. If known child agents or owned runtime resources cannot be safely cleaned and verified, it reports `runtime-cleanup-blocked` rather than claiming the workflow was safely paused.

## Execution Resource Lifecycle

A returned agent report is not the end of the execution lifecycle.

```text
spawn child
→ execute
→ capture result
→ clean owned runtime resources
→ close child
→ verify child closed
→ release slot / continue
```

Ownership is explicit:

- Primary Controller owns the native lifecycle of every spawned child agent;
- Orchestrator decides which specialist should run, but does not spawn, wait for, interrupt, or close child agents;
- specialists own first-pass cleanup for long-lived runtime resources they create;
- Primary Controller supervises cross-agent runtime cleanup and performs fallback cleanup when a specialist crashes or becomes unavailable, but only when ownership evidence is sufficient;
- Orchestrator consumes cleanup evidence for workflow decisions.

Runtime resource ownership can include command, working directory, PID/process group, known descendants, and actual bound ports. Port occupancy alone is never enough evidence to terminate a process. This prevents the harness from stopping a developer-managed server simply because it uses the same port.

Runtime-resource events and child/resource ledgers are transient control-plane evidence. They are not stored as product workflow files and Jira is not used as a live process registry.

## Agent Roles

| Agent | Responsibility |
| --- | --- |
| `brain` | Requirement reasoning, authority readiness, architecture analysis, project-stack discovery, revalidation, final acceptance |
| `orchestrator` | Jira planning/resume/pause/finalize decisions, dependency routing, capability selection, specialist coordination, and reconciliation |
| `design` | Bounded external design-provider execution |
| `test-plan` | Acceptance coverage and authoritative testing route: `none | logic | ui | both` |
| `coding` | Bounded production implementation using only routed capabilities |
| `testing-logic` | Unit/component/integration test work without a real browser |
| `testing-ui` | Playwright / real-browser UI validation and browser-test work |

Specialists do not own Jira mutation, do not read the full product truth independently, and do not expand their scope without returning a blocker to the Orchestrator. Test Plan owns testing classification; Orchestrator routes `none | logic | ui | both` mechanically rather than reclassifying from source or Git diff.

## Repository Structure

```text
codex-harness-javascript/
├── AGENTS.md
├── README.md
├── LICENSE
├── .agents/
│   ├── brain/
│   ├── orchestrator/
│   ├── specialists/
│   ├── rules/
│   ├── skills/                 # PUBLIC workflows only
│   │   ├── frontend-delivery/
│   │   └── frontend-planning/
│   └── capabilities/           # INTERNAL knowledge
│       ├── common/
│       └── frontend/
├── .protocols/
├── .codex/
└── .docs/                       # harness architecture / maintenance docs
```

For implementation-level rules and protocol details, start with [`AGENTS.md`](AGENTS.md) and the files under `.protocols/`.

## Inspect scope usage

Primary Controller supplies a common usage-report instruction with every child dispatch/continuation,
including new agent roles. No per-agent manifest or bootstrap registration is needed. Existing response
payloads retain their shape and add `scope-usage` using the shared
[metadata format](.protocols/scope-usage.yaml).

Each report covers one turn: `loaded` lists skill/rule content newly read or supplied, while `applied`
lists material used with brief evidence, including material loaded earlier. A path merely present in
an allowlist is not loaded content. Known-empty lists are `[]`; uncertainty is `partial` with limitations.

At completion, pause, or blocker, the controller displays a `Scope usage` summary in the main
conversation for each child: applied paths, observed loaded-but-not-applied candidates across retained
turns, and missing observations. Missing metadata does not rerun work or delay child cleanup.

This is a declarative reporting contract, not a runtime hook or token measurement. Self-reporting and
context loss limit completeness. Use the audit to investigate excess context, not to automatically
remove mandatory rules. See the controller contract in [AGENTS.md](AGENTS.md#controller-supplied-scope-usage-metadata).

## Roadmap

The core harness is intentionally domain-extensible. Planned directions include:

- `$backend-delivery` and `$backend-planning` workflows;
- backend, design, and DevOps capability families;
- more evidence-routed frontend capabilities such as MUI, HeroUI, Radix, and other project stacks;
- a machine-readable capability registry as the knowledge base grows;
- harness validation / doctor tooling;
- workflow-level evals for planning, delivery, pause/resume, replan, acceptance, and cleanup.

The goal is to grow the internal capability graph without turning the public `$` picker into a long list of implementation skills.

## Contributing

Issues and pull requests are welcome.

When extending the harness, keep the architecture boundary clear:

- add a **public workflow** only when it represents a complete user-facing orchestration entry point;
- add reusable implementation knowledge as an **internal capability**;
- keep specialist responsibilities bounded;
- prefer durable Jira/source evidence over chat-memory assumptions;
- clean child agents and owned runtime resources on every exit path;
- avoid hard-coding a project library when stack discovery can resolve it from evidence.

## License

MIT License © 2026 **thuandiep**. See [`LICENSE`](LICENSE).
