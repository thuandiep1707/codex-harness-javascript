# Work decomposition gate

Apply this rule before creating or replanning Jira work.

## Semantic decomposition order

Always decompose in this order:

```text
requirement
-> user outcomes
-> functional slices
-> execution units
```

A `work-container` is optional grouping/context. A `functional-slice` is the acceptance and scope boundary. An `execution-unit` is independently actionable specialist work.

Do not assume these semantic levels are named `Feature`, `Task`, `Subtask`, `Epic`, `Story`, or any other Jira work type. Scrum Master must map semantic levels to the current project's available Jira work types through schema discovery.

Never start by splitting work into `design`, `test-plan`, `coding`, and `testing`. Specialist role is a routing decision after functional slices exist.

## Functional-slice contract

A functional slice must represent one cohesive user-observable or independently acceptable outcome. It is a scope and acceptance boundary, not a specialist execution unit.

A functional slice is valid only when it has:

- one primary outcome;
- one cohesive behavior boundary;
- a bounded acceptance boundary;
- explicit included and excluded scope;
- dependencies that do not hide another independently completable behavior.

Split again when two behaviors can reasonably be completed or accepted independently. A title with multiple independent actions joined by "và" is a warning to re-check granularity.

Do not split primarily by file, component, hook, API helper, or technical layer. Those are implementation details unless they independently deliver an approved functional outcome.

## Execution units

Only execution units are executable by specialists. For each functional slice create only the execution units actually required by evidence.

Do not create empty or fake execution units merely to make every functional slice have the same shape. When a specialist category is unnecessary, omit it and record the reason on the functional slice when that reason would otherwise be ambiguous.

Test Plan, Testing Logic, and Testing UI are transient developer self-verification roles in the frontend delivery workflow. Do not create separate Jira work items for those roles. Their verification evidence belongs to the owning Coding work item and is coordinated transiently by Main.

Scrum Master may record the intended specialist role for an execution unit but does not dispatch that specialist and does not select its internal capability packages.

## Jira representation

Resolve the project's actual Jira work types before mutation.

Map semantic levels to supported Jira work types and hierarchy/relationship capabilities. Do not require a one-to-one name match.

If the project cannot represent a required semantic boundary unambiguously with its available work types/relationships, block instead of inventing an unsupported hierarchy.

## Final granularity check

Before any Jira mutation, reject and split any proposed functional slice that is effectively a whole feature, contains multiple independently acceptable user outcomes, or would require one coding specialist to own several unrelated presentation/business responsibilities.
