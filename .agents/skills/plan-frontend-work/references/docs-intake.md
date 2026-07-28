# Documentation Intake

## Required order

1. Read `.docs/agents/skill-catalog.md` for category ownership and routing.
2. Read `.docs/agents/subagents.md` for role boundaries and execution sequencing.
3. Inventory `.docs/` by filename and headings.
4. Read only feature, product, architecture, design, or operational documents relevant to the
   request.
5. Read `.analysis/README.md` and only the owning context files when application architecture is
   present.
6. Inspect live configuration, package manifests, source contracts, consumers, and installed
   framework documentation needed to verify the docs.

Repository evidence wins over stale examples. An explicit approved decision wins over a historical
report. Record conflicts instead of silently choosing one.

## Context digest

Return a compact digest containing:

- requested outcome and exclusions;
- authoritative docs read;
- owning bounded context and layer;
- approved design or missing-design state;
- framework, dependency, and runtime constraints;
- affected public contracts and consumers;
- deferred decisions, unknowns, and required approvals.

Do not copy entire documents into the digest. Cite paths and summarize only decisions that constrain
the task graph.
