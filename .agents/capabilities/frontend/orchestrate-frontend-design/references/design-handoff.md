# Design handoff

Normalize provider responses into bounded design evidence for Orchestrator. This capability does not create a second workflow state, implementation plan, or downstream agent routing system.

## Required record

Return evidence compatible with `.protocols/design-artifact.yaml` and the assigned Jira Subtask. Preserve:

- provider/channel and stable project/session/artifact identifiers;
- artifact type/location/preview/editability/provenance;
- objective requirements satisfied;
- evidence-backed mismatches, assumptions, and deferred items;
- generated-code assumptions with disposition `design-reference-only`;
- approval state when human selection is genuinely required.

Do not persist runtime progress files in the product repository. Orchestrator owns durable Jira `[RESULT]`, `[BLOCKER]`, `[REVISION]`, or `[HANDOFF]` projection.

## Artifact rules

### Images and screenshots

- Preserve provider artifact ID, location, known dimensions, and represented screen/state.
- Mark whether the image is final design, variant, or reference.
- Do not infer hidden interaction, responsive behavior, or component contracts from pixels alone.

### HTML, CSS, or generated code

- Mark returned code `design-reference-only`.
- Record packages, CDN URLs, fonts, images, mock data, scripts, global styles, and runtime assumptions visible in the artifact.
- Do not install dependencies, copy files into product source, or treat generated structure as DDD/Atomic ownership evidence.
- If adoption would require a dependency/integration decision, return that fact to Orchestrator; do not invoke another agent capability directly.

### Editable/provider-native artifacts

- Preserve file/project key, page/frame/node/screen/revision IDs and review URL when available.
- Record whether the artifact is provider-generated, provider-edited, imported, or agent-constructed.
- Capture an inspectable preview when the provider supports it.

## Approval gate

Human approval is required only when the assigned handoff explicitly requires it or multiple materially different valid provider outcomes remain without an objective criterion.

If the provider result is objectively compliant and no approval gate is required by the handoff, return the evidence to Orchestrator and allow the parent `$frontend-delivery` workflow to continue automatically.

If the user rejects/changes design direction:

- continue the provider prompt chain only when the change stays inside assigned Design Subtask scope;
- return a revision/replan blocker when the change materially affects product scope, architecture, data exposure, provider role, or expected output;
- preserve rejected artifact IDs/reasons as evidence when useful.

Do not create or revise a local implementation plan.

## Downstream boundary

The Design specialist ends after returning the structured design result. Orchestrator decides downstream Jira routing and internal capabilities.

Do not:

- call Brain/Coding/Testing capabilities directly;
- select implementation libraries because provider code happens to use them;
- write application code;
- update Jira directly;
- persist a second design workflow/progress database.
