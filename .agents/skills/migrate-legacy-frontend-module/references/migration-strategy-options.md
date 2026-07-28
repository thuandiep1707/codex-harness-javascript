# Migration strategy options

Treat every strategy below as a candidate, not a repository default. The project-wide migration
strategy is deferred until explicitly approved.

## Preconditions

- An intake report identifies an approved target bounded context and layer ownership.
- Critical current behavior and consumers are observable.
- Source and target can coexist or the inability to coexist is documented.
- API, data, auth, route, and release dependencies are known well enough to assess cutover risk.

## Candidate strategies

| Strategy                | Prefer when                                                                                 | Main risk                                                          | Required control                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Behavior/vertical slice | One user journey can be moved end-to-end behind a stable seam                               | Cross-cutting source dependencies make a slice wider than expected | Dependency map, characterization baseline, per-slice rollback        |
| Route-by-route          | Routes are independently delivered and share limited mutable state                          | Shared stores/providers create hidden coupling                     | Extract or bridge shared state explicitly before cutover             |
| Adapter-first           | Legacy UI can continue while API, browser, storage, or SDK calls move behind approved ports | Temporary adapters become permanent or leak vendor DTOs            | Named removal gate, owner, and target contract approval              |
| Component seam          | Stable UI pieces can move without carrying business orchestration                           | Visual reuse is mistaken for business ownership                    | Keep feature behavior in the module; verify all consumers            |
| Compatibility enclave   | A tightly coupled legacy area must run temporarily inside an isolated boundary              | Enclave grows or bypasses target conventions                       | Fixed scope, expiry/removal criteria, no new feature growth          |
| Big-bang replacement    | Coexistence is impossible and a coordinated release/rollback is demonstrably safer          | Large regression surface and weak failure isolation                | Explicit developer approval, full parity evidence, release rehearsal |

Hybrid strategies are valid only when each phase has one clear seam, owner, completion condition, and
removal condition.

## Selection criteria

Score options using task evidence:

1. Behavior criticality and tolerance for temporary divergence.
2. Source coupling, shared state, side effects, and framework/runtime differences.
3. Availability of characterization, unit/component, and browser tests.
4. API/data/auth contract stability and deferred architecture decisions.
5. Route coexistence, feature flags, rollout, observability, and rollback capability.
6. Team ownership, release windows, and permitted temporary debt.
7. Ability to remove bridges, compatibility code, and legacy source safely.

## Decision record

Record:

- selected strategy and rejected alternatives;
- evidence and assumptions;
- migration unit and dependency order;
- coexistence boundary;
- behavior baseline and validation layers;
- cutover and rollback trigger;
- temporary bridge/debt owner and removal gate; and
- decisions still awaiting architecture approval.

If selecting a strategy changes project-wide migration policy, update the plan and request approval;
do not encode the choice as a convention from one migration task.
