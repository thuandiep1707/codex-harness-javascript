# Scanner and SBOM routing

Use current official documentation and the installed tool version. Do not copy commands from memory
when flags, network behavior, output formats, or mutation semantics may differ.

## 1. Start offline

Run the bundled helper first:

```powershell
node scripts/inspect-js-supply-chain.mjs --root <project-root> --format markdown
```

It reads manifests and npm lock evidence only. It does not contact a registry, inspect installed
package contents, determine licenses, or report vulnerabilities.

## 2. Discover available tools

- Identify the package manager and exact CLI version.
- Inspect repository scripts and CI before adding a parallel scanner.
- Prefer an already approved organization tool and its official documentation.
- Do not install a scanner, update dependencies, or create a persistent artifact without plan
  approval.

## 3. Known-advisory scans

For npm projects, consult the current [npm audit documentation](https://docs.npmjs.com/cli/commands/npm-audit/).
Treat `npm audit` as network-backed unless verified otherwise. Capture JSON only when an approved
artifact location exists. Never run `npm audit fix`, `--force`, or another remediation command during
an audit-only task; remediation can invoke installation and change the dependency tree.

For another ecosystem or an installed scanner such as OSV-Scanner, use that tool's official docs and
record database coverage, version, exclusions, exit code, and scan time.

## 4. SBOM generation

For supported npm versions, consult the current [npm sbom documentation](https://docs.npmjs.com/cli/commands/npm-sbom/).
Choose SPDX or CycloneDX according to the consumer contract. Record whether output represents the
lockfile, installed tree, workspace root, omitted dependency classes, and generated timestamp.

An SBOM inventories components; it is not a vulnerability, license-compliance, or provenance verdict.

## 5. Interpret results

Separate:

- observed manifest/lock facts;
- known advisories returned by a named database;
- scanner errors and unsupported artifacts;
- applicability to the application's reachable runtime;
- remediation options and their compatibility risk; and
- unknown risk outside tool coverage.

Use the [OpenSSF software supply-chain resources](https://openssf.org/technical-initiatives/software-supply-chain/)
for current integrity/provenance initiatives. Do not convert a best-practice catalog into a claim of
project compliance without evidence.
