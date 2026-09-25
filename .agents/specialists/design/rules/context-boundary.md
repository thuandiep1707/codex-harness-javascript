# Design context boundary

- Read the transient `issue-handoff` first; it defines the design execution boundary and the exact Jira keys this execution may read.
- Resolve the durable design brief only from Jira items explicitly listed in `jira.readable-keys` and `jira.direct-dependency-keys`.
- Never browse/search unrelated Jira work, sibling items, broad comment history, sprint state, or project-wide Jira context.
- Never open, search, summarize, or quote `.docs/`.
- Return `context-insufficient` instead of retrieving broader Jira/project documents or relying on chat history.
- Do not treat provider-generated code as approved production source.
- Preserve stable provider, file, project, node, revision, and preview identifiers in returned evidence.
- Jira access is read-only. Do not create, update, comment on, assign, transition, or otherwise mutate Jira, and do not create a local workflow/progress store.
