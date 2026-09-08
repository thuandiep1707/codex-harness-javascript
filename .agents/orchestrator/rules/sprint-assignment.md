# Sprint assignment gate

Apply to planning/replanning for both `plan-only` and `deliver`. All reads and mutations below are
exact `jira-call` controller actions. Return `awaiting-controller` until the Primary Controller
supplies the correlated result; never invent connector operations or call Jira directly.

## Scope

Sprint-level work means parent Task/Story issues carrying functional slices for current execution,
including newly created issues and existing issues reconciled into that scope. Specialists still
execute only Subtasks. Do not submit Subtasks to the sprint move operation; verify their parent.
Feature/Epic containers are excluded by default. Include an Epic only when explicit user direction
or an established project convention requires it and Jira supports that operation.

## Resolve, assign, verify

1. Resolve the Jira site/project and matching Scrum board from supplied context and confirmed Jira
   reads. Validate an explicit board ID; otherwise use the connector equivalent of
   `GET /rest/agile/1.0/board?projectKeyOrId=<project>&type=scrum`, following
   pagination. Use established project mapping to disambiguate. Never pick the first board or infer
   its ID from a name. No matching board or unresolved multiple matches blocks this gate.
2. List that board's sprints using the connector equivalent of
   `GET /rest/agile/1.0/board/{boardId}/sprint?state=active`, following all pages before deciding uniqueness.
   Use an explicitly selected active sprint when verified on that board; otherwise require exactly
   one active candidate. Retain site, project key, board ID, sprint ID, name, state, and selection
   evidence once for this planning flow. Never reuse a prior flow's sprint merely from chat history
   or match only `Sprint 18` by name. Zero or ambiguous active candidates blocks planning; do not
   create/start a sprint or silently choose Backlog/future work.
3. Create/reconcile the functional Tasks and required specialist Subtasks, retaining every confirmed
   parent issue key in the affected scope. Keep `task-tree` non-ready while this gate is pending;
   invalidate a previous ready marker for affected replanned scope before mutations. A partially
   created graph must remain recoverable from Jira, not be recreated on retry.
4. Explicitly assign the in-scope parent issue keys to the resolved sprint ID using the supported
   Jira sprint move operation. With Jira Software REST this is
   `POST /rest/agile/1.0/sprint/{sprintId}/issue` with `{"issues":["<parent-key>"]}`;
   split into batches of at most 50 issues. Do not request ranking changes. Use a connector's
   documented equivalent, or a discovered editable Sprint field only when its metadata and input
   format are confirmed. Never guess a `customfield_*` ID or assume Epic inheritance assigned Tasks.
5. After confirmed writes, read back every affected parent issue, requesting its Sprint field.
   Discover the site-specific field through metadata when needed, or use Jira Software's structured
   issue sprint representation. Compare numeric IDs (normalizing number/string forms), not names,
   and require the selected active sprint rather than a historical closed sprint. Missing, null,
   omitted, unreadable, or different Sprint values are unverified. Read all requested issues/pages;
   a partial response or one successful sample cannot establish full coverage. Recheck the selected
   sprint's active state before completing the gate; if it closed, block and resolve the changed
   context explicitly rather than silently switching targets within this flow.
6. Record `sprint-assignment` evidence in the reconciliation report: selected context, full required
   key set, per-issue observed sprint IDs, read action IDs, and unresolved keys. Persist a compact
   summary on the Jira Feature context (IDs, covered keys, verification time, exceptions/blocker),
   using Vietnamese prose with exact machine identifiers. Only after all required keys are verified
   and that durable write is confirmed may `task-tree: ready` be written. Only after the ready write
   is confirmed may `plan-only` finish or `deliver` dispatch specialists. Do not batch dispatch with
   a pending assignment, verification read, or ready-marker write.

## Failure and recovery

- No unique board/active sprint: return `blocked` with candidates and the missing decision. An
  explicitly authorized Backlog/Kanban policy may use `not-applicable`, recording the user's or
  established project's policy as evidence; never infer this exception from an empty response.
- A failed controller transport establishes a capability/permission failure. Record its exact result
  and return `runtime-capability-blocked` when the required operation is unavailable; do not treat a
  tool absent only in the child as proof. Do not install credentials or invent an API fallback.
- Failed/partial assignment or mismatched read-back: keep the graph non-ready and dispatch nothing.
  Re-read affected keys before retrying an uncertain write, preserve successfully assigned issues,
  and repair only unresolved keys against the same still-active target. Use at most one repair pass
  per reconciliation attempt, then `blocked` with expected/observed IDs and affected keys. Do not
  duplicate Tasks or move unrelated/completed work to make verification pass.
- Resume must not trust a legacy `task-tree: ready` marker without sprint evidence. Read the current
  parent and compact Feature evidence only. If evidence is missing/stale or membership differs,
  reconcile sprint assignment for affected unfinished scope through this gate before dispatch;
  do not rerun Brain/decomposition or scan the whole project/sprint. Never migrate work to a new
  sprint solely because a new chat started.

## API references

- [Board discovery and active sprint listing](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/)
- [Sprint lookup and issue assignment](https://developer.atlassian.com/cloud/jira/software/rest/api-group-sprint/)
- [Structured sprint field representations](https://developer.atlassian.com/cloud/jira/software/rest/)
