# Dependency adoption checklist

Collect traceable evidence before recommending adoption, vendoring, continued use, or replacement.
Unknown evidence remains a risk; absence of a finding is not proof of safety.

## Identity and provenance

- Canonical project and package name.
- Upstream repository and package registry URLs.
- Exact version, tag, commit, or artifact digest being evaluated.
- Publisher/maintainer identity and whether the package/repository relationship is verified.
- Release source, signatures or attestations when available, and resolved lockfile URL/integrity.
- Forks, patches, vendored changes, binaries, WASM, workers, generated bundles, and prebuilt assets.

## License evidence

- Declared package license and repository license file.
- License consistency across source, package metadata, copied assets, fonts, models, and examples.
- Attribution, notice, source-disclosure, redistribution, patent, or trademark obligations requiring
  human/legal review.
- Unknown or conflicting license evidence.

Record facts and questions; do not issue a legal conclusion.

## Maintenance and operational ownership

- Latest release and commit activity, without using activity alone as a quality score.
- Supported runtime/browser/package-manager versions.
- Published security policy and advisory channel.
- Open critical issues, abandoned forks, maintainer transitions, or release anomalies.
- Internal owner for updates, patches, incident response, and removal.
- Upgrade cadence, compatibility test surface, rollback, and exit strategy.

## Dependency and install surface

- Direct, transitive, optional, peer, bundled, Git, URL, local, and workspace dependencies.
- Lockfile presence/version and integrity/resolution coverage.
- `preinstall`, `install`, `postinstall`, `prepare`, publish, or other lifecycle scripts.
- Native addons, executable binaries, network fetches, code generation, and environment access.
- Registry configuration or credentials presence; never print credential values.

## Security evidence

- Known-advisory scan source, timestamp, database scope, and exact dependency tree.
- SBOM format and artifact scope when generated.
- Malicious-package/provenance checks when an approved tool exists.
- Application/browser threat review for runtime code; route that work to `audit-frontend-security`.
- Unscanned artifacts or unsupported ecosystems.

## Recommendation format

Report one recommendation with conditions:

- `adopt`: evidence and controls satisfy the approved risk threshold.
- `adopt-with-controls`: adoption requires named isolation, patching, monitoring, or upgrade actions.
- `hold`: missing evidence or unresolved risk blocks a decision.
- `reject`: evidence shows an unacceptable risk under the stated criteria.

Include evidence links, unknowns, internal owner, update/exit plan, and required approvals.
