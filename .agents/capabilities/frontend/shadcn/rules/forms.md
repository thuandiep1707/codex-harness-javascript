# Forms & Inputs

## Preconditions

Verify every referenced primitive exists under the resolved project UI path or
is explicitly approved for addition. This reference does not authorize running
`shadcn add`, adding dependencies, or importing absent components. Preview any
approved addition with `--dry-run` and `--diff`, then follow the repository
semantics/accessibility and component API rules.

## Scope

Use this file to implement the API of form primitives already selected by an
approved design and the repository semantics rule. Do not use it to choose a
control from product meaning, invent validation behavior, or authorize a form
library, dependency, hook, or state owner.

Inspect installed source or version-appropriate docs before using these
contracts. Base and Radix variants can expose different props.

## Field mechanics

- When the installed `Field` family is selected, compose `FieldGroup`, `Field`,
  `FieldLabel`, `FieldDescription`, and related parts according to their local
  source contract.
- When the installed API uses `data-invalid` or `data-disabled` on `Field`, pair
  it with the native/ARIA state required on the actual control. Let the semantics
  rule own labels, error association, focus, and accessible behavior.
- Use `FieldSet` and `FieldLegend` only when that selected primitive maps to the
  semantic grouping approved for the task.

## InputGroup mechanics

When `InputGroup` is selected, use its own installed input and addon parts rather
than nesting unrelated `Input` or `Textarea` components inside it. Verify exact
part names locally; common parts include `InputGroupInput`,
`InputGroupTextarea`, and `InputGroupAddon`.

Do not create absolute-positioned input controls merely to imitate an
`InputGroup` example. The approved design, semantics, and styling rules decide
whether an embedded action is appropriate.

## Choice-control mechanics

Do not select `Switch`, `Checkbox`, `RadioGroup`, `Select`, `Combobox`, or
`ToggleGroup` from a numeric option-count heuristic. Let product meaning,
interaction semantics, and the approved design choose the control.

After `ToggleGroup` is selected, use `ToggleGroupItem` and inspect the configured
base before setting `defaultValue`, `type`, or `multiple`. Read
[base-vs-radix.md](./base-vs-radix.md#togglegroup) only for that API difference.

## Return to the main transaction

If any referenced primitive is absent, do not import it or substitute a new
custom abstraction from this file. Return its exact name to the main shadcn
inspect/gate/apply workflow.
