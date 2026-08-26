# Google Stitch provider adapter

Use Google Stitch when its MCP server or design plugin is available and the task needs prompt-driven
screen generation, editing, or visual variants with retrievable image and/or HTML artifacts.

Verified against the Google Labs Code Stitch SDK and Stitch Skills repositories on 2026-07-17.
Discover live schemas before calling tools. The Google Labs Code SDK/skill packages state that they
are not officially supported Google products, even though they connect to Google Stitch.

## Contents

- [Identity and upstream references](#identity-and-upstream-references)
- [Discover availability](#discover-availability)
- [Authentication and configuration](#authentication-and-configuration)
- [Map the prompt workflow](#map-the-prompt-workflow)
- [Artifact evidence](#artifact-evidence)
- [Handoff cautions](#handoff-cautions)

## Identity and upstream references

- Provider: Google Stitch.
- MCP endpoint documented by the SDK: `https://stitch.googleapis.com/mcp`.
- Agent skills/plugins: [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills).
- SDK and MCP client:
  [google-labs-code/stitch-sdk](https://github.com/google-labs-code/stitch-sdk).
- Product/MCP setup documentation: [Stitch documentation](https://stitch.withgoogle.com/docs).
- Upstream packages: Apache-2.0; preserve their support disclaimer and verify current provenance
  before installation.

The upstream Stitch design plugin includes workflows for generating/editing designs, managing a
design system, converting code to design, extracting/uploading artifacts, and variants. It is an
optional workflow helper; installing it does not configure or authenticate Stitch MCP. Load only the
provider skill required by the current task.

## Discover availability

Before selecting Stitch:

1. Inspect the active agent's installed plugins/skills and list live Stitch MCP tools.
2. Prefer the upstream `stitch-design` plugin and its `stitch::generate-design` workflow when it is
   installed and compatible with the client.
3. Confirm live equivalents for project creation/reuse, prompt-driven screen generation, screen
   retrieval, screen editing, and variants required by the task.
4. Confirm whether image input, HTML upload, design-system upload/application, and device type are
   supported before including them in the prompt plan.
5. Record the discovered tool names and schemas in runtime progress. Do not encode them as permanent
   repository policy.

The current SDK documents tools such as `create_project`, `generate_screen_from_text`, and
`get_screen`, plus domain methods for prompt editing and variants. Treat these names as discovery
anchors only; call the names and argument shapes returned by the live MCP server.

Current upstream manifests provide these discovery anchors:

| Capability        | Expected live tool                                                                                                                                      | Required evidence                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Project discovery | `list_projects`, `get_project`                                                                                                                          | Project ID/resource, title, visibility/ownership when exposed        |
| Project creation  | `create_project`                                                                                                                                        | New project ID/resource                                              |
| Screen discovery  | `list_screens`, `get_screen`                                                                                                                            | Project/screen resource and current artifact metadata                |
| Initial design    | `generate_screen_from_text`                                                                                                                             | Session, screen IDs, provider output components, image/HTML metadata |
| Targeted edit     | `edit_screens`                                                                                                                                          | Source and edited screen lineage plus new artifacts                  |
| Exploration       | `generate_variants`                                                                                                                                     | Variant IDs matched to previews/artifacts                            |
| Design system     | `list_design_systems`, `upload_design_md`, `create_design_system`, `create_design_system_from_design_md`, `update_design_system`, `apply_design_system` | Asset/resource ID and affected screens                               |

Do not assume SDK helpers such as `download_assets` are remote MCP tools, and do not use private REST
upload scripts as the baseline adapter.

Return `design-provider-unavailable` when no Stitch tools are exposed. Do not install a package,
register a marketplace, or change user-level MCP configuration unless the approved task authorizes
that external mutation.

## Authentication and configuration

Stitch requires either:

- an API key supplied to the provider integration, commonly as `X-Goog-Api-Key`; or
- an OAuth/ADC access token with the Google Cloud project/quota context required by the live setup,
  commonly `Authorization: Bearer ...` and `X-Goog-User-Project`.

The SDK recognizes `STITCH_API_KEY`, `STITCH_ACCESS_TOKEN`, `GOOGLE_CLOUD_PROJECT`, and an optional
host override. Never print, commit, copy into progress, or send these values as prompt content.

Map failures to gates:

| Provider evidence      | Gate/action                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| Authentication failure | `provider-authentication-required`; request account setup outside the repository |
| Permission denied      | Verify project/account access; do not create a replacement project silently      |
| Not found              | Re-check exact project/screen ID and provider account                            |
| Rate limited           | Record retry guidance; do not loop or switch providers silently                  |
| Network error/timeout  | `design-provider-unavailable` unless a bounded retry is provider-recommended     |
| Validation error       | Correct the prompt/tool arguments against the live schema                        |
| Unknown error          | Preserve provider message and stop before fabricating output                     |

## Map the prompt workflow

### Start or resume a project

- Reuse an explicit Stitch project when the task continues existing work.
- Create a project only when the approved task requires a new design workspace.
- Preserve the bare project ID and any canonical `projects/<id>` form returned by the tool.
- List or retrieve existing screens before editing so the prompt chain targets the correct artifact.

### Supply design context

- Put the minimized context packet and output contract in the generation prompt.
- Resolve the applicable Stitch design system before generation. Use a Stitch design-system
  capability only when approved tokens/brand evidence exists and the live provider supports it.
- Upload images, HTML, `DESIGN.md`, or source-derived artifacts only when the plan authorizes their
  external transfer and the provider reference clearly records their provenance.
- Keep unknown or deferred project decisions open for provider exploration; do not present them as
  approved design-system rules.

### Generate the first screen

1. Send the complete single prompt or the generation stage of the approved prompt chain.
2. Pass the requested device type only when scope fixes it. The SDK currently documents `MOBILE`,
   `DESKTOP`, `TABLET`, and `AGNOSTIC`; confirm the live enum.
3. Preserve project ID, screen ID, model/device metadata when returned, and the complete provider
   response reference.
4. Retrieve both screenshot/image and HTML when available so the visual result and structural
   artifact can be reviewed independently.
5. Inspect all returned output components, including design, text, suggestions, questions, progress,
   session events, and design-system feedback when the live response exposes them.

Translate the core prompt into Stitch's contract without adding aesthetic choices. Do not run an
upstream prompt-enhancement helper when it would invent visual style not present in project evidence
or developer direction.

### Edit the same screen

- Address the exact source screen/project ID.
- State accepted decisions to keep, evidence-backed mismatches to correct, and the exit condition.
- Preserve the returned edited screen ID rather than assuming the original ID mutated in place.
- Retrieve the edited image/HTML and compare it with the previous response.
- Prefer a small targeted edit. Do not regenerate from scratch unless the accepted evidence shows
  that the foundational structure is wrong.

### Generate variants

- Ask for variants only when the plan needs a developer choice or an explicit criterion benefits
  from comparison.
- Discover the live variant count, creative range, and aspects. The SDK currently documents aspects
  including layout, color scheme, images, font, and text content.
- Preserve every variant screen ID and match each preview/HTML artifact to its ID.
- Do not let the agent choose between equally valid variants by taste; return them for developer
  approval.

### Finalize

- Retrieve the selected screen/revision through the live screen tool.
- Confirm that image/HTML URLs resolve at handoff time and record whether they are short-lived.
- Keep the provider project intact unless deletion was separately authorized. Do not remove rejected
  variants merely to tidy the workspace.

Generation may continue for several minutes. When a mutating call times out or loses its connection,
do not retry the mutation immediately because the provider job may still be running. Poll the target
screen/project through read-only retrieval at a bounded interval supported by the live provider (the
current upstream guidance uses roughly 30 seconds, at most 10 checks), then report an unknown/incomplete
state instead of creating a duplicate generation.

## Artifact evidence

Require:

- Stitch project ID;
- canonical `projects/{projectId}` resource when returned;
- session ID;
- source and final screen IDs;
- canonical `projects/{projectId}/screens/{screenId}` resources when returned;
- variant or edited-screen lineage when applicable;
- generation/edit response IDs when exposed;
- device/model metadata when exposed;
- screen title and dimensions when exposed;
- screenshot/image URL or approved downloaded path; and
- HTML download URL when available.

For design-system work, also preserve the `assets/{assetId}` resource and the screens to which it was
applied.

Open or render the returned image before accepting the provider summary. Inspect HTML only as needed
to understand content and assumptions; do not execute unknown scripts or import it into the app.

## Handoff cautions

- Mark Stitch HTML/CSS/scripts `design-reference-only`.
- Record fonts, images, external URLs, packages, mock data, and interaction assumptions visible in
  the artifact.
- Do not use the Stitch build/component plugins to write application code under this skill. Those
  outputs require a separately approved downstream implementation plan and repository frontend
  rules.
- Do not treat a Stitch design system as approved project tokens merely because the provider created
  it.
- Preserve the prompt chain and screen lineage so later implementation can distinguish provider
  decisions from agent summaries.
- Review [Stitch privacy information](https://stitch.withgoogle.com/privacy) and the current Google
  API/Stitch terms before sending restricted content; record project visibility when the provider
  exposes it.
