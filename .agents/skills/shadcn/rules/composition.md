# Component Composition

## Preconditions

Verify each suggested primitive is installed or explicitly approved for
addition before using these patterns. This reference does not authorize a new
shared component, dependency, template contract, or replacement of an approved
design. Repository DDD, Atomic placement, accessibility, and async-state rules
remain authoritative.

## Scope

Use this file only after the project has selected an installed or approved
shadcn primitive. Let the approved design and repository topic rules decide
whether an alert, empty state, toast, overlay, card, separator, skeleton, badge,
or other pattern is appropriate. The examples below describe component-tree
contracts; they do not make that product or architecture decision.

Inspect installed source or version-appropriate docs before relying on a
contract. Generated source in the repository wins over this imported summary.

## Required-parent mechanics

Keep item parts under the group/content part required by the installed API.
Common examples include:

| Item                                                   | Required parent             |
| ------------------------------------------------------ | --------------------------- |
| `SelectItem`, `SelectLabel`                            | `SelectGroup`               |
| `DropdownMenuItem`, `DropdownMenuLabel`                | `DropdownMenuGroup`         |
| `MenubarItem`                                          | `MenubarGroup`              |
| `ContextMenuItem`                                      | `ContextMenuGroup`          |
| `CommandItem`                                          | `CommandGroup`              |
| `TabsTrigger`                                          | `TabsList`                  |
| `MessageScrollerItem`                                  | `MessageScrollerContent`    |
| `Message`, `Bubble`, or `Attachment` grouped by source | Matching installed `*Group` |

Read [chat.md](./chat.md) for an approved chat registry artifact. Read
[base-vs-radix.md](./base-vs-radix.md) when trigger composition differs by the
configured primitive base.

## Installed component contracts

- When the selected overlay API requires a title, include its installed title
  part. Let the semantics rule decide accessible naming and visually hidden
  treatment.
- Compose selected Card parts according to content structure; do not invent
  unsupported convenience props.
- Treat Button pending/loading behavior as composition unless the installed
  Button exposes that contract. Use the async-state and semantics rules to decide
  behavior.
- Include `AvatarFallback` when the selected Avatar contract and product behavior
  require image failure fallback.
- Use only variants and parts exposed by the installed component. Do not infer an
  API from an upstream example for another base or version.

## Selection boundary

Do not use this reference to replace custom markup automatically. Search local
components first, then let Atomic ownership, design, semantics, async-state, and
styling evidence select the component. If the selected primitive is absent,
return to the shadcn inspect/gate/apply transaction before importing it.
