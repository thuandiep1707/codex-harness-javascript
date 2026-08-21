# Specialist handoff contracts

Create every specialist assignment from `.protocols/issue-handoff.yaml` and bind it to exactly one
Jira Subtask.

The handoff is a runtime communication payload. Do not persist it into the working repository.

## Common requirements

Include:

- workflow and Subtask IDs;
- parent Jira Task key and Subtask key;
- target agent;
- complete context summary prepared by Orchestrator;
- included and excluded scope;
- allowed source paths;
- `.docs/**` in forbidden paths;
- completed dependencies and required runtime artifacts;
- acceptance criteria;
- required validation and capabilities;
- expected outputs.

Do not include raw project documents, `.docs/` paths, hidden reasoning, or another agent's internal
instructions.

If a handoff contains multiple independently executable responsibilities, reject the handoff and ask
Orchestrator to split the Jira Subtask before execution.

## Design

Provide the full bounded design brief, fixed constraints, required screens/states, provider
requirement, and expected artifact evidence. Allow no product-source writes.

## Test plan

Provide observable behavior, acceptance criteria, risk, environments, and evidence expectations.
Allow no source reads or writes.

## Coding

Provide approved architecture/design constraints, one cohesive implementation objective, exact write
scope, public contracts, dependency authority, and validation commands. Require the implementation
and agent reports.

A Coding handoff must not use a whole feature or whole page as the scope when meaningful sections,
routes, data responsibilities, or interactions can be implemented and reviewed independently.

## Testing

Provide the approved test-plan artifact, production contract, exact test scope, runner commands, and
test data constraints. Require the test and agent reports.
