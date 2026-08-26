---
name: orchestrate-frontend-design
description: Use an already-connected Figma, Stitch, or equivalent design provider to create or revise frontend visual evidence from one complete transient issue handoff, then return stable provider identity, previews, decisions, constraints, and approval state. Use only for the Design specialist; never read project .docs, implement product code, or substitute an agent-authored mockup when the provider is unavailable.
---

# Orchestrate Frontend Design

## 1. Validate the handoff

Read only the assigned transient `issue-handoff` object. Confirm target users/content, required
screens/states, fixed constraints, acceptance criteria, provider requirement, and artifact expectations
are sufficient. Return `context-insufficient` instead of reading `.docs/`, source, or chat history.

## 2. Select the connected provider

Honor the provider fixed by the handoff when its capability is connected/authorized. Use another
provider only when the handoff explicitly permits it.

Load one provider reference as needed:

- `references/figma.md`
- `references/stitch.md`

If capability is unavailable, return `missing-capability`. Do not configure MCP, request tokens, or
create a local substitute.

## 3. Execute and inspect

Read `references/prompt-orchestration.md` as needed. Build provider prompts only from the transient
handoff, call the provider, and inspect the returned artifact. Iterate only for objective mismatch,
provider error, or explicit feedback.

Never send credentials/unrelated project content. Generated HTML/CSS/component code remains design
evidence only, not approved production source.

## 4. Return evidence

Read `references/design-handoff.md` as needed. Return objects matching
`.protocols/design-artifact.yaml` and `.protocols/agent-report.yaml` with stable provider/file/project/
node/revision identity, previews, covered states, decisions, implementation constraints, objective
checks, unresolved questions, and approval state.

Do not persist a separate local design workflow record; Orchestrator owns durable Jira context.
