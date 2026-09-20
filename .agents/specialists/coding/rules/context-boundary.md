# Coding context boundary

- Read the transient `issue-handoff` first; it defines execution scope, source-write boundaries, capability routing, and the exact Jira keys this execution may read.
- Resolve durable work requirements only from Jira items explicitly listed in `jira.readable-keys` and `jira.direct-dependency-keys`.
- Never browse/search unrelated Jira work, sibling items, broad comment history, sprint state, or project-wide Jira context.
- Never open, search, summarize, or quote `.docs/`.
- Search product source only within the transient handoff's allowed scope.
- Use approved dependency/design evidence supplied or referenced by the handoff when required.
- Do not compensate for missing requirements with chat history, `.analysis/`, broad repository archaeology, or broader Jira discovery.
- Return an explicit blocker for missing Jira authority, architecture, design, dependency approval, or write scope.
- Jira access is read-only. Do not create, update, comment on, assign, transition, or otherwise mutate Jira, and do not create a local workflow/progress store.
