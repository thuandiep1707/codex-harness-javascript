# Prompt orchestration

Use this protocol to turn repository evidence into provider instructions without becoming the visual
designer. Scale the packet and prompt chain to the task; do not send every available file.

## Contents

- [Build the design context packet](#build-the-design-context-packet)
- [Minimize external data](#minimize-external-data)
- [Choose prompt mode](#choose-prompt-mode)
- [Compose a single prompt](#compose-a-single-prompt)
- [Compose a prompt chain](#compose-a-prompt-chain)
- [Inspect provider responses](#inspect-provider-responses)
- [Exit conditions](#exit-conditions)
- [Record runtime evidence](#record-runtime-evidence)

## Build the design context packet

Separate the packet into these fields:

| Field                | Include                                                                                              | Exclude                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Objective            | Requested outcome and why it exists                                                                  | Unrequested product expansion                            |
| Users and jobs       | Documented roles, workflows, and critical tasks                                                      | Invented personas or research claims                     |
| Surface              | Routes, screens, states, components, and target viewport in scope                                    | Deferred or disabled routes                              |
| Required content     | Labels, data fields, controls, actions, and navigation that evidence requires                        | Placeholder features presented as requirements           |
| Existing constraints | Approved templates, design tokens, shared components, accessibility, brand, and responsive direction | Preferences inferred only from nearby code               |
| Technical context    | Framework and component vocabulary useful to the artifact or downstream handoff                      | Internal implementation detail that cannot affect design |
| References           | Relevant documents, source paths, screenshots, existing provider artifacts, and their authority      | Unattributed screenshots or stale assumptions            |
| Unknowns             | Missing content, ambiguous states, conflicts, and deferred decisions                                 | Silent guesses                                           |
| Output contract      | Desired artifact type, editability, identifiers, variants, and review evidence                       | Provider capabilities that were not discovered           |
| Acceptance checks    | Observable content and constraint checks                                                             | Subjective taste asserted by the agent                   |

Label every non-trivial statement as one of:

- `required`: explicit developer request or approved authority;
- `observed`: repository or runtime evidence;
- `reference`: a non-authoritative example;
- `provider-choice`: a visual decision intentionally delegated to the external designer; or
- `unknown`: unresolved and not safe to invent.

## Minimize external data

Before sending the packet:

1. Remove credentials, tokens, cookies, personal data, private keys, `.env` values, and unrelated
   business information.
2. Prefer a concise summary plus necessary excerpts over whole files.
3. Preserve source paths or document titles so returned decisions remain traceable.
4. Record what was deliberately excluded.
5. Stop at `external-context-approval-required` when sensitive or externally restricted material is
   necessary and authorization is unclear.

## Choose prompt mode

Use one prompt only when the provider can produce the requested artifact from a bounded packet and
no intermediate decision must be approved or learned.

Use a prompt chain when at least one condition holds:

- multiple screens depend on a shared information architecture;
- an existing provider artifact must be inspected before editing;
- the provider must establish a visual direction before applying it broadly;
- variants must be compared against explicit criteria;
- the first response is expected to reveal objective gaps; or
- artifact retrieval/export requires a separate call.

Do not split a simple request merely to create activity. Do not continue a chain for general
“polish” without a concrete mismatch or developer instruction.

## Compose a single prompt

Use this shape and omit empty sections:

```text
Role
Act as the external visual designer for this task. Make visual decisions that are not fixed below.

Objective
<requested outcome and user/job context>

Design context
<provider-minimized facts and references>

Required content and behavior
<screens, states, labels, controls, navigation, and interactions>

Fixed project constraints
<approved templates, tokens, brand, viewport, accessibility, and explicit prohibitions>

Delegated visual decisions
<composition, hierarchy, spacing, typography, color treatment, imagery, and other open choices>

Unknowns and deferred decisions
<items the provider must not silently turn into project policy>

Output contract
<artifact type, count, editability, stable identifiers, and evidence to return>

Acceptance checks
<objective checks the response must satisfy>
```

Do not prescribe layout, color, type, spacing, or component appearance unless an approved source
already fixes it. Describe the outcome and constraint; let the provider design the solution.

## Compose a prompt chain

Give every stage an identifier and this contract:

```text
Stage: <number and purpose>
Based on: <context packet and provider artifact/response identifiers>
Keep fixed: <approved facts and accepted provider decisions>
May change: <open visual decisions for this stage>
Request: <one bounded provider action>
Return: <artifact or structured response with stable evidence>
Exit when: <observable condition>
```

Use only the stages the task needs:

1. **Brief alignment:** Ask the provider to restate the intended users, surface, required content,
   constraints, and open visual decisions. Correct factual misunderstandings before generation.
2. **Structure:** Ask for screen inventory, content hierarchy, or flow when later visual work depends
   on it. Keep visual treatment open.
3. **Generation:** Ask the provider to create the initial visual artifact.
4. **Compliance correction:** Identify only evidence-backed mismatches and request targeted changes.
5. **Variant/refinement:** Ask for bounded alternatives or refinements with explicit comparison
   criteria.
6. **Finalization:** Ask the provider to preserve accepted decisions and return final artifacts,
   identifiers, previews, and export information.

## Inspect provider responses

For every response, record:

- provider and tool/channel;
- response/artifact identifiers;
- requirements satisfied;
- objective mismatches;
- provider-declared limitations or assumptions;
- visual decisions made by the provider;
- unknowns that still require developer input; and
- the next stage or exit gate.

Request a correction only for a traceable reason:

- missing or incorrect required content;
- conflict with an approved project constraint;
- accessibility or responsive requirement not met;
- inconsistent treatment across artifacts when consistency was required;
- provider error, incomplete artifact, or unusable handoff evidence; or
- explicit developer feedback.

Do not replace the provider's visual judgment with an agent preference. When two valid visual
directions remain and no objective criterion distinguishes them, return them for developer choice.

## Exit conditions

End orchestration at one of:

- `design-approval-required`: required artifact evidence exists and objective checks are reported;
- `design-input-required`: a missing developer/product decision blocks a meaningful prompt;
- `external-context-approval-required`: required context cannot be sent without authorization;
- `design-provider-unavailable`: the selected MCP/plugin is missing or unreachable;
- `provider-authentication-required`: credentials or account access require developer action;
- `provider-capability-unavailable`: discovered tools cannot perform external visual design; or
- `provider-output-incomplete`: calls succeeded but required artifacts or stable evidence are absent.

Return the first blocker reached:

1. `design-input-required` when missing product/design input would materially change the brief.
2. `external-context-approval-required` when required context cannot yet leave the repository.
3. Provider availability, authentication, or capability gates during provider selection.
4. `provider-output-incomplete` only after an authorized call lacks the contracted artifact evidence.
5. `design-approval-required` only after the real provider artifact has been inspected and checked.

## Record runtime evidence

Write the context source list, minimized prompt packet, exact prompt stages, provider calls,
response/artifact identifiers, mismatch checks, and exit gate to the active progress file. Do not
commit provider credentials, runtime prompt transcripts, or generated artifacts unless a separately
approved repository artifact policy requires them.
