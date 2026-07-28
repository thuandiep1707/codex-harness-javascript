# Generated UI Validation

Load this rule only when the canonical router in `../frontend-coding.md` matches UI generated or
substantially reconstructed from a developer-approved design/provider artifact. A shadcn CLI command
or generated primitive does not trigger this rule by itself.

This file is a final evidence index, not a competing policy source. The baseline and triggered topic
rules remain normative. A check passes only when the completion record cites inspected files,
searches, approvals, handoffs, commands, and results.

## Build the validation manifest

Record the approved artifact and relevant nodes/screens/states, implementation files and direct
consumers, every topic selected from the canonical router, specialized handoffs used, approved scope,
exceptions, and unresolved dependent areas. Missing manifest evidence is a failed validation, not
permission to assume a topic passed.

## Validate through normative owners

For each section below, record `pass`, `unresolved`, or `not-applicable`. The last result requires a
brief evidence-based reason. An unresolved result uses the shared record in `../frontend-coding.md`
and cannot be reported as completed dependent behavior.

### Discovery and ownership

Owner: `atomic-components.md`; add the decomposition map, repository searches, direct consumers,
Atomic/DDD placement, chosen API, reuse/composition result, and custom-atom approval. When exact
shadcn mechanics trigger, link the shadcn handoff containing source identity, local CLI/config,
previewed/applied files, dependencies, approval, and drift result.

### Component APIs

Owner: `atomic-components.md`; add evidence for atoms-layer placement, public variants/CVA,
`className`/`style`, children/slots/render props, semantic callbacks, presentation-oriented props, and
controlled/uncontrolled ownership. Reference the owner instead of copying its policy into this file.

### Icons, SVG, and images

Owner: `icons-images-assets.md`; add candidate/source assessment, selected or unresolved mapping,
asset owner, accessibility decision, and `next/image` alt, dimensions/`fill`, `sizes`, and quality
evidence. Record approvals and specialized-source exceptions.

### Semantics and accessibility

Owner: `semantics-accessibility.md`; add selected primitives, control/navigation and landmark
decisions, heading/label/name/ARIA relationships, table handling, and confirmation that built-in
keyboard and focus behavior remains intact.

### Styling and layout

Owner: `styling-layout.md`; add reused component/token/utility mappings, provider-CSS decisions,
unresolved values, variant class validation, fluid desktop behavior, approved exceptions, and targeted
inspection for arbitrary Tailwind or unauthorized inline styles.

### React state and runtime

Owner: `react-state-runtime.md`; add Server/Client and state-owner decisions, derived/effect evidence,
abstraction approvals, installed-document references, browser isolation, and dynamic-boundary
cost/fallback/validation evidence. Confirm that deferred data-flow policy was not inferred.

### Loading, error, and empty states

Owner: `async-states.md`; add the exact state inventory, matching approved patterns, route-boundary
decisions, unresolved visual requirements, and separated independent/dependent scope.

## Check provider-artifact integrity

- [ ] Provider HTML, JSX, CSS, SVG, source, dependencies, and naming remained design evidence rather than copied authority.
- [ ] Every implemented responsibility maps to an approved local component, token, utility, asset, contract, or unresolved decision.
- [ ] Provider output established no package, folder, architecture, responsive scope, accessibility pattern, runtime boundary, or design-system convention.
- [ ] Placement follows repository ownership rather than provider file structure.
- [ ] Changed files, dependencies, configuration, assets, and generated artifacts remain inside approved scope.
- [ ] Direct consumers and material states were inspected, not only the generated component in isolation.

## Run proportionate repository validation

Use the validation matrix in `../frontend-coding.md` and the approved plan. Record applicable
formatting, lint, typecheck, build, direct-consumer, approved-test, and final-diff checks with results.
Give a reason for every skip. Do not weaken configuration, hide warnings, or edit unrelated code to
make validation pass.

## Report gates and unresolved work

List approvals used, deviations, and each owner result once. Separate completed independent scope
from unresolved dependent scope. A material deviation returns to plan approval before implementation.

## Automation boundary

Use the repository's current Prettier, ESLint, TypeScript, build, and approved test tooling as
configured. This index does not claim that prose rules are automatically enforced.

Do not add a custom ESLint plugin, validation script, CI workflow, or dependency under this rule. Record repeated, objectively detectable violations as future automation candidates; automate them only through a separately approved plan whose maintenance cost is justified by repository evidence.
