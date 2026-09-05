# Frontend Development-Ready Document Flow

## Scope

This flow defines the Type 1 frontend documentation required before implementation can begin for an existing product codebase.

Type 1 frontend documents are:

1. Product / Feature Requirement
2. Functional Specification
3. UI / UX Design Specification

The flow does not duplicate knowledge that belongs to implementation skills or conventions. Architecture rules, package/library decisions, coding conventions, Next.js server/client conventions, API contracts, and data/database design are outside this document flow.

## Brownfield-first model

The default case is an existing project. Current source is read before the requested change is documented.

```text
Existing project
      ↓
1. Source Discovery
      ↓
2. Requirement Intake
      ↓
3. Gap Analysis
      ↓
4. Clarification
      ↓
5. Document Structuring
      ↓
6. Draft
      ↓
7. Consistency Review
      ↓
8. User Approval
      ↓
9. Finalize
```

## Flow

### 1. Source Discovery

Read the relevant current source to establish the existing feature/module behavior and identify what already exists.

### 2. Requirement Intake

Capture the user's requested change, addition, removal, or correction after the current behavior is understood.

### 3. Gap Analysis

Compare current behavior with requested behavior and identify the delta:

- what stays unchanged;
- what changes;
- what is added;
- what is removed.

Documentation should describe the required delta instead of redesigning an existing feature from scratch.

### 4. Clarification

Ask only for information that cannot be determined from the relevant source and the user's requirement. Do not guess unresolved product or UI behavior.

### 5. Document Structuring

Map the confirmed information into the required Type 1 frontend documents:

- Product / Feature Requirement;
- Functional Specification;
- UI / UX Design Specification.

### 6. Draft

Write the initial document content from the confirmed source context, requested change, and clarified decisions.

### 7. Consistency Review

Check consistency across:

- documentation and the user's requirement;
- documentation and current source behavior;
- the three Type 1 documents.

### 8. User Approval

The user reviews, corrects, and approves the documentation before it becomes final development input.

### 9. Finalize

Write the approved documentation to the product `.docs/` surface and mark the scope development-ready.

## Development-ready gate

The flow is complete when frontend development can begin without the developer having to guess product requirements, functional behavior, or UI/UX behavior.
