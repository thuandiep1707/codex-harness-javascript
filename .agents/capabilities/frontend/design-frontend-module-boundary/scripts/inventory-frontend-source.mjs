#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const HELP = `Usage:
  node inventory-frontend-source.mjs --root <directory> [--format markdown|json] [--max-files <n>]

Collects deterministic, read-only frontend source evidence. It does not choose architecture or
write output files. Markdown is the default format.`;

const DEFAULT_MAX_FILES = 20_000;
const MAX_TEXT_BYTES = 512 * 1024;
const MAX_ITEMS = 200;
const ignoredDirectories = new Set([
  '.cache',
  '.git',
  '.next',
  '.nuxt',
  '.output',
  '.parcel-cache',
  '.pnpm-store',
  '.svelte-kit',
  '.turbo',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
]);
const sourceExtensions = new Set([
  '.cjs',
  '.css',
  '.cts',
  '.html',
  '.js',
  '.jsx',
  '.less',
  '.mjs',
  '.mts',
  '.scss',
  '.ts',
  '.tsx',
  '.vue',
]);
const styleExtensions = new Set(['.css', '.less', '.sass', '.scss', '.styl']);
const assetExtensions = new Set([
  '.avif',
  '.eot',
  '.fbx',
  '.gif',
  '.glb',
  '.gltf',
  '.ico',
  '.jpeg',
  '.jpg',
  '.mp3',
  '.mp4',
  '.obj',
  '.ogg',
  '.otf',
  '.png',
  '.svg',
  '.ttf',
  '.wav',
  '.webm',
  '.webp',
  '.woff',
  '.woff2',
]);
const manifestNames = new Set([
  'bun.lock',
  'bun.lockb',
  'components.json',
  'deno.json',
  'deno.jsonc',
  'package-lock.json',
  'package.json',
  'pnpm-lock.yaml',
  'turbo.json',
  'yarn.lock',
]);

function parseArgs(argv) {
  const options = { format: 'markdown', maxFiles: DEFAULT_MAX_FILES, root: null };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') return { help: true };
    if (argument === '--root') options.root = argv[++index];
    else if (argument === '--format') options.format = argv[++index];
    else if (argument === '--max-files') options.maxFiles = Number(argv[++index]);
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (!options.root) throw new Error('Missing required --root <directory>.');
  if (!['json', 'markdown'].includes(options.format)) {
    throw new Error('--format must be "markdown" or "json".');
  }
  if (!Number.isInteger(options.maxFiles) || options.maxFiles < 1) {
    throw new Error('--max-files must be a positive integer.');
  }
  return options;
}

function normalize(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function add(map, key, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function isManifest(fileName) {
  return (
    manifestNames.has(fileName) ||
    /^(next|nuxt|vite|vitest|webpack|playwright|eslint|postcss|tailwind)\.config\./u.test(
      fileName,
    ) ||
    /^tsconfig(?:\..+)?\.json$/u.test(fileName)
  );
}

function externalPackage(specifier) {
  if (
    specifier.startsWith('.') ||
    specifier.startsWith('/') ||
    specifier.startsWith('#') ||
    specifier.startsWith('~/') ||
    specifier.startsWith('@/') ||
    specifier.startsWith('node:')
  ) {
    return null;
  }
  const segments = specifier.split('/');
  return specifier.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0];
}

function bounded(items) {
  const sorted = [...new Set(items)].sort((left, right) => left.localeCompare(right));
  return {
    count: sorted.length,
    items: sorted.slice(0, MAX_ITEMS),
    truncated: sorted.length > MAX_ITEMS,
  };
}

function mapToObject(map) {
  return Object.fromEntries(
    [...map.entries()].sort(([left], [right]) => left.localeCompare(right)),
  );
}

async function collectPackageManifest(root, warnings) {
  try {
    const raw = await readFile(path.join(root, 'package.json'), 'utf8');
    const manifest = JSON.parse(raw);
    const dependencySections = [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ];
    const dependencies = dependencySections.flatMap((section) =>
      Object.entries(manifest[section] ?? {}).map(([name, version]) => ({
        name,
        section,
        version,
      })),
    );
    const frameworkPattern =
      /^(?:@?angular|@remix-run\/|@sveltejs\/|@tanstack\/react-query|cesium|leaflet|mapbox-gl|next|nuxt|ol|react|react-dom|svelte|three|vite|vue)/u;
    return {
      dependencyCount: dependencies.length,
      frameworkHints: dependencies
        .filter(({ name }) => frameworkPattern.test(name))
        .map(({ name, section, version }) => `${name}@${version} (${section})`)
        .sort(),
      name: typeof manifest.name === 'string' ? manifest.name : null,
      private: manifest.private === true,
      scripts: Object.keys(manifest.scripts ?? {}).sort(),
    };
  } catch (error) {
    if (error?.code !== 'ENOENT') warnings.push(`package.json: ${error.message}`);
    return null;
  }
}

async function inventory(root, maxFiles) {
  const evidence = {
    assets: [],
    entries: [],
    environmentFiles: [],
    manifests: [],
    routes: [],
    styles: [],
    tests: [],
    wasm: [],
    workers: [],
  };
  const extensions = new Map();
  const externalPackages = new Set();
  const topLevel = new Set();
  const warnings = [];
  let aliasImports = 0;
  let directoryCount = 0;
  let fileCount = 0;
  let relativeImports = 0;
  let truncated = false;

  async function walk(absoluteDirectory, relativeDirectory = '') {
    if (truncated) return;
    let entries;
    try {
      entries = await readdir(absoluteDirectory, { withFileTypes: true });
    } catch (error) {
      warnings.push(`${normalize(relativeDirectory || '.')}: ${error.message}`);
      return;
    }

    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (truncated) break;
      const relativePath = relativeDirectory
        ? path.join(relativeDirectory, entry.name)
        : entry.name;
      const normalizedPath = normalize(relativePath);
      if (!relativeDirectory) topLevel.add(entry.name);

      if (entry.isDirectory()) {
        if (ignoredDirectories.has(entry.name) || normalizedPath === '.yarn/cache') continue;
        directoryCount += 1;
        await walk(path.join(absoluteDirectory, entry.name), relativePath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (fileCount >= maxFiles) {
        truncated = true;
        break;
      }

      fileCount += 1;
      const extension = path.extname(entry.name).toLowerCase() || '[none]';
      const lowerName = entry.name.toLowerCase();
      add(extensions, extension);

      if (isManifest(lowerName)) evidence.manifests.push(normalizedPath);
      if (/^(?:app|index|main|root)(?:\.[^.]+)+$/u.test(lowerName))
        evidence.entries.push(normalizedPath);
      if (
        /(?:^|\/)(?:routes?|pages?)(?:\/|$)/u.test(normalizedPath.toLowerCase()) ||
        /^(?:error|layout|loading|not-found|page|route)\.(?:js|jsx|ts|tsx)$/u.test(lowerName)
      ) {
        evidence.routes.push(normalizedPath);
      }
      if (
        /(?:^|\/)(?:__tests__|e2e|tests?)(?:\/|$)|\.(?:spec|test)\.[^.]+$/u.test(normalizedPath)
      ) {
        evidence.tests.push(normalizedPath);
      }
      if (styleExtensions.has(extension)) evidence.styles.push(normalizedPath);
      if (assetExtensions.has(extension)) evidence.assets.push(normalizedPath);
      if (extension === '.wasm') evidence.wasm.push(normalizedPath);
      if (/(?:^|[.-])(?:service-)?worker(?:[.-]|$)/u.test(lowerName))
        evidence.workers.push(normalizedPath);
      if (/^\.env(?:\.|$)/u.test(lowerName)) evidence.environmentFiles.push(normalizedPath);

      if (!sourceExtensions.has(extension)) continue;
      try {
        const metadata = await stat(path.join(absoluteDirectory, entry.name));
        if (metadata.size > MAX_TEXT_BYTES) continue;
        const source = await readFile(path.join(absoluteDirectory, entry.name), 'utf8');
        const importPattern =
          /(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)|import\(\s*['"]([^'"]+)['"]\s*\)/gu;
        for (const match of source.matchAll(importPattern)) {
          const specifier = match[1] ?? match[2] ?? match[3];
          if (specifier.startsWith('.')) relativeImports += 1;
          else if (
            specifier.startsWith('@/') ||
            specifier.startsWith('~/') ||
            specifier.startsWith('#')
          ) {
            aliasImports += 1;
          } else {
            const packageName = externalPackage(specifier);
            if (packageName) externalPackages.add(packageName);
          }
        }
      } catch (error) {
        warnings.push(`${normalizedPath}: ${error.message}`);
      }
    }
  }

  await walk(root);
  return {
    evidence: Object.fromEntries(
      Object.entries(evidence).map(([key, items]) => [key, bounded(items)]),
    ),
    imports: {
      aliasCount: aliasImports,
      externalPackages: bounded(externalPackages),
      relativeCount: relativeImports,
    },
    packageManifest: await collectPackageManifest(root, warnings),
    summary: {
      directories: directoryCount,
      extensions: mapToObject(extensions),
      files: fileCount,
      maxFiles,
      truncated,
    },
    topLevel: bounded(topLevel),
    warnings: bounded(warnings),
  };
}

function markdownList(section) {
  if (section.count === 0) return '_None detected._';
  const lines = section.items.map((item) => `- \`${item}\``);
  if (section.truncated)
    lines.push(`- _Truncated after ${section.items.length} of ${section.count} items._`);
  return lines.join('\n');
}

