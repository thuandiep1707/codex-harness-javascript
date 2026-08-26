# Prompt orchestration

Turn the assigned bounded `issue-handoff` into provider instructions without becoming the visual designer. Use only supplied handoff/dependency evidence and provider state; Design specialist must not read `.docs` directly.

## Build the provider packet

Include only fields needed by the current Design Subtask:

| Field | Include | Exclude |
| --- | --- | --- |
| Objective | requested outcome and user/job context supplied in handoff | product expansion |
| Surface | assigned routes/screens/states/components/viewports | deferred surfaces |
| Required content | labels, fields, controls, actions, navigation | invented features |
| Fixed constraints | approved tokens/components/accessibility/brand/responsive evidence | nearby-code preference treated as authority |
| Technical context | framework/component vocabulary that materially affects provider artifact | irrelevant implementation detail |
| References | supplied screenshots/provider artifacts/stable evidence IDs | raw `.docs` access or stale assumptions |
| Unknowns | unresolved/deferred decisions | silent guesses |
| Output contract | artifact type, editability, identifiers, variants, review evidence | undiscovered provider capabilities |
| Acceptance checks | observable checks from handoff | subjective agent taste |

Classify non-trivial facts as `required`, `observed`, `reference`, `provider-choice`, or `unknown`.

## Minimize external data

Before sending context:

1. remove credentials, tokens, cookies, personal data, private keys, `.env` values, and unrelated business information;
2. prefer bounded summaries/excerpts already supplied by Orchestrator over whole files;
3. preserve stable source/artifact identifiers when traceability requires them;
4. stop with `external-context-approval-required` when restricted material is necessary and authorization is unclear.

## Choose prompt mode

Use one prompt when a bounded packet can produce the requested artifact without an intermediate decision.

Use a prompt chain only when materially useful, for example:

- multiple screens depend on shared information architecture;
- an existing provider artifact must be inspected before editing;
- visual direction must be established before broad application;
- variants must be compared against explicit criteria;
- artifact retrieval/export needs a separate call.

Do not split simple work merely to create activity.

## Prompt shape

```text
Role
Act as the external visual designer for this assigned scope.

Objective
<bounded outcome>

Design context
<minimized supplied evidence>

Required content and behavior
<assigned screens/states/controls/interactions>

Fixed constraints
<approved project constraints>

Delegated visual decisions
<open visual choices intentionally delegated to provider>

Unknowns/deferred
<items provider must not silently turn into project policy>

Output contract
<artifact/evidence required>

Acceptance checks
<objective checks>
```

Do not prescribe layout/color/type/spacing/component appearance unless supplied approved evidence already fixes it.

For prompt chains, give every stage a stable purpose and preserve artifact lineage. Typical optional stages are brief alignment, structure, generation, compliance correction, variant/refinement, and finalization. Use only stages actually required.

## Inspect provider responses

For every material response retain:

- provider/tool channel;
- stable response/artifact identifiers;
- assigned requirements satisfied;
- objective mismatches;
- provider-declared assumptions/limitations;
- visual decisions made by provider;
- unresolved decisions requiring authority;
- next stage or exit gate.

Request corrections only for traceable mismatch, provider error/incomplete output, approved accessibility/responsive constraint, or explicit user feedback. Do not replace provider visual judgment with agent preference.

## Exit conditions

Return one of:

- `completed`: required artifact evidence exists, objective checks pass, and no human-selection gate remains;
- `design-approval-required`: multiple materially different valid outcomes require human selection or the handoff explicitly requires approval;
- `design-input-required`: missing product/design decision blocks meaningful work;
- `external-context-approval-required`: required context cannot leave the workflow without authorization;
- `design-provider-unavailable`;
- `provider-authentication-required`;
- `provider-capability-unavailable`;
- `provider-output-incomplete`.

Under `$frontend-delivery`, do not manufacture `design-approval-required` merely because a design artifact was generated. Valid objective evidence may flow directly back to Orchestrator for downstream execution.

## Evidence durability

Return bounded evidence through `design-artifact` and `agent-report`. Do not write active progress files, prompt transcripts, handoff stores, or workflow state into the product repository. Orchestrator owns any compact durable Jira result/checkpoint needed for resume.
