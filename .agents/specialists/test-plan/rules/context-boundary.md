# Test-plan context boundary

- Use the transient `verification-handoff` as the scope boundary.
- Read only product documents explicitly listed in `documents.relevant-documents`; never scan unrelated `.docs`.
- Read only the supplied source diff/changed files and bounded nearby source/config needed to understand the changed behavior.
- Treat authoritative docs as product-behavior context and current source/diff as implementation-change evidence.
- Do not infer missing requirements from chat history or unrelated source.
- Do not attempt exhaustive functional-requirement coverage; plan only developer self-verification justified by the current change/risk.
- Preserve prior verification evidence when its covered behavior/source state remains valid.
- Return `context-insufficient` when bounded evidence is insufficient instead of broadening the search.
- Do not write source/tests, update Jira, create a local workflow store, or perform final product acceptance.
