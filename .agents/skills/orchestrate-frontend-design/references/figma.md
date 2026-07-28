# Figma provider adapter

Use this adapter only after live discovery proves that the available Figma integration can perform
the provider-owned visual design required by the task. Do not equate “can write Figma nodes” with
“external designer.”

Verified against Figma's public MCP/AI documentation and the installed Figma plugin skills on
2026-07-17. Re-discover capabilities because account, client, editor, plugin version, and Figma plan
can change them.

## Contents

- [Identity and capability boundary](#identity-and-capability-boundary)
- [Official references](#official-references)
- [Discover availability](#discover-availability)
- [Load mandatory Figma skills](#load-mandatory-figma-skills)
- [Map the prompt chain](#map-the-prompt-chain)
- [Artifact evidence](#artifact-evidence)
- [Gates](#gates)
- [Handoff cautions](#handoff-cautions)

## Identity and capability boundary

Figma exposes several distinct surfaces:

- **Figma AI / First Draft:** a Figma product feature that can generate editable wireframes or
  designs from prompts and accept prompt-driven changes.
- **Figma Make:** a conversational AI surface for functional prototypes/web apps.
- **Figma MCP design context:** reads frames, components, layouts, variables, assets, and related
  design context for an external agent.
- **Figma MCP write to canvas / `use_figma`:** executes agent-authored Plugin API JavaScript to
  create or modify native Figma nodes.
- **Code to canvas / `generate_figma_design`:** captures an existing web page or HTML into editable
  Figma layers.

Only a live MCP/plugin capability that explicitly invokes provider-side AI generation or editing may
serve as the external designer for this skill. In particular:

- `use_figma` is an execution surface for the agent's JavaScript. It does not by itself delegate
  visual judgment to Figma AI.
- `figma-generate-design` guides the agent to assemble screens from design-system assets. It does not
  by itself prove provider-side AI authorship.
- `generate_figma_design` imports an existing interface. It transports an artifact; it does not
  design a new visual direction.
- reading context, taking screenshots, creating a blank file, uploading assets, or finding libraries
  cannot satisfy the external-designer requirement.

When no live Figma AI/Make design-generation tool is exposed to the active MCP/plugin client, return
`provider-capability-unavailable`. Figma may still be an artifact sink or downstream design editor in
an approved multi-provider workflow, but record that role separately from the provider that made the
visual decisions.

Classify the active Figma role explicitly:

| Mode                       | Meaning                                                                                   | External designer for this skill?                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `provider-ai-generation`   | A live Figma endpoint accepts a semantic UI brief and returns Figma AI/Make visual output | Yes                                                                                   |
| `external-artifact-ingest` | Read a design already generated or edited outside the agent through Figma Design/Make     | Valid evidence, but do not claim this run generated it                                |
| `mechanical-capture`       | Import approved HTML or a rendered page into Figma                                        | No; preserve the original design provider's provenance                                |
| `direct-node-edit`         | Agent JavaScript constructs or edits canvas nodes                                         | No during orchestration; allow only after design approval or in another approved task |

As of the verification date, the installed connector exposed context reads, screenshots, design-
system discovery, direct Plugin API writes, and code-to-canvas capture, but no semantic prompt-based
application UI design endpoint. Re-discover rather than treating that result as permanent.

## Official references

- [Figma MCP server introduction](https://developers.figma.com/docs/figma-mcp-server/)
- [Figma MCP tools and prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Figma skills for MCP](https://help.figma.com/hc/en-us/articles/39166810751895)
- [Figma AI First Draft](https://help.figma.com/hc/en-us/articles/23955143044247)
- [Figma AI tools](https://help.figma.com/hc/en-us/articles/23870272542231)
- [Code to canvas](https://developers.figma.com/docs/figma-mcp-server/code-to-canvas/)

## Discover availability

Before selecting Figma:

1. List or inspect the live Figma MCP/plugin tools without writing a file.
2. Identify the exact tool whose schema states that Figma/Figma AI performs prompt-driven visual
   generation or editing for the requested artifact.
3. Confirm whether the tool supports a new file, existing file, existing selection, or Figma Make
   file and whether it supports follow-up prompts.
4. Confirm the authenticated account, plan/seat, editor type, AI availability, edit permission, and
   organization policy when the tools expose those facts.
5. Record the capability evidence. Do not infer First Draft access merely because standard Figma MCP
   tools are connected.

Use read-only identity or metadata tools for discovery when available. Do not create a blank file as
an availability test.

A developer-provided Figma Design or Figma Make URL may be ingested as an external artifact even
when provider AI generation is unavailable. Preserve its original authorship and generation channel.
For Make artifacts, discover the live `get_design_context` contract; the current connector uses a
`makeFileKey` and root node `0:1`, while ordinary design metadata/screenshot tools may not support
`/make/` files.

## Load mandatory Figma skills

When a qualifying tool call also needs a standard Figma operation, load the installed provider skill
before the call:

- Load `figma-create-new-file` before every `create_new_file` call.
- Load `figma-use` before every `use_figma` call.
- Load `figma-generate-design` with `figma-use` for full-page or multi-section code-to-Figma
  assembly.
- Load `figma-generate-library` with `figma-use` for components, variables, variants, or design-system
  library creation.
- Load editor-specific Figma skills for FigJam, Slides, motion, SwiftUI, diagrams, or other scoped
  operations when their triggers apply.

These skills govern reliable tool use. They do not override this adapter's external-designer test.
If following them would make the agent choose and construct the visual solution, perform that work
only as a downstream, developer-approved Figma authoring task—not as design produced by this skill.

## Map the prompt chain

For a qualifying provider-side AI capability:

1. Resolve the target Figma file/Make file or create a new file only when the approved task requires
   it and the prerequisite skill is loaded.
2. Send the minimized design context packet in the provider's supported prompt field.
3. Preserve the returned file key, URL, page/frame/node IDs, conversation/generation ID, and preview.
4. Address later prompts to the same provider project/artifact and state the exact nodes or result to
   keep or edit.
5. Use screenshots or provider previews to inspect the actual output after every material generation
   or edit.
6. Finalize only when the selected nodes and their preview can be retrieved.

If the provider tool is stateless, make each follow-up prompt self-contained and include the prior
artifact IDs plus accepted decisions. Do not claim conversational continuity the tool does not have.

## Artifact evidence

Require as many of these as the tool can return:

- Figma file key and editable URL;
- editor/file type (`design`, `make`, `figjam`, `slides`, or other);
- page, section, frame, component, or node IDs;
- provider generation/conversation/revision ID;
- node-specific review URL;
- screenshot or thumbnail of the generated result; and
- indication of whether the artifact was AI-generated, AI-edited, mechanically imported, or
  agent-constructed.

Only AI-generated or AI-edited visual artifacts satisfy this skill's provider output. Preserve
mechanically imported and agent-constructed nodes as references with different provenance.

For mechanical code-to-canvas capture, treat the capture ID as transient and single-use. Preserve
the final file/node evidence if returned, not the polling token as the final artifact. If approved
Stitch or another provider's HTML is captured into Figma, keep that original provider as the visual
designer and record Figma as the conversion/handoff channel.

## Gates

- `design-provider-unavailable`: no Figma MCP/plugin connection exists.
- `provider-authentication-required`: account or organization authentication is missing.
- `provider-capability-unavailable`: connected tools do not expose provider-side UI design
  generation/editing, or the account/editor cannot use it.
- `design-input-required`: a required file, target node, plan/team selection, or existing artifact is
  missing.
- `provider-output-incomplete`: no stable file/node evidence or inspectable preview is returned.

Do not switch from Figma AI to agent-authored `use_figma` work when a gate occurs. Offer another
external design provider or request developer direction.

## Handoff cautions

- Treat React-like output from `get_design_context` as design context, not production-ready code.
- Treat code-to-canvas output as an imported reference, not proof that Figma designed the interface.
- Treat browser-driven Figma Make generation as a separate capability until the active MCP/plugin
  exposes and documents its prompt, continuity, artifact, authentication, and error contract.
- Preserve Code Connect and design-system metadata when present, but keep repository ownership and
  implementation decisions in downstream frontend work.
- Keep Figma AI limitations explicit. For example, First Draft capabilities and design-system usage
  may differ from MCP write-to-canvas capabilities and from the active account's access.
