# Component decomposition gate

Load this rule for every Coding Subtask. It is intentionally small; load the full
`.agents/rules/frontend/atomic-components.md` only when this gate is triggered.

## Trigger

The gate is triggered when the assigned Subtask creates, reconstructs, splits, or materially changes
a React/Next.js page, screen, layout, TSX component, component contract, or meaningful UI composition.

If the Subtask does not involve component structure, continue without loading the Atomic rule.

## Before source write

When triggered, do not write implementation source until all of the following are identified from the
handoff and current source:

1. composition root for the assigned functional slice;
2. meaningful presentation responsibilities inside that root;
3. existing components/primitives that can own each responsibility;
4. module/shared ownership and intended target file for each new responsibility;
5. smallest public contract required by direct consumers.

Then load `.agents/rules/frontend/atomic-components.md` and apply its decomposition/ownership rules.

A page or screen must remain a composition root when it contains multiple independent presentation
responsibilities. Do not implement the complete screen in one file first and postpone extraction.

## Oversized handwritten TSX safety net

Line count is an alarm, not the architecture rule:

- at `>= 300` lines, explicitly review decomposition before completion;
- at `>= 500` lines, the Subtask cannot be reported complete until the file is split or a developer-
  approved exception is recorded;
- generated/vendor source is exempt when clearly identified and not project-authored UI logic.

Never extract arbitrary wrappers merely to reduce line count. Split by cohesive responsibility and
ownership.

## Completion evidence

The implementation report must identify composition roots, created/reused meaningful components,
decomposition decisions, oversized handwritten TSX files, and any approved exception. If the gate
cannot be satisfied without changing architecture or scope, stop and return a blocker to Orchestrator.
