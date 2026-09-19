---
name: plan-frontend-testing
description: Plan the smallest developer self-verification scope for one Coding execution unit from bounded relevant product docs, the actual source diff/current source, implementation evidence, and prior verification evidence. Use only for Test Plan; do not write or execute tests.
---

# Plan Frontend Testing

## Purpose

Plan developer self-verification for the current implementation change.

This capability does not define a standalone tester/QA workflow. It does not attempt exhaustive functional-requirement testing and does not replace Brain final acceptance.

## Evidence boundary

Read only:

1. the assigned transient `verification-handoff`;
2. product documents explicitly listed in that handoff;
3. the supplied source baseline/current state and changed-file/diff evidence;
4. bounded nearby source/config needed to understand the changed behavior;
5. the current implementation report;
6. previous Test Plan/test evidence when Main supplies it for delta revalidation.

Do not scan unrelated product docs, unrelated source, or chat history.

## Decide self-test route

Identify only verification targets justified by the actual change and its relevant product behavior/risk.

Choose exactly one route:

- `none`: no additional Logic/UI self-test is justified for the current delta;
- `logic`: unit/component/integration self-test is sufficient;
- `ui`: real-browser UI self-test is required;
- `both`: both evidence classes are required.

Test Plan alone owns this classification. Main and Scrum Master must not reinterpret it.

Do not require a test merely because an acceptance criterion exists. Relevant product requirements provide behavioral context; the source change and risk determine the developer self-test scope.

## Verification targets

For each target record:

- the changed behavior or regression risk being checked;
- the exact evidence that made it relevant;
- the smallest useful test layer;
- bounded scenarios;
- expected evidence;
- bounded test-write scope when new/updated tests are required.

Avoid duplicated coverage across layers unless the layers prove materially different risks.

## Delta revalidation

When production source changes after a production defect:

1. compare the new source state against the source state covered by the previous Test Plan/test reports;
2. retain still-valid verification targets/evidence;
3. invalidate only targets affected by the new source or relevant-document delta;
4. return a route for the affected verification only.

A test-only mismatch must remain inside the current Testing child lifecycle and must not trigger a new Test Plan cycle.

## Output

Return `.protocols/test-plan-artifact.yaml` plus `.protocols/agent-report.yaml`.

Do not write product/test source, execute tests, update Jira, create Jira work items, or perform final product acceptance.
