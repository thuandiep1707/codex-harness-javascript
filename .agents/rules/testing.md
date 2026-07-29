# Frontend Testing Rules

Apply this rule when creating, organizing, running, or reviewing tests in this repository (unit, component, integration, contract, visual, and E2E tests).

When writing or designing tests, always load and follow the specialized `testing` skill at `.agents/skills/testing/SKILL.md`.

---

## 1. Applicability Scope

- **Applies to**: Governed tasks that create or revise feature behavior, business logic, module
  behavior, critical API/component contracts, test code, or test configuration.
- **Exempt / Skipped**: Review-only and routine tasks, pure documentation or governance changes,
  minor typos, formatting, and behavior-neutral maintenance. Run only validation relevant to the
  changed files; lint/typecheck is not automatic for files outside their configured scope.

When classification is uncertain or a nominally routine change alters observable behavior, treat it
as governed. A task tier never overrides an explicit developer request for tests.

---

## 2. Test File and Folder Structure

Follow these standardized conventions for test file placement and naming:

### 1. Unit & Component Tests

- **Colocate with implementation file** under `src/`:
  - File naming: `<name>.test.ts` or `<name>.test.tsx`.
  - Example (Domain Service): `src/modules/<context>/domain/services/user.service.ts` $\rightarrow$ `src/modules/<context>/domain/services/user.service.test.ts`.
  - Example (Component/Hook): `src/modules/<context>/presentation/components/user-card.tsx` $\rightarrow$ `src/modules/<context>/presentation/components/user-card.test.tsx`.
  - Example (Shared Lib): `src/lib/api/server/axios.ts` $\rightarrow$ `src/lib/api/server/axios.test.ts`.

### 2. Integration & Module Boundary Tests

- **Place in module `__tests__` directory** or `tests/integration/`:
  - Module Integration: `src/modules/<context>/__tests__/integration/<scenario>.test.ts`.
  - Cross-Module Integration: `tests/integration/<flow-name>.test.ts`.

### 3. E2E & Browser Journey Tests (Playwright)

- **Place in top-level `e2e/` or `tests/e2e/`**:
  - File naming: `<feature-journey>.spec.ts` or `<feature-journey>.e2e.ts`.
  - Example: `e2e/auth/login-journey.spec.ts` or `tests/e2e/checkout-flow.spec.ts`.

### 4. Fixtures & Mocks

- Module-owned fixtures/mocks: `src/modules/<context>/__tests__/fixtures/` or `src/modules/<context>/__tests__/mocks/`.
- Shared/Global fixtures/mocks: `tests/fixtures/` or `tests/mocks/`.

---

## 3. Mocking & Fixture Principles

- Prefer real pure collaborators and small fakes over broad mocks.
- Avoid mocking private functions or reproducing implementation algorithms inside expected assertions.
- Keep tests deterministic: control time, randomness, network, storage, and external API seams.

---

## 4. Self-Test Execution & Validation

- AI Agents MUST run the appropriate test runner command (`npm run test`, `npx vitest run`, `npx playwright test`, or `npm run typecheck`) to verify test execution before marking status as `completed`.
- If tests fail, analyze error logs, fix the root cause, and re-run validation until all tests pass deterministically.

---

## 5. Decision Gate & Documentation Enforcement

- Governed plans whose testing workflow applies MUST include a dedicated
  `## Testing Workflow & Decision Gate` section. Review-only and routine exempt tasks do not add an
  artificial test section or prompt.
- Immediately after completing governed feature implementation and proportionate baseline
  verification, AI Agents MUST ask the Decision Gate prompt:
  > 🧪 **DECISION GATE**: Viết test **[Lớp Test]** cho **[Feature/Component]**? (**yes** / **no**)
- **Final Report Rule**: After executing (or blocking) test creation, the Testing specialist MUST
  return `test-report.yaml` and `agent-report.yaml` to Orchestrator. It MUST NOT read or update
  `.docs/`; Orchestrator owns Jira and workflow-state updates.
- **File Continuity**: When refactoring or updating existing features, ALWAYS update the existing `.analysis/<context>.md` file to prevent duplicate files.
- A governed in-scope plan without this section and prompt is invalid.
