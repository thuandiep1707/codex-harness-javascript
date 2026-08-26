#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const HELP = `Usage:
  node inspect-js-supply-chain.mjs --root <directory> [--format markdown|json]

Collects deterministic, offline, read-only JavaScript manifest and npm lockfile evidence. It does
not contact registries, generate an SBOM, determine license compliance, or report vulnerabilities.`;
const dependencySections = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];
const lifecycleNames = new Set([
  'install',
  'postinstall',
  'postpack',
  'postpublish',
  'preinstall',
  'prepack',
  'prepare',
  'prepublish',
  'prepublishOnly',
  'publish',
]);
const knownLockfiles = [
  'bun.lock',
  'bun.lockb',
  'npm-shrinkwrap.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
];

function parseArgs(argv) {
  const options = { format: 'markdown', root: null };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') return { help: true };
    if (argument === '--root') options.root = argv[++index];
    else if (argument === '--format') options.format = argv[++index];
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!options.root) throw new Error('Missing required --root <directory>.');
  if (!['json', 'markdown'].includes(options.format)) {
    throw new Error('--format must be "markdown" or "json".');
  }
  return options;
}

function normalize(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function specifierClass(specifier) {
  if (/^(?:file|link):/u.test(specifier)) return 'local';
  if (specifier.startsWith('workspace:')) return 'workspace';
  if (
    /^(?:git(?:\+[^:]+)?|github|gitlab|bitbucket):/u.test(specifier) ||
    /\.git(?:#|$)/u.test(specifier)
  ) {
    return 'git';
  }
  if (/^https?:/u.test(specifier)) return 'url';
  if (/^[A-Za-z][A-Za-z0-9._-]*$/u.test(specifier)) return 'tag';
  return 'registry-range';
}

function directLockPath(name) {
  return `node_modules/${name}`;
}

async function readJson(filePath, label) {
  let raw;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw new Error(`${label}: ${error.message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function inspectManifest(manifest) {
  const dependencies = dependencySections
    .flatMap((section) =>
      Object.entries(manifest[section] ?? {}).map(([name, specifier]) => ({
        class: specifierClass(String(specifier)),
        name,
        section,
        specifier: String(specifier),
      })),
    )
    .sort((left, right) =>
      `${left.section}:${left.name}`.localeCompare(`${right.section}:${right.name}`),
    );
  const scripts = Object.entries(manifest.scripts ?? {})
    .map(([name, command]) => ({ command: String(command), name }))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    dependencies,
    dependencySummary: Object.fromEntries(
      [...new Set(dependencies.map(({ class: value }) => value))]
        .sort()
        .map((value) => [
          value,
          dependencies.filter(({ class: itemClass }) => itemClass === value).length,
        ]),
    ),
    engines: manifest.engines ?? null,
    license: typeof manifest.license === 'string' ? manifest.license : null,
    lifecycleScripts: scripts.filter(({ name }) => lifecycleNames.has(name)),
    name: typeof manifest.name === 'string' ? manifest.name : null,
    packageManager: typeof manifest.packageManager === 'string' ? manifest.packageManager : null,
    private: manifest.private === true,
    repository: manifest.repository ?? null,
    version: typeof manifest.version === 'string' ? manifest.version : null,
  };
}

function inspectNpmLock(lock, manifestEvidence, fileName) {
  const packages = lock.packages;
  if (!packages || typeof packages !== 'object') {
    return {
      file: fileName,
      lockfileVersion: lock.lockfileVersion ?? null,
      supported: false,
      warning:
        'Only npm lockfiles with a packages map (normally lockfileVersion 2 or 3) are analyzed.',
    };
  }

  const entries = Object.entries(packages)
    .filter(([packagePath]) => packagePath !== '')
    .sort(([left], [right]) => left.localeCompare(right));
  const examples = (predicate) =>
    entries
      .filter(([, value]) => predicate(value))
      .slice(0, 50)
      .map(([key]) => normalize(key));
  const directDependencies = manifestEvidence.dependencies.map(({ name, section, specifier }) => {
    const locked = packages[directLockPath(name)];
    return {
      lockedVersion: locked?.version ?? null,
      name,
      section,
      specifier,
    };
  });
  const missingIntegrity = examples(
    (value) => !value.link && typeof value.resolved === 'string' && !value.integrity,
  );
  const missingResolved = examples(
    (value) => !value.link && typeof value.version === 'string' && !value.resolved,
  );
  const nonRegistryResolved = examples(
    (value) =>
      typeof value.resolved === 'string' &&
      !value.resolved.startsWith('https://registry.npmjs.org/') &&
      value.resolved !== 'registry.npmjs.org',
  );

  return {
    directDependencies,
    file: fileName,
    hasInstallScript: examples((value) => value.hasInstallScript === true),
    links: examples((value) => value.link === true),
    lockfileVersion: lock.lockfileVersion ?? null,
    missingIntegrity,
    missingResolved,
    nonRegistryResolved,
    packageCount: entries.length,
    supported: true,
  };
}

