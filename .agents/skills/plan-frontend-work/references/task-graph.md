# Task graph

Represent every task with:

- task ID and Jira issue key;
- target agent;
- bounded objective and scope;
- dependencies and required artifacts;
- allowed source paths and forbidden `.docs/**`;
- acceptance criteria and required validation;
- required capabilities;
- expected YAML outputs;
- status and write surface.

Use two default waves:

```text
preparation: design + test-plan
implementation: coding -> testing
```

Parallelize only independent tasks with disjoint write surfaces. A test-plan task may run beside a
design task. Testing depends on the approved test plan and the relevant production contract.

Record omission reasons when design or test planning is unnecessary. Never omit a role merely
because its capability is missing; mark the workflow blocked instead.
