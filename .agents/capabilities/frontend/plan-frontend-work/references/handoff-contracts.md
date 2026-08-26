# Specialist handoff contracts

Create every specialist assignment as one transient object matching `.protocols/issue-handoff.yaml`.
Do not persist handoff files into the product repository.

## Context construction

Compose the handoff from the smallest durable Jira chain:

1. Feature common context;
2. parent Task functional delta;
3. current Subtask execution delta;
4. direct completed dependency evidence;
5. only necessary current source/provider state.

Do not include unrelated sibling Tasks/Subtasks, full comment history, raw project documents, `.docs/`
paths, original chat history, hidden reasoning, or another agent's internal instructions.

## Common requirements

Include:

- working-project identity and workflow mode;
- Feature, Task, and Subtask Jira keys;
- target agent and current assignee/status when relevant;
- composed bounded objective and context summary;
- included and excluded scope;
- allowed source/provider surfaces and forbidden `.docs/**`;
- direct dependencies and durable dependency evidence;
- acceptance criteria relevant to this Subtask;
- required validation and capabilities;
- expected structured outputs.

The packet must be sufficient for a fresh specialist with no chat memory to execute or return a
precise blocker.

## Durable pause checkpoint

A user-requested pause is not a specialist handoff packet. Orchestrator builds a separate transient
object matching `.protocols/pause-checkpoint.yaml`, then persists its human-facing projection to Jira
as one `[HANDOFF]` note.

The durable Jira note must be concise, in Vietnamese, and contain only fields needed to continue:

```text
[HANDOFF]

Source:
- repository: <repository when relevant>
- branch: <branch when relevant>
- commit: <commit when relevant>

Đã hoàn thành:
- <proven completed scope/result>

Còn lại:
- <unfinished scope>

Validation:
- <latest proven validation state>

Blocker:
- <blocker or "Không có">

Tiếp theo:
- <next Jira key and/or concrete next action>
```

Omit source fields that are genuinely irrelevant, but for changed code prefer repository + branch +
commit so another machine can verify that it has the checkpointed source. Never infer completion from
status alone; use specialist reports, validation evidence, and current source state.

Before writing `[HANDOFF]`, persist any missing `[RESULT]` evidence and status corrections that are
already proven. Do not use the handoff note to hide a stale Jira state.

Write the handoff at the single unfinished continuation point. If a current Subtask remains active,
that Subtask owns the note. If the active Subtask is proven complete and another existing Subtask is
the deterministic next continuation point, finish the first result/status reconciliation and attach
the handoff to the next Subtask. Do not create a synthetic pause Task.

A pause is complete only when this durable note is confirmed in Jira. If persistence fails, return
`pause-blocked`; do not claim safe handoff.

## Design

Provide the design brief, fixed constraints, required screens/states, provider requirement, and
expected design evidence. Allow no product-source writes.

## Test plan

Provide observable behavior, relevant acceptance criteria, risk, environments, and evidence
expectations. Allow no product-source reads/writes unless explicitly required by the specialist
contract.

## Coding

Provide approved architecture/design constraints, exact functional slice, allowed write scope, public
contracts, direct dependency evidence, and validation commands. Require implementation and agent
reports. UI/component work must also satisfy the Coding specialist's decomposition gate before source
write.

## Testing

Provide approved test-plan evidence, relevant production contract, exact test scope, runner commands,
and test-data constraints. Require test and agent reports.
