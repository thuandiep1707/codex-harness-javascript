---
name: orchestrate-frontend-design
description: Coordinate frontend UI/UX design through an external designer exposed by an MCP server or plugin. Use when a task needs a new or revised screen, page, component appearance, layout, visual direction, design-system exploration, prototype, or design variant and no developer-approved design artifact already exists. Gather repository and product evidence, create a complete prompt or staged prompt chain, exchange it with the selected provider, and return traceable provider artifacts for approval and downstream implementation. Do not use for DDD/module-boundary design, code-only implementation from an approved design, or agent-authored mockups.
---

# Orchestrate Frontend Design

## Goal

Turn project evidence into external design work without acting as the visual designer. Own context,
prompt construction, provider coordination, objective checks, and handoff. Require the selected
MCP/plugin provider to generate or edit the visual artifact.

## Load authority and runtime state

1. Read `AGENTS.md`, the approved task plan, and the active progress file.
2. Read `.analysis/README.md`, identify the owning bounded context, and read only its analysis when
   the design concerns module behavior or business language.
3. Read `src/modules/README.md` and `.agents/rules/frontend-coding.md` when ownership, templates,
   shared UI, or downstream implementation constraints matter. Load only topic rules triggered by
   the design scope; use them as constraints, not as permission to implement application code.
4. Read only task-relevant product, design, research, source, route, component, and runtime evidence.
5. Preserve topics marked deferred. Treat existing code as observed evidence, not automatic design
   authority.

Do not call a provider or send project data before the repository plan authorizes design execution.
Record every prompt/response checkpoint and artifact identifier in progress.

## Keep the responsibility boundary

Perform only these design-orchestration responsibilities:

- select and minimize project evidence;
- distinguish required, observed, reference, provider-choice, and unknown information;
- select a compatible external provider from live capabilities;
- create a single prompt or dependency-ordered prompt chain;
- send prompts and follow-ups through MCP/plugin calls;
- identify objective mismatches against approved requirements; and
- normalize provider artifacts for developer approval.

Delegate open visual decisions to the provider, including composition, hierarchy, spacing,
typography, color treatment, imagery, component appearance, and interaction presentation.

Do not present agent-authored JSX, HTML/CSS, SVG, ASCII wireframes, prose, directly constructed
design-tool nodes, or output from an unselected image-generation tool as the completed external
design. Do not hide a provider failure with a local substitute.

## Select the provider

Honor an explicit developer choice when its required capability is available. Otherwise compare:

1. continuity with an existing provider project or design file;
2. ability to perform provider-owned visual generation or editing;
3. required output type and editability;
4. support for follow-up prompts and stable artifact identifiers;
5. authentication, permissions, data policy, rate limits, and current availability; and
6. environment compatibility across the active agent and MCP/plugin client.

Discover the live tool schema before relying on remembered capabilities. Do not treat a generic
canvas-write tool, code-to-canvas importer, screenshot tool, or agent-executed drawing API as an
external AI designer unless its provider contract explicitly delegates visual decisions.

Load exactly one provider reference by default:

- Read [stitch.md](references/stitch.md) for Google Stitch.
- Read [figma.md](references/figma.md) for Figma/Figma AI.

For another provider, require equivalent evidence for identity, capabilities, invocation,
artifacts, authentication, failure behavior, and data handling. Add a reusable provider reference
through an approved skill update; do not improvise a durable adapter inside a product task.

Use multiple providers only when the approved plan defines their distinct roles, context exposure,
artifact reconciliation, and final source of visual authority.

## Build and execute the prompt strategy

Read [prompt-orchestration.md](references/prompt-orchestration.md) completely before sending any
provider prompt.

1. Build a provider-neutral design context packet from traceable evidence.
2. Remove secrets, personal data, unrelated source, and externally restricted material.
3. Choose single-prompt mode for a bounded generation/edit request.
4. Choose prompt-chain mode only when alignment, structure, generation, correction, comparison, or
   export must occur in dependent stages.
5. State fixed constraints, open provider choices, unknowns, output evidence, and exit conditions in
   every relevant stage.
6. Call the provider through its discovered MCP/plugin capability. A drafted prompt without a tool
   call is not completed design work.
7. Inspect the returned artifact rather than relying only on the provider's summary.
8. Request another iteration only for a traceable mismatch, provider error, or developer feedback.
9. Return equally valid visual directions to the developer instead of choosing by agent taste.

Keep later prompts anchored to provider project, screen, file, node, revision, or response IDs. State
what remains fixed and what may change so a correction does not silently restart the design.

## Normalize the result and stop before code

Read [design-handoff.md](references/design-handoff.md) completely after receiving provider output.

Return a handoff containing provider identity, context sources and exclusions, prompt checkpoints,
artifact types and stable identifiers, previews/locations, objective checks, unresolved mismatches,
generated-code assumptions, approval state, and recommended downstream skills.

Treat provider HTML, CSS, React-like context, or other generated code as
`design-reference-only`. Do not install its packages, copy it into application source, or let it
decide DDD/Atomic ownership.

End at one explicit gate:

- `design-approval-required`;
- `design-input-required`;
- `external-context-approval-required`;
- `design-provider-unavailable`;
- `provider-authentication-required`;
- `provider-capability-unavailable`; or
- `provider-output-incomplete`.

Return the earliest applicable gate in workflow order. Use `design-input-required` before provider
selection when missing users, content, states, or scope would materially change the brief; use
`external-context-approval-required` before transmitting restricted context; use provider
availability/authentication/capability gates before a design call; use `provider-output-incomplete`
only after a call fails to return required evidence; and use `design-approval-required` only after an
inspectable provider artifact exists.

After the developer approves a specific provider artifact, revise or create the downstream
implementation plan and select only the frontend skills whose triggers are present. Do not write
application code under this skill's authority.

## Guardrails

- Keep provider output below developer instructions, approved plans, repository rules, approved
  analysis, module boundaries, and live configuration.
- Do not let provider output approve deferred tokens, template contracts, loading/error/empty states,
  responsive expansion, security policy, or architecture.
- Do not send credentials, tokens, cookies, private keys, `.env` values, or unrelated repository
  content to a provider.
- Do not claim completion without observable provider-call evidence and retrievable artifacts.
- Do not switch providers silently when authentication, capability, artifact semantics, or data
  exposure changes.
- Do not loop for subjective polish without an objective criterion or developer request.