async function collect(root) {
  const manifest = await readJson(path.join(root, 'package.json'), 'package.json');
  if (!manifest) throw new Error(`No package.json found in ${root}`);
  const names = await readdir(root);
  const detectedLockfiles = knownLockfiles.filter((fileName) => names.includes(fileName));
  const npmLockName = detectedLockfiles.includes('package-lock.json')
    ? 'package-lock.json'
    : detectedLockfiles.includes('npm-shrinkwrap.json')
      ? 'npm-shrinkwrap.json'
      : null;
  const manifestEvidence = inspectManifest(manifest);
  const npmLock = npmLockName
    ? inspectNpmLock(
        await readJson(path.join(root, npmLockName), npmLockName),
        manifestEvidence,
        npmLockName,
      )
    : null;
  const unsupportedLockfiles = detectedLockfiles.filter(
    (fileName) => !['package-lock.json', 'npm-shrinkwrap.json'].includes(fileName),
  );

  return {
    detectedLockfiles,
    manifest: manifestEvidence,
    npmLock,
    npmrcPresent: names.includes('.npmrc'),
    unsupportedLockfiles,
    warnings: [
      ...(detectedLockfiles.length === 0 ? ['No recognized lockfile was detected.'] : []),
      ...(unsupportedLockfiles.length > 0
        ? [`Lockfile evidence not parsed for: ${unsupportedLockfiles.join(', ')}`]
        : []),
      'No registry, advisory database, package contents, signatures, attestations, or license texts were queried.',
    ],
  };
}

function formatItems(items, formatter = (value) => String(value)) {
  return items.length === 0
    ? '_None detected._'
    : items.map((item) => `- ${formatter(item)}`).join('\n');
}

function toMarkdown(report) {
  const dependencies = formatItems(
    report.manifest.dependencies,
    ({ class: itemClass, name, section, specifier }) =>
      `\`${name}\` (${section}, ${itemClass}): \`${specifier}\``,
  );
  const lifecycle = formatItems(
    report.manifest.lifecycleScripts,
    ({ command, name }) => `\`${name}\`: \`${command}\``,
  );
  const directLocks = report.npmLock?.supported
    ? formatItems(
        report.npmLock.directDependencies,
        ({ lockedVersion, name, section, specifier }) =>
          `\`${name}\` (${section}): manifest \`${specifier}\`, locked \`${lockedVersion ?? '[missing]'}\``,
      )
    : '_No supported npm lock evidence._';
  const lockSummary = report.npmLock
    ? `- File: \`${report.npmLock.file}\`\n- Supported: ${report.npmLock.supported}\n- Lockfile version: ${report.npmLock.lockfileVersion ?? '[unknown]'}\n- Package entries: ${report.npmLock.packageCount ?? '[not parsed]'}\n- Missing integrity examples: ${report.npmLock.missingIntegrity?.length ?? '[not parsed]'}\n- Missing resolved examples: ${report.npmLock.missingResolved?.length ?? '[not parsed]'}\n- Non-registry resolution examples: ${report.npmLock.nonRegistryResolved?.length ?? '[not parsed]'}\n- Install-script examples: ${report.npmLock.hasInstallScript?.length ?? '[not parsed]'}\n- Link examples: ${report.npmLock.links?.length ?? '[not parsed]'}`
    : '_No npm package-lock.json or npm-shrinkwrap.json detected._';

  return `# JavaScript supply-chain evidence

- Root: \`${report.root}\`
- Package: ${report.manifest.name ?? '[unnamed]'}@${report.manifest.version ?? '[unversioned]'}
- Private: ${report.manifest.private}
- Declared license: ${report.manifest.license ?? '[not declared]'}
- Package manager: ${report.manifest.packageManager ?? '[not declared]'}
- Detected lockfiles: ${report.detectedLockfiles.join(', ') || '[none]'}
- Project .npmrc present: ${report.npmrcPresent}

## Dependency specifiers

${dependencies}

## Lifecycle scripts

${lifecycle}

## npm lock summary

${lockSummary}

### Direct dependency lock evidence

${directLocks}

## Unsupported lockfiles

${formatItems(report.unsupportedLockfiles, (value) => `\`${value}\``)}

## Warnings and limitations

${formatItems(report.warnings)}

This report is not a vulnerability result, SBOM, license-compliance opinion, provenance verdict, or
adoption decision.`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  const root = path.resolve(options.root);
  const report = { root: normalize(root), schemaVersion: 1, ...(await collect(root)) };
  process.stdout.write(
    options.format === 'json' ? `${JSON.stringify(report, null, 2)}\n` : `${toMarkdown(report)}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`inspect-js-supply-chain: ${error.message}\n`);
  process.exitCode = 1;
});
