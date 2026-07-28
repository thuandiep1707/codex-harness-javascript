---
name: audit-frontend-supply-chain
description: Assess JavaScript/frontend dependencies or cloned source for license evidence, provenance, lockfile and integrity data, lifecycle scripts, advisory or SBOM evidence, maintenance, update, and exit risk. Use before adopting, vendoring, upgrading, or approving third-party source and for dependency-focused security reviews.
---

# Audit Frontend Supply Chain

## Goal

Produce an adoption, continued-use, upgrade, or rejection recommendation from traceable evidence.
Separate offline facts, network-backed advisory results, legal questions, runtime threats, and unknown
coverage.

## Establish authority and scope

1. Read `AGENTS.md`, the active task scope, and relevant package/tooling configuration.
2. Accept an exact read-only artifact handoff before implementation approval when it records source,
   version/commit/item, intended use, previewed files/dependencies, and unresolved evidence.
3. Confirm whether network access, external repository reads, scanner execution, or persistent audit
   artifacts are authorized separately from package installation or remediation.
4. Keep the audit read-only. An audit recommendation is evidence for a later approval; it never
   authorizes installation, source adoption, update, remediation, or other repository mutation.

Do not treat a request to audit as permission to install, update, fix, publish, or contact a live
system.

## Workflow

### 1. Collect offline evidence first

Run the bundled helper from the skill directory:

```powershell
node scripts/inspect-js-supply-chain.mjs --root <project-root> --format markdown
```

Use its output as manifest and supported npm lockfile evidence only. Read the manifest, lockfile,
repository metadata, license files, notices, patches, and binary/WASM/worker artifacts directly as
needed.

### 2. Evaluate adoption evidence

Read [dependency-adoption-checklist.md](references/dependency-adoption-checklist.md). Record:

- identity, provenance, and exact artifact;
- declared and conflicting license evidence;
- maintainer, release, support, and incident channels;
- dependency and install/lifecycle surface;
- update, patch, ownership, rollback, and exit plans; and
- missing or unverifiable evidence.

Do not convert metadata into a legal opinion or a trust conclusion.

### 3. Route scanners and SBOMs conditionally

Read [scanner-and-sbom-routing.md](references/scanner-and-sbom-routing.md) only when vulnerability or
component inventory evidence is requested.

- Discover the installed package manager and scanner versions.
- Consult current official documentation before running version-sensitive commands.
- Request approval before installing tools, using network-backed scans, or writing persistent
  reports/SBOMs outside the approved plan.
- Never run automatic remediation such as `npm audit fix` during an audit-only task.

Record command, version, database/source, scope, timestamp, exclusions, exit code, and raw artifact
location. A successful scan means only that the named tool reported no covered finding.

### 4. Assess risk and applicability

Separate each item into:

1. Observed fact.
2. Known advisory or policy finding.
3. Application/runtime applicability.
4. Unknown or unsupported coverage.
5. Proposed control and residual risk.

Route XSS, CSRF, CSP, token/session, browser messaging, input/output, or runtime behavior to
`audit-frontend-security`. Do not duplicate that threat review here.

### 5. Return a decision package

Return:

- evaluated source/package identity;
- tools and evidence sources;
- manifest/lock/install summary;
- license and provenance evidence with unanswered questions;
- findings with applicability and severity rationale;
- unknown coverage and limitations;
- update/monitoring/rollback/exit ownership; and
- one conditional recommendation: `adopt`, `adopt-with-controls`, `hold`, or `reject`.

Do not mark adoption ready when a required approval, license review, artifact identity, or critical
evidence remains unknown.

When the audit follows shadcn inspect-only discovery, preserve the exact registry address and version
or resolved commit from the handoff. A similarly named item is a different adoption decision.

## Compose only as required

- Run after `design-frontend-module-boundary` when ownership is unresolved and before
  `integrate-third-party-frontend` when onboarding external source.
- For community/GitHub shadcn source, accept the exact item from shadcn inspect-only mode, return the
  recommendation for developer approval, then hand the approved identity back to shadcn apply mode.
- Add `audit-frontend-security` only for application/browser threat surfaces.
- Load test skills only when creating the corresponding verification layer.

Do not enumerate or read unrelated skill bodies.

## Guardrails

- Never print registry credentials, tokens, private URLs with embedded secrets, or environment values.
- Never equate lockfile integrity with publisher identity or code safety.
- Never report an SBOM as a vulnerability or license-compliance result.
- Never hide unsupported lockfiles, scanner errors, exclusions, stale databases, or network failures.
