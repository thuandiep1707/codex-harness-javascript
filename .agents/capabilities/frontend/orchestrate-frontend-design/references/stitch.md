# Google Stitch provider adapter

Use Google Stitch only when the assigned Design Subtask routes this provider and a live Stitch MCP/plugin is already available. This adapter maps the bounded Jira-derived handoff to provider actions; it does not create a second workflow, progress store, or implementation plan.

Verified against Google Labs Code Stitch SDK/skills on 2026-07-17. Live schemas, authentication, provider support, and account capabilities can change, so discover them before mutation.

## Provider identity

- Provider: Google Stitch.
- Upstream MCP endpoint currently documented by SDK: `https://stitch.googleapis.com/mcp`.
- Upstream helper repositories may expose workflows such as generation, editing, variants, design systems, and artifact export.
- Upstream helpers are optional provider tooling; their installation/configuration is not authorized by this capability unless the assigned Jira handoff explicitly grants that external mutation.

## Discover availability

Before selecting a Stitch action:

1. inspect live Stitch tools exposed to the active Design specialist;
2. confirm project discovery/creation, screen generation/retrieval/edit/variant capabilities actually required by the Subtask;
3. confirm artifact types, image/HTML support, device-type enums, and design-system capabilities before using them;
4. preserve discovered tool names/schema facts only as transient/provider evidence returned in the Design report;
5. never encode live provider tool names as permanent application policy.

Current upstream names such as `create_project`, `generate_screen_from_text`, `get_screen`, `edit_screens`, or `generate_variants` are discovery anchors only. Call the actual live tool/schema.

Return `design-provider-unavailable` when no qualifying Stitch capability exists. Do not install packages, register marketplaces, or change user MCP configuration as fallback.

## Authentication and secrets

The provider may require API-key or OAuth/ADC credentials and project/quota context. Never print, commit, persist in Jira, or send credential values as prompt content.

Map failures conservatively:

| Evidence | Result |
| --- | --- |
| Authentication failure | `provider-authentication-required` |
| Permission denied | verify account/project authority; do not create replacement silently |
| Resource not found | re-check exact project/screen identity |
| Rate limited | preserve provider retry guidance; no uncontrolled loop |
| Network timeout | bounded provider recovery, otherwise `design-provider-unavailable` |
| Validation error | correct against live schema |
| Unknown error | preserve provider error evidence and stop before fabricating output |

## Start or resume provider project

- Reuse an explicit Stitch project when the handoff references continuing work.
- Create a project only when the assigned Design Subtask authorizes a new provider workspace.
- Preserve canonical project/screen IDs returned by the provider.
- Retrieve current target screens before editing so mutations address the correct artifact.

## Supply design context

Use only the minimized context supplied through the current `issue-handoff` and allowed dependency/design evidence.

- Do not read `.docs` directly from the Design specialist.
- Use approved brand/tokens/design-system evidence only when supplied by Orchestrator and supported by Stitch.
- Upload images/HTML/design-system material only when the handoff authorizes external transfer and provenance is clear.
- Keep unknown/deferred project decisions open instead of presenting them as approved provider rules.

## Generate

1. Send the bounded prompt produced by `prompt-orchestration.md`.
2. Pass device type only when assigned scope fixes it and the live schema supports it.
3. Preserve project ID, screen ID, session/generation ID, model/device metadata, and response evidence when returned.
4. Retrieve inspectable screenshot/image and structural artifact such as HTML when available.
5. Inspect provider output; do not accept summary text without artifact evidence.

Do not run prompt-enhancement helpers when they would invent visual policy absent from the handoff.

## Edit

- Target exact project/screen identity.
- State accepted decisions to preserve, evidence-backed mismatches to correct, and explicit exit criteria.
- Preserve edited-screen lineage when provider returns a new screen/revision ID.
- Prefer targeted edit over regeneration when the foundation remains valid.

## Variants

Generate variants only when the handoff requires exploration or objective comparison benefits from alternatives.

- Preserve every variant ID and match it to preview/HTML evidence.
- Do not let the Design specialist choose between equally valid outcomes purely by taste.
- Return `design-approval-required` only when human selection is genuinely necessary or explicitly required; otherwise compliant provider output may return `completed` and `$frontend-delivery` continues.

## Mutation timeout safety

When a mutating provider call times out after submission, do not immediately replay it because the remote job may still be running. Use bounded read-only retrieval/polling supported by the provider, then return incomplete/unknown evidence rather than creating duplicate generation.

## Artifact evidence

Preserve as many as the live provider can return:

- project ID/resource;
- session/generation ID;
- source/final screen IDs and lineage;
- device/model metadata;
- screen title/dimensions;
- screenshot/image reference;
- HTML or structural artifact reference;
- design-system asset/resource IDs when applicable.

Open/render returned visual evidence before accepting provider success. Inspect HTML only as evidence; do not execute unknown scripts or import provider code into application source.

## Handoff cautions

- Mark Stitch HTML/CSS/scripts `design-reference-only`.
- Record visible fonts, images, URLs, packages, mock data, and interaction assumptions relevant downstream.
- Do not use Stitch build/component helpers to write application source from this Design capability.
- Do not treat provider-created design-system values as approved application tokens merely because Stitch generated them.
- Return dependency/integration implications to Orchestrator; do not call Coding/security/integration capabilities directly.
- Return bounded evidence through `design-artifact`/`agent-report`; do not write runtime progress files or local implementation plans.
- Preserve provider lineage so downstream implementation can distinguish provider decisions from agent summaries.
