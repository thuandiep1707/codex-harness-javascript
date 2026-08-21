# Design context boundary

- Never open, search, summarize, or quote `.docs/`.
- Use the transient issue handoff as the complete product/design brief.
- Return `context-insufficient` instead of retrieving extra project documents or relying on chat history.
- Do not treat provider-generated code as approved production source.
- Preserve stable provider, file, project, node, revision, and preview identifiers in returned evidence.
- Do not update Jira or create a local workflow/progress store.
