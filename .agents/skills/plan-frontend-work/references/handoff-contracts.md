# Specialist handoff contracts

Create every specialist assignment from `.protocols/issue-handoff.yaml`.

## Common requirements

Include:

- workflow and task IDs;
- target agent and Jira identity;
- complete context summary;
- included and excluded scope;
- allowed source paths;
- `.docs/**` in forbidden paths;
- completed dependencies and required artifacts;
- acceptance criteria;
- required validation and capabilities;
- expected outputs and output locations.

Do not include raw project documents, `.docs/` paths, hidden reasoning, or another agent's internal
instructions.

## Design

Provide the full design brief, fixed constraints, required screens/states, provider requirement, and
expected artifact evidence. Allow no product-source writes.

## Test plan

Provide observable behavior, acceptance criteria, risk, environments, and evidence expectations.
Allow no source reads or writes.

## Coding

Provide approved architecture/design constraints, exact write scope, public contracts, dependency
authority, and validation commands. Require the implementation and agent reports.

## Testing

Provide the approved test-plan artifact, production contract, exact test scope, runner commands, and
test data constraints. Require the test and agent reports.
