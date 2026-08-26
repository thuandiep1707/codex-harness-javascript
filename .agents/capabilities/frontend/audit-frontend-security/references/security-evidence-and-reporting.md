# Security evidence and reporting

Preserve enough evidence for a developer to reproduce, prioritize, remediate, and retest a finding
without exposing secrets or unrelated personal data.

## Authorization record

- Requester and approved target/source/environment.
- Permitted methods, accounts/roles, network actions, data, and time window.
- Explicitly excluded systems and actions.
- Whether the task is source review, passive runtime review, active testing, remediation, or retest.

Stop when a useful next step exceeds authorization. Do not infer permission from accessible tooling.

## Finding schema

For each confirmed finding, report:

| Field            | Content                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------- |
| ID/title         | Stable short identifier and concrete weakness                                            |
| Status           | `confirmed`, `likely`, `needs-verification`, `not-reproducible`, or `fixed`              |
| Affected surface | Exact file/line, route, component, request, origin, role, and environment                |
| Preconditions    | Required account, state, data, browser, timing, or attacker capability                   |
| Reproduction     | Minimal authorized steps or source trace; redact sensitive values                        |
| Evidence         | Sanitized request/response, screenshot, trace, log, code path, or scanner artifact       |
| Impact           | Concrete confidentiality, integrity, availability, privacy, or authorization consequence |
| Severity         | Likelihood and impact rationale; name any scoring method and assumptions                 |
| Root cause       | Control or trust-boundary failure, not only the visible symptom                          |
| Remediation      | Smallest owning-layer fix plus compatibility/migration considerations                    |
| Validation       | Targeted retest and regression tests                                                     |
| Residual risk    | Unfixed variants, unsupported coverage, deployment/backend dependency, or accepted risk  |

Never upgrade a scanner alert to `confirmed` without applicability evidence. Never downgrade a
source-level weakness because no exploit was attempted when active testing was not authorized.

## Report summary

Include:

- scope, authority, methods, tools/versions, and evidence time;
- confirmed findings ordered by justified severity;
- likely/needs-verification items separated from confirmed findings;
- negative checks only for surfaces actually tested;
- tool errors, exclusions, unsupported environments, and unknown coverage;
- remediation order, owners, retest state, and residual/accepted risk; and
- an explicit statement that the review is bounded, not a guarantee of security.

## Retest

Reproduce the original condition, verify the owning control, test representative bypass variants,
run regression validation, and check direct consumers. Mark `fixed` only with evidence from the
approved environment; otherwise report the remaining verification requirement.
