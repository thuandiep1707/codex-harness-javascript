# Design handoff

Normalize provider responses into this handoff before developer review or downstream code planning.
Do not reinterpret a provider artifact as approved application code.

## Contents

- [Required record](#required-record)
- [Artifact rules](#artifact-rules)
- [Approval gate](#approval-gate)
- [Downstream routing](#downstream-routing)

## Required record

```yaml
design_handoff:
  task: <approved design objective>
  status: design-approval-required | blocked
  provider:
    name: <provider>
    channel: <MCP server or plugin>
    capability: <discovered external-design capability>
    session_or_project: <stable provider ID when available>
  context:
    sources: [<paths, document titles, URLs, existing artifact IDs>]
    sent: [<summaries or excerpts supplied>]
    excluded: [<sensitive, irrelevant, or deferred material>]
  orchestration:
    mode: single-prompt | prompt-chain
    checkpoints:
      - stage: <stage ID>
        prompt_summary: <purpose, not a replacement for the recorded exact prompt>
        response_id: <provider evidence>
        artifact_ids: [<IDs>]
        result: accepted | corrected | pending
  artifacts:
    - type: image | html | design-file | node | prototype | structured-response | other
      id: <stable ID>
      location: <provider URL or approved local path>
      preview: <preview/screenshot reference when available>
      editable: true | false | unknown
      provenance: provider-generated | provider-edited | imported-reference
  checks:
    satisfied: [<objective requirements>]
    mismatches: [<remaining evidence-backed gaps>]
    deferred: [<items not approved by this design>]
  generated_code:
    present: true | false
    assumptions: [<libraries, framework, assets, mock data, or unsafe patterns>]
    disposition: design-reference-only
  approval:
    developer: pending | approved | rejected
    approved_artifact_ids: []
  downstream:
    ownership: <approved context/layer or unresolved>
    recommended_skills: [<only evidence-required skills>]
    next_gate: implementation-plan-approval-required
```

Keep exact prompts and provider responses in the active runtime progress record or provider session.
Use the handoff to index that evidence, not to erase it.

## Artifact rules

### Images and screenshots

- Preserve the provider artifact ID, original location, dimensions when known, and the screen/state
  represented.
- Mark whether the image is a final design, a variant, or only a reference.
- Do not infer hidden interaction, responsive behavior, or component contracts from pixels alone.

### HTML, CSS, or generated code

- Mark all returned code `design-reference-only`.
- Record external packages, CDN URLs, fonts, images, mock data, scripts, global styles, and runtime
  assumptions visible in the artifact.
- Do not install dependencies, copy files into `src`, or treat generated structure as DDD/Atomic
  ownership evidence.
- Route adoption of an actual third-party runtime or package through the repository's supply-chain
  and integration skills when applicable.

### Figma or other editable design files

- Preserve file/project key, page/frame/node IDs, branch/version information when available, and a
  node-specific review URL.
- Record whether nodes are provider-generated, mechanically imported, or agent-constructed. Only
  provider-generated or provider-edited visual work satisfies the external-designer requirement.
- Capture a screenshot or preview when the provider supports it so reviewers can verify the linked
  artifact.

### Provider-native projects or screens

- Preserve project, conversation, screen, revision, and export identifiers returned by the tool.
- Distinguish initial generation from later edits and variants.
- Record retrieval URLs as evidence; do not assume short-lived URLs are permanent.

## Approval gate

Return `design-approval-required` when the provider artifact exists and objective checks are ready.
The developer must identify the approved artifact or variant. Approval of the skill plan does not
pre-approve an unknown provider result.

If the developer rejects or changes the design direction:

- continue the provider prompt chain when the change stays within the approved design scope;
- revise the plan when the change materially affects scope, provider roles, data exposure,
  architecture, or expected output; and
- preserve rejected artifact IDs and reasons so later prompts do not accidentally restore them.

## Downstream routing

After design approval:

1. Resolve module/shared UI ownership with `design-frontend-module-boundary` when still unclear.
2. Revise or create the implementation plan with file-level `Why`, `Affected`, `Risk`, and
   `Control` based on the approved artifact.
3. Use `.agents/rules/frontend-coding.md` for implementation ownership and repository conventions.
4. Add migration, third-party integration, security, unit/component, or Playwright skills only when
   their documented triggers are present.
5. Validate implementation against the approved artifact without treating pixel similarity as the
   only correctness criterion.

Do not write application code from this orchestration skill. The design handoff ends the skill's
authority.
