# Frontend Task Graph

## Classify execution work

| Category | Include | Exclude |
| --- | --- | --- |
| Design | Provider discovery, Stitch/Figma interaction, variants, artifact inspection, design handoff | Production code, dependency adoption, test code |
| Frontend coding | Application code, components, state, integrations, migrations, approved dependency/source adoption | Unapproved visual decisions, independent test architecture |
| Testing | Test strategy, scenarios, fixtures, test code, runner execution, failure evidence | Production behavior changes |

Planning gates remain with the primary agent. A security or supply-chain audit may create controls
for a coding task, but it does not become an implementation packet by itself.

## Build dependencies

For each task record:

- stable task id;
- category and target agent;
- concrete output;
- prerequisite decisions, artifacts, contracts, or tasks;
- exact files or bounded directories;
- acceptance criteria;
- validation and return evidence.

## Execution waves

- **Wave 0 — planning:** docs intake, ownership, security, supply-chain, scope, and approval gates.
- **Wave 1 — independent preparation:** design-provider work, coding work that does not depend on a
  new design, and test-plan drafting after behavior is stable.
- **Wave 2 — dependent implementation:** design-dependent UI coding and test-code implementation
  against stable production contracts.
- **Wave 3 — reconciliation:** integration checks, full validation, documentation, and final report.

Parallelize only tasks with disjoint write surfaces or read-only work. If two tasks share a public
contract, make one produce the contract and the other depend on it.

## Completion rule

A task is complete only when its output exists, acceptance criteria are verified, required commands
have run, and its handoff contains enough evidence for the primary agent to reconcile it.