function toMarkdown(report) {
  const sections = Object.entries(report.evidence)
    .map(([name, value]) => `## ${name}\n\n${markdownList(value)}`)
    .join('\n\n');
  const manifest = report.packageManifest
    ? `- Name: ${report.packageManifest.name ?? '[unnamed]'}\n- Private: ${report.packageManifest.private}\n- Dependencies: ${report.packageManifest.dependencyCount}\n- Scripts: ${report.packageManifest.scripts.join(', ') || '[none]'}\n- Framework hints: ${report.packageManifest.frameworkHints.join(', ') || '[none]'}`
    : '_No readable package.json detected._';

  return `# Frontend source inventory

- Root: \`${report.root}\`
- Files: ${report.summary.files}
- Directories: ${report.summary.directories}
- Truncated: ${report.summary.truncated}

## Package manifest

${manifest}

## Imports

- Relative imports: ${report.imports.relativeCount}
- Alias imports: ${report.imports.aliasCount}
- External packages (${report.imports.externalPackages.count}): ${report.imports.externalPackages.items.join(', ') || '[none]'}

## Top level

${markdownList(report.topLevel)}

${sections}

## Warnings

${markdownList(report.warnings)}

## Limitations

This inventory classifies files and import evidence only. It does not infer business meaning,
architecture ownership, runtime correctness, licenses, vulnerabilities, or behavioral parity.`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  const root = path.resolve(options.root);
  const metadata = await stat(root);
  if (!metadata.isDirectory()) throw new Error(`Root is not a directory: ${root}`);
  const report = {
    root: normalize(root),
    schemaVersion: 1,
    ...(await inventory(root, options.maxFiles)),
  };
  process.stdout.write(
    options.format === 'json' ? `${JSON.stringify(report, null, 2)}\n` : `${toMarkdown(report)}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`inventory-frontend-source: ${error.message}\n`);
  process.exitCode = 1;
});
