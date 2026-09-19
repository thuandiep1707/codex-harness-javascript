# Jira schema discovery

Apply this rule before Scrum Master creates or edits Jira work.

## Discover before assuming

Never hardcode a project-specific Jira work type, field ID, field name, option value, status name, label, hierarchy convention, or custom-field convention as a universal harness rule.

For create/replan operations:

1. resolve the target Jira project;
2. list issue/work types available in that project;
3. map semantic work roles (`work-container`, `functional-slice`, `execution-unit`) to supported Jira work types and relationships;
4. load create-field metadata for each selected project + work type with optional fields included;
5. inspect field schema/type, required flag, supported operations, and allowed values when exposed;
6. resolve semantic workflow intent to the best supported field/value pair before mutation.

For edits to an existing issue:

1. load only the issue fields needed for the requested mutation;
2. request editable-field metadata when field selection/value validation is required;
3. for workflow-state changes, inspect valid transitions for the current issue rather than assuming a literal status name can be reached directly.

## Semantic work roles

Harness work structure is semantic:

```text
work-container   # optional grouping/context
functional-slice # scope + acceptance boundary
execution-unit   # independently actionable specialist work
```

These names are not Jira issue types. A project may represent them with `Epic`, `Feature`, `Story`, `Task`, `Bug`, `Sub-task`, custom work types, links, or a smaller supported hierarchy.

Do not require a one-to-one name match. Preserve semantic boundaries using the project's supported work types and relationships. If a required boundary cannot be represented unambiguously, block instead of inventing unsupported Jira structure.

## Semantic field resolution

Harness rules express semantic intent, not project-specific field names.

Examples of semantic intent include:

- work category = design;
- work category = logic;
- work category = UI;
- execution owner = initiating Jira user;
- workflow state = active;
- workflow state = terminal/completed.

Resolve semantic intent against the current project's actual fields and options.

Resolution policy:

- exact semantic match -> use it;
- clearly compatible match -> use it and report the mapping;
- optional field with no reliable match -> omit it;
- required field with no reliable value -> block the mutation and report the unresolved field;
- ambiguous competing matches -> block instead of guessing;
- never create a new option, label, field, work type, or status merely because no suitable existing value was found.

A label is not a universal fallback for a missing semantic field. Use labels only when the current Jira schema and workflow intent make labels the selected field.

## Field/value types

Respect the Jira field schema returned by metadata. Do not serialize every value as a string.

Use the field's actual shape for strings, numbers, dates, users, options, arrays, and other supported Jira field types.

When a field uses dynamic values that are not fully enumerated in `allowedValues`, use an available purpose-built Jira resolver when required. Do not infer an ID from display text.

Owner/reporter intent must also be resolved dynamically. Do not assume `assignee` or `reporter` exists or accepts the initiating user.

## Workflow states and transitions

Project status metadata describes states configured for a Jira work type. It does not prove the current issue can transition to that state.

Harness terms such as `active`, `non-terminal`, `acceptance-ready`, and `terminal/completed` are semantics, not literal Jira status names.

For an existing issue, use its currently valid transition metadata before changing workflow state.

## Sprint operations

Do not treat `Sprint` as a universal field. When sprint behavior is explicitly requested, resolve the project's board/sprint capability and use the supported Jira operation for that project.

## Transient schema cache

Within one Scrum Master invocation, reuse discovered metadata for the same:

```text
project + work type
```

Do not repeatedly fetch identical create metadata for every work item of the same type.

This cache is transient execution context only. Do not persist Jira schema snapshots into the product repository or use them as durable workflow truth.

## Reporting

Do not return the full discovered Jira schema to Main.

In `jira-work-report`, record only field resolutions that were actually used for a mutation, including semantic intent, selected field identity, selected value, and resolution confidence.

Do not include unused field catalogs or full allowed-value lists.
