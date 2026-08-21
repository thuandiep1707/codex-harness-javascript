# Generated UI Validation

Load this rule only when UI is generated or substantially reconstructed from developer-approved
design/provider evidence. A shadcn CLI operation alone does not trigger it.

This file is a final evidence index, not a competing policy source. The Coding baseline and triggered
topic rules remain normative.

## Validation manifest

Before reporting completion, identify:

- approved design/provider evidence and relevant screen/state references;
- implementation files and direct consumers;
- topic rules triggered by the current Subtask;
- approved scope/exceptions;
- unresolved dependent areas.

A missing required evidence item is not permission to assume the topic passed.

## Validate through topic owners

For every applicable topic report `pass`, `unresolved`, or `not-applicable` with evidence:

- **Atomic:** decomposition, reuse, ownership, public contracts, custom-atom approvals.
- **Assets:** icon/image source mapping, ownership, accessibility, Next Image metadata.
- **Semantics:** controls/navigation, landmarks, headings, labels/names/ARIA, table handling.
- **Styling:** existing variants/tokens/utilities, provider-value mapping, fluid layout, approved exceptions.
- **React runtime:** Server/Client/state ownership, effects, abstraction approvals, browser/runtime boundaries.
- **Async states:** exact loading/error/empty/pending state inventory and approved patterns.

Do not duplicate the full policy of those owner rules here.

## Provider evidence integrity

Confirm that:

- provider HTML/JSX/CSS/SVG/source remained design evidence rather than copied implementation authority;
- each implemented responsibility maps to approved local components/tokens/assets/contracts or is
  explicitly unresolved;
- provider output did not establish package, folder, architecture, responsive, accessibility,
runtime, or design-system conventions;
- placement follows product-repository ownership instead of provider file structure;
- changed source/config/assets remain inside the assigned Subtask scope;
- direct consumers and material states were inspected.

## Repository validation

Use the validation matrix in `../frontend-coding.md` and the commands required by the handoff/current
repository. Record results and reasons for skipped required checks. Do not weaken configuration,
hide warnings, or edit unrelated source to make validation pass.

A material deviation from the assigned Jira Subtask/design/architecture evidence must return to
Orchestrator as revision/blocker; do not create a local approval plan.

## Automation boundary

Use existing Prettier, ESLint, TypeScript, build, and approved test tooling. Do not add a custom lint
plugin, validation script, CI workflow, or dependency merely to enforce this prose rule. Route any
future automation proposal through an explicit Jira Task/developer decision.
