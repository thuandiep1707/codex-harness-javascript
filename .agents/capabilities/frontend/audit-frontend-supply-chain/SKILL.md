---
name: audit-frontend-supply-chain
description: Assess JavaScript/frontend dependencies or cloned source for license evidence, provenance, lockfile/integrity data, lifecycle scripts, advisory/SBOM evidence, maintenance, update, rollback, and exit risk. Use from Brain analysis/revalidation before approving third-party adoption or when dependency-focused security evidence is required.
---

# Audit Frontend Supply Chain

## Goal

Produce traceable adoption/continued-use/upgrade/rejection evidence for the analysis package. Separate
offline facts, network-backed advisory results, legal questions, runtime threats, and unknown coverage.

## Authority and scope

Use relevant product `.docs/`, current source/package/tooling configuration, exact external artifact
identity, and current Brain analysis context. Keep the audit read-only unless the user explicitly
assigns another action outside this skill.

Do not treat audit permission as install/update/fix/publish/adoption permission. Do not create local
plan/progress workflow files. Persistent scanner/SBOM output outside ordinary temporary tooling requires
explicit user/project authority; Jira later owns durable execution context if implementation work is
approved.

## Workflow

### 1. Collect offline evidence first

Use the bundled `inspect-js-supply-chain.mjs` helper when useful for supported manifest/lock evidence.
Inspect manifest, lockfile, repository metadata, license/notices, patches, lifecycle scripts, and
binary/WASM/worker artifacts directly as needed.

### 2. Evaluate adoption evidence

Read `references/dependency-adoption-checklist.md` when needed. Record:

- exact identity/provenance;
- declared/conflicting license evidence;
- maintainer/release/support signals;
- dependency/install/lifecycle surface;
- patch/update ownership, rollback, and exit strategy;
- missing/unverifiable evidence.

Do not convert metadata into a legal opinion or trust conclusion.

### 3. Scanner/SBOM evidence

Read `references/scanner-and-sbom-routing.md` only when vulnerability/component-inventory evidence is
required. Discover installed package-manager/scanner versions and use current official docs for
version-sensitive commands.

Network-backed scans or new tool installation require matching authorization. Never run automatic
remediation such as `npm audit fix` in an audit-only action.

Record tool/version/source/scope/timestamp/exclusions/exit status. A clean scan proves only the named
tool's covered checks.

### 4. Assess applicability

Separate observed facts, known advisory/policy findings, application/runtime applicability, unknown
coverage, proposed controls, and residual risk. Route XSS/CSRF/CSP/token/session/browser-message/runtime
threats to `audit-frontend-security` instead of duplicating them.

## Output

Return to Brain:

- exact source/package identity;
- evidence/tool sources;
- manifest/lock/install summary;
- license/provenance evidence and unanswered questions;
- findings with applicability/severity rationale;
- unknown coverage/limitations;
- update/monitoring/rollback/exit ownership;
- conditional recommendation: `adopt`, `adopt-with-controls`, `hold`, or `reject`.

Do not mark adoption ready while required identity, approval, license review, or critical evidence is
unknown. Never expose registry credentials/tokens/private secret-bearing URLs, equate lock integrity
with publisher identity/code safety, or present SBOM output as vulnerability/legal-compliance proof.
