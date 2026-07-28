---
name: audit-frontend-security
description: Perform authorized frontend and browser security reviews with scoped threat modeling, source and configuration inspection, safe scanner selection, evidence-backed findings, remediation guidance, and retesting. Use for XSS, CSRF, CSP, URL/input handling, tokens, cookies, sessions, client storage, authorization assumptions, browser messaging, realtime channels, uploads, workers, or third-party runtime threats; use the supply-chain skill for dependency provenance and license risk.
---

# Audit Frontend Security

## Goal

Find and communicate frontend weaknesses with reproducible evidence and explicit limits. Keep review,
active testing, remediation, and retest as separately authorized actions.

## Establish authorization before testing

1. Record requester, target source/environment, accounts/roles, permitted methods, data, network
   actions, time window, and excluded systems.
2. Distinguish source/config review, passive runtime inspection, active security testing, remediation,
   and retest.
3. Stop before any action outside the approved scope. Accessible tools or credentials do not expand
   authorization.
4. Never run destructive, denial-of-service, persistence, credential attack, production mutation, or
   third-party attack without explicit, specific authority.

Read [security-evidence-and-reporting.md](references/security-evidence-and-reporting.md) before
collecting sensitive evidence.

## Load authoritative context

- Read `AGENTS.md`, the approved task plan, `.analysis/README.md`, the owning context analysis,
  `.agents/rules/frontend-coding.md`, and relevant source/configuration. From the baseline rule,
  load only topic rules triggered by the reviewed surface, such as runtime, async-state, asset,
  accessibility, or styling rules.
- Read installed Next.js documentation for framework security behavior.
- Consult current primary security guidance and exact scanner documentation; do not rely on remembered
  versions or generic checklists.
- Route dependency, lockfile, provenance, license, SBOM, or package-advisory work to
  `audit-frontend-supply-chain` only when that evidence is in scope.

## Workflow

### 1. Build a task-local threat model

Read [browser-threat-matrix.md](references/browser-threat-matrix.md). Identify assets, actors, trust
boundaries, origins/execution contexts, entry points, untrusted data paths, sensitive operations,
existing controls, and where enforcement actually occurs.

Select applicable tests and record exclusions. Frontend permission checks do not prove server-side
authorization.

### 2. Trace source and configuration

- Follow untrusted data from source to render, URL, request, storage, message, worker, log, or vendor
  sink.
- Inspect token/cookie/session lifecycle, refresh races, cancellation/retry, logout, cache/storage, and
  cross-tab/realtime behavior.
- Inspect CSP-sensitive scripts/styles/frames/workers/WASM, browser globals, third-party origins,
  uploads/downloads, service workers, and telemetry.
- Record exact files, lines, routes, roles, requests, and assumptions. Redact secrets and unrelated
  personal data.

### 3. Select tools safely

- Discover installed tools and versions before proposing another scanner.
- Use static or passive checks first when they answer the question.
- Obtain required approval before network access, installation, authenticated runtime tests, artifact
  creation, or active payloads.
- Preserve raw output separately from validated findings and record tool errors/exclusions.
- Never auto-fix during an audit-only task.

### 4. Validate and prioritize findings

For each candidate:

1. Confirm the source/runtime path or mark `likely`/`needs-verification`.
2. State preconditions and realistic attacker capability.
3. Explain concrete impact and affected users/data/actions.
4. Assign severity from likelihood and impact with named assumptions.
5. Identify the owning control and smallest compatible remediation.
6. Define targeted retest and regression coverage.

Do not convert scanner alerts directly into confirmed vulnerabilities. Do not dismiss a source-level
weakness merely because active exploitation was outside authorization.

### 5. Remediate only when requested and approved

Follow DDD ownership and framework/template boundaries. Avoid weakening CSP, validation, typing,
linting, tests, or authentication to make a finding disappear. Return to plan approval when the fix
changes auth policy, API contracts, dependencies, deployment/CSP, or another deferred decision.

### 6. Report and retest

Use the finding/report schema in the reporting reference. Separate confirmed, likely,
needs-verification, fixed, and non-reproducible items. Report negative checks only for surfaces
actually tested and include residual/unknown coverage.

Mark a finding fixed only after authorized evidence verifies the original condition, representative
bypass variants, direct consumers, and regression validation.

## Compose only as required

- Add `audit-frontend-supply-chain` only for dependency/provenance/license/lock evidence.
- Add a test skill only when creating the corresponding regression layer.
- Do not enumerate unrelated skills.

## Guardrails

- Never expose credentials, session material, private endpoints, sensitive screenshots, or personal
  data in reports.
- Never call a frontend-only permission check a security boundary.
- Never claim comprehensive security from one review, scanner, environment, or successful build.
