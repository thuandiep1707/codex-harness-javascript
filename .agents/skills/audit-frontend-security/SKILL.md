---
name: audit-frontend-security
description: Perform authorized frontend/browser security analysis with scoped threat modeling, source/config inspection, evidence-backed findings, remediation guidance, and retest requirements. Use from Brain analysis/revalidation for XSS, CSRF, CSP, URL/input handling, tokens, cookies, sessions, client storage, authorization assumptions, browser messaging, realtime channels, uploads, workers, or third-party runtime threats.
---

# Audit Frontend Security

## Goal

Produce security evidence for the analysis package without creating a second work-management or
approval system. Keep review, active testing, remediation, and retest as separately authorized actions.

## Authorization first

Before active security testing, establish target/environment, permitted accounts/roles, methods,
network/data actions, and exclusions from the user request or approved project evidence. Accessible
tools/credentials do not expand authorization.

Never perform destructive, denial-of-service, persistence, credential attacks, production mutation,
or third-party attacks without explicit specific authority.

Read `references/security-evidence-and-reporting.md` before collecting sensitive evidence.

## Authority and context

Use relevant product `.docs/`, current source/configuration, current Brain analysis context, installed
framework documentation, and current primary security/tool documentation when required.

Do not read/update `.analysis/`, local plan/progress files, or Jira execution state from this skill.
Do not use Coding rules as product requirement authority; inspect them only when necessary to assess an
already-established implementation convention.

Route dependency/provenance/license/SBOM evidence to `audit-frontend-supply-chain` when required.

## Workflow

### 1. Build a scoped threat model

Read `references/browser-threat-matrix.md` when needed. Identify assets, actors, trust boundaries,
origins/execution contexts, entry points, untrusted data paths, sensitive operations, existing
controls, and actual enforcement location.

Frontend permission checks are never evidence of server-side authorization by themselves.

### 2. Trace source/configuration

Follow untrusted data to render, URL, request, storage, browser message, worker, log, or vendor sinks.
Inspect applicable token/cookie/session lifecycle, CSP-sensitive resources, third-party origins,
upload/download flows, realtime/browser messaging, storage/cache, workers, and telemetry.

Record exact evidence while redacting secrets and unrelated personal data.

### 3. Use tools safely

Use static/passive evidence first. Network access, new tool installation, authenticated runtime tests,
artifact creation, or active payloads require matching authorization. Preserve scanner output as tool
evidence, not automatically confirmed findings. Never auto-fix during analysis-only work.

### 4. Validate findings

For each candidate finding, record:

1. evidence and confidence (`confirmed`, `likely`, `needs-verification`);
2. prerequisites/attacker capability;
3. concrete impact and affected surface;
4. severity rationale with assumptions;
5. owning control and smallest compatible remediation direction;
6. required retest/regression evidence.

Do not promote raw scanner alerts to confirmed vulnerabilities.

## Architecture/remediation boundary

Brain may recommend constraints/remediation direction in the analysis package, but it must not create
or execute remediation work. If a fix changes auth policy, API contract, dependency, CSP/deployment,
or another architecture decision, record that impact for Orchestrator/Jira planning after approval.

## Output

Return threat-model scope, findings/evidence, confidence/severity rationale, required architecture or
implementation constraints, retest requirements, exclusions, unknown coverage, and residual risk to
Brain.

Never expose credentials/session material/private endpoints/sensitive screenshots/personal data and
never claim comprehensive security from one review, scanner, environment, or successful build.
