---
name: orchestrate-frontend-design
description: Use an already-connected Figma, Stitch, or equivalent design provider to create or revise a frontend visual artifact from one complete YAML issue handoff, then return stable provider identity, previews, decisions, constraints, and approval state. Use only for the design specialist; never read project .docs, implement product code, or substitute an agent-authored mockup when the provider is unavailable.
---

# Orchestrate Frontend Design

## 1. Validate the handoff

Read only the assigned `issue-handoff.yaml`. Confirm that it contains the target users, content,
required screens/states, fixed constraints, acceptance criteria, provider requirement, and artifact
expectations. Return `context-insufficient` instead of reading `.docs/` or source.

## 2. Select the connected provider

Honor the handoff's provider when its capability is connected and authorized. Otherwise use another
provider only when the handoff explicitly permits it.

Load one provider reference:

- [figma.md](references/figma.md)
- [stitch.md](references/stitch.md)

If the capability is unavailable, return `missing-capability`. Do not configure MCP, request tokens,
or create a local substitute.

## 3. Execute and inspect

Read [prompt-orchestration.md](references/prompt-orchestration.md). Build the provider prompt only
from the issue handoff, call the provider, and inspect the returned artifact. Iterate only for an
objective mismatch, provider error, or explicit feedback.

Never send credentials or unrelated project content. Never treat generated HTML, CSS, or component
code as approved production source.

## 4. Return the artifact

Read [design-handoff.md](references/design-handoff.md). Return YAML matching
`.protocols/design-artifact.yaml` and `.protocols/agent-report.yaml`.

Include stable provider/file/project/node/revision identifiers, previews, states covered, decisions,
implementation constraints, objective checks, unresolved questions, and approval state.
