#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function getArg(name, fallback = null) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

function getArgs(name) {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === name && args[i + 1]) values.push(args[i + 1]);
  }
  return values;
}

function positiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const projectRoot = path.resolve(getArg("--project-root") || process.cwd());
const queries = [...new Set(getArgs("--query").map((value) => value.trim()).filter(Boolean))];
const maxResults = positiveInt(getArg("--max-results"), 20);
const maxHeadings = positiveInt(getArg("--max-headings"), 12);
const maxInventory = positiveInt(getArg("--max-inventory"), 500);
const maxFileBytes = positiveInt(getArg("--max-file-bytes"), 2 * 1024 * 1024);
const hotPaths = [...new Set(getArgs("--hot-path").map((value) => normalizeCorpusPath(value)).filter(Boolean))];
const coldPaths = [...new Set(getArgs("--cold-path").map((value) => normalizeCorpusPath(value)).filter(Boolean))];
const pairRoots = getArgs("--pair-roots").map((value) => parsePairRoots(value));
const searchTier = (getArg("--search-tier", "hot") || "hot").toLowerCase();
const indexFileArg = getArg("--index-file");
const indexFile = indexFileArg ? path.resolve(indexFileArg) : null;
const refreshIndex = args.includes("--refresh-index");
const indexVersion = 1;
const supportedSearchTiers = new Set(["hot", "cold", "all"]);

if (!supportedSearchTiers.has(searchTier)) {
  process.stderr.write(`Unsupported --search-tier: ${searchTier}. Expected hot, cold, or all.\n`);
  process.exit(2);
}

const excludedSegments = new Set([
  ".git",
  ".next",
  ".cache",
  ".turbo",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "vendor",
  "out",
  "target",
]);

const frontmatterKeys = new Set([
  "title",
  "description",
  "type",
  "tags",
  "scope",
  "module",
  "status",
]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function normalizeCorpusPath(value) {
  return toPosix(value)
    .replace(/^\.\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

function pathMatchesHint(relativePath, hint) {
  const normalized = normalizeCorpusPath(relativePath);
  return normalized === hint || normalized.startsWith(`${hint}/`);
}

function parsePairRoots(value) {
  const separator = value.indexOf("=");
  if (separator <= 0 || separator === value.length - 1) {
    process.stderr.write(`Invalid --pair-roots value: ${value}. Expected <left>=<right>.\n`);
    process.exit(2);
  }

  const left = normalizeCorpusPath(value.slice(0, separator));
  const right = normalizeCorpusPath(value.slice(separator + 1));
  if (!left || !right || left === right) {
    process.stderr.write(`Invalid --pair-roots value: ${value}. Roots must be distinct non-empty paths.\n`);
    process.exit(2);
  }
  return { left, right };
}

function corpusTier(relativePath) {
  if (hotPaths.some((hint) => pathMatchesHint(relativePath, hint))) return "hot";
  if (coldPaths.some((hint) => pathMatchesHint(relativePath, hint))) return "cold";
  return "hot";
}

function isInsideProject(candidatePath) {
  const relative = path.relative(projectRoot, candidatePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function shouldSkip(relativePath) {
  return toPosix(relativePath)
    .split("/")
    .filter(Boolean)
    .some((segment) => excludedSegments.has(segment));
}

function isKnowledgeFile(filePath) {
  return /\.(md|mdc)$/i.test(filePath);
}

function walk(directory, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(projectRoot, absolute);
    if (!relative || shouldSkip(relative)) continue;

    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      walk(absolute, files);
      continue;
    }
    if (entry.isFile() && isKnowledgeFile(entry.name)) files.push(absolute);
  }

  return files;
}

function readBounded(filePath, sizeBytes) {
  const bytesToRead = Math.min(sizeBytes, maxFileBytes);
  const buffer = Buffer.alloc(bytesToRead);
  let fd;
  try {
    fd = fs.openSync(filePath, "r");
    const bytesRead = fs.readSync(fd, buffer, 0, bytesToRead, 0);
    return {
      text: buffer.subarray(0, bytesRead).toString("utf8"),
      contentTruncated: sizeBytes > bytesRead,
      readable: true,
    };
  } catch {
    return { text: "", contentTruncated: false, readable: false };
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {
        // Ignore close failures in discovery-only tooling.
      }
    }
  }
}

function cleanScalar(value) {
  let cleaned = value.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1);
  }
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  return cleaned.length > 240 ? `${cleaned.slice(0, 237)}...` : cleaned;
}

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};

  const lines = text.split(/\r?\n/);
  if (lines[0].trim() !== "---") return {};

  const result = {};
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === "---") break;
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) continue;

    const key = match[1].toLowerCase();
    if (!frontmatterKeys.has(key)) continue;
    const value = cleanScalar(match[2]);
    if (value) result[key] = value;
  }

  return result;
}

function extractHeadings(text) {
  const headings = [];
  let headingCount = 0;

  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s{0,3}(#{1,2})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    headingCount += 1;
    if (headings.length >= maxHeadings) continue;

    const value = cleanScalar(match[2]);
    if (!value) continue;
    headings.push({ level: match[1].length, text: value });
  }

  return { headings, headingCount };
}

function structuralHints(relativePath) {
  const normalized = relativePath.toLowerCase();
  const basename = path.posix.basename(normalized);
  const hints = [];

  if (/(^|\/)(\.agents|\.cursor|\.codex)(\/|$)/.test(normalized)) {
    hints.push("tool-specific-path");
  }
  if (["agent.md", "skill.md", "capability.md"].includes(basename)) {
    hints.push("agent-control-conventional-filename");
  }
  if (/(^|\/)(analysis|\.analysis)(\/|$)/.test(normalized)) {
    hints.push("analysis-like-path");
  }
  if (/(^|\/)(docs|\.docs|documentation)(\/|$)/.test(normalized)) {
    hints.push("documentation-like-path");
  }
  if (/(^|\/)(adr|adrs|architecture|decisions?)(\/|$)/.test(normalized)) {
    hints.push("architecture-decision-like-path");
  }
  if (/(^|\/)plans?(\/|$)/.test(normalized)) {
    hints.push("plan-like-path");
  }
  if (/(^|\/)progress(es)?(\/|$)/.test(normalized)) {
    hints.push("progress-like-path");
  }

  return hints;
}

function normalizeForSearch(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function queryTokens(query) {
  return [...new Set(normalizeForSearch(query).split(/[^a-z0-9_./-]+/i).filter((token) => token.length >= 2))];
}

function includesPhrase(haystack, query) {
  const normalized = normalizeForSearch(query);
  return normalized ? haystack.includes(normalized) : false;
}

function scoreDocument(document) {
  if (queries.length === 0) return { score: 0, matchedQueries: [] };

  const pathText = normalizeForSearch(document.path);
  const titleText = normalizeForSearch(document.title);
  const headingText = normalizeForSearch(document.headings.map((item) => item.text).join(" "));
  const frontmatterText = normalizeForSearch(Object.values(document.frontmatter).join(" "));
  const contentText = normalizeForSearch(document.searchText || "");
  let score = 0;
  const matchedQueries = [];

  for (const query of queries) {
    let queryScore = 0;

    if (includesPhrase(pathText, query)) queryScore += 40;
    if (includesPhrase(titleText, query)) queryScore += 35;
    if (includesPhrase(headingText, query)) queryScore += 25;
    if (includesPhrase(frontmatterText, query)) queryScore += 20;
    if (includesPhrase(contentText, query)) queryScore += 8;

    for (const token of queryTokens(query)) {
      if (pathText.includes(token)) queryScore += 8;
      if (titleText.includes(token)) queryScore += 7;
      if (headingText.includes(token)) queryScore += 5;
      if (frontmatterText.includes(token)) queryScore += 4;
      if (contentText.includes(token)) queryScore += 1;
    }

    if (queryScore > 0) {
      matchedQueries.push(query);
      score += queryScore;
    }
  }

  return { score, matchedQueries };
}

if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
  process.stderr.write(`Project root is not a readable directory: ${projectRoot}\n`);
  process.exit(2);
}

if (indexFile && isInsideProject(indexFile)) {
  process.stderr.write("--index-file must point outside the working project; use a transient runtime/temp location.\n");
  process.exit(2);
}

function loadReusableIndex() {
  if (!indexFile || refreshIndex || !fs.existsSync(indexFile)) return null;

  try {
    const parsed = JSON.parse(fs.readFileSync(indexFile, "utf8"));
    if (
      parsed?.kind !== "project-knowledge-reusable-index" ||
      parsed?.version !== indexVersion ||
      parsed?.projectRoot !== projectRoot ||
      parsed?.maxHeadings !== maxHeadings ||
      parsed?.maxFileBytes !== maxFileBytes ||
      !Array.isArray(parsed?.documents)
    ) {
      return null;
    }
    return parsed.documents;
  } catch {
    return null;
  }
}

function writeReusableIndex(documents) {
  if (!indexFile) return false;

  try {
    fs.mkdirSync(path.dirname(indexFile), { recursive: true });
    fs.writeFileSync(
      indexFile,
      JSON.stringify({
        kind: "project-knowledge-reusable-index",
        version: indexVersion,
        projectRoot,
        maxHeadings,
        maxFileBytes,
        documents,
      }),
      { encoding: "utf8", mode: 0o600 },
    );
    return true;
  } catch {
    return false;
  }
}

let documents = loadReusableIndex();
let indexReused = Boolean(documents);
let indexWritten = false;
let filesystemScans = 0;

if (!documents) {
  const filePaths = walk(projectRoot).sort((a, b) => a.localeCompare(b));
  documents = [];
  filesystemScans = 1;

  for (const absolute of filePaths) {
    const relative = toPosix(path.relative(projectRoot, absolute));
    let stat;
    try {
      stat = fs.statSync(absolute);
    } catch {
      documents.push({
        path: relative,
        extension: path.extname(relative).toLowerCase(),
        readable: false,
        sizeBytes: null,
        title: path.posix.basename(relative),
        headingCount: 0,
        headings: [],
        frontmatter: {},
        structuralHints: structuralHints(relative),
        contentTruncated: false,
        searchText: "",
      });
      continue;
    }

    const read = readBounded(absolute, stat.size);
    const frontmatter = parseFrontmatter(read.text);
    const headingData = extractHeadings(read.text);
    const firstH1 = headingData.headings.find((item) => item.level === 1)?.text;
    const title = frontmatter.title || firstH1 || path.posix.basename(relative);

    documents.push({
      path: relative,
      extension: path.extname(relative).toLowerCase(),
      readable: read.readable,
      sizeBytes: stat.size,
      title,
      headingCount: headingData.headingCount,
      headings: headingData.headings,
      frontmatter,
      structuralHints: structuralHints(relative),
      contentTruncated: read.contentTruncated,
      searchText: read.text,
    });
  }

  indexWritten = writeReusableIndex(documents);
}

const scoredDocuments = documents.map((document) => ({
  ...document,
  corpusTier: corpusTier(document.path),
  ...scoreDocument(document),
}));

const documentPaths = new Set(scoredDocuments.map((document) => normalizeCorpusPath(document.path)));

function pairedPathsFor(relativePath) {
  const normalized = normalizeCorpusPath(relativePath);
  const pairs = [];

  for (const pair of pairRoots) {
    for (const [from, to] of [
      [pair.left, pair.right],
      [pair.right, pair.left],
    ]) {
      if (!pathMatchesHint(normalized, from)) continue;
      const suffix = normalized === from ? "" : normalized.slice(from.length + 1);
      const counterpart = suffix ? `${to}/${suffix}` : to;
      if (documentPaths.has(counterpart)) pairs.push(counterpart);
    }
  }

  return [...new Set(pairs)];
}

const matchedDocuments = scoredDocuments.filter((document) => document.score > 0);
const eligibleDocuments = matchedDocuments.filter(
  (document) => searchTier === "all" || document.corpusTier === searchTier,
);

const candidates = eligibleDocuments
  .sort((a, b) => {
    if (searchTier === "all" && a.corpusTier !== b.corpusTier) {
      return a.corpusTier === "hot" ? -1 : 1;
    }
    return b.score - a.score || a.path.localeCompare(b.path);
  })
  .slice(0, maxResults)
  .map((document) => ({
    path: document.path,
    extension: document.extension,
    readable: document.readable,
    sizeBytes: document.sizeBytes,
    title: document.title,
    frontmatter: document.frontmatter,
    headings: document.headings,
    headingCount: document.headingCount,
    structuralHints: document.structuralHints,
    corpusTier: document.corpusTier,
    pairedPaths: pairedPathsFor(document.path),
    contentTruncated: document.contentTruncated,
    score: document.score,
    matchedQueries: document.matchedQueries,
  }));

const inventoryDocuments = [...scoredDocuments].sort((a, b) => {
  if (a.corpusTier !== b.corpusTier) return a.corpusTier === "hot" ? -1 : 1;
  return a.path.localeCompare(b.path);
});

const compactInventory = inventoryDocuments
  .slice(0, maxInventory)
  .map((document) => ({
    path: document.path,
    title: document.title,
    structuralHints: document.structuralHints,
    corpusTier: document.corpusTier,
    ...(document.readable ? {} : { readable: false }),
  }));

const hotFiles = scoredDocuments.filter((document) => document.corpusTier === "hot").length;
const coldFiles = scoredDocuments.length - hotFiles;
const hotMatches = matchedDocuments.filter((document) => document.corpusTier === "hot").length;
const coldMatches = matchedDocuments.length - hotMatches;

process.stdout.write(
  JSON.stringify(
    {
      kind: "project-knowledge-inventory",
      projectRoot: ".",
      queries,
      corpus: {
        searchTier,
        hotPaths,
        coldPaths,
        pairRoots,
      },
      stats: {
        filesIndexed: scoredDocuments.length,
        filesystemScans,
        indexReused,
        indexWritten,
        hotFiles,
        coldFiles,
        candidatesMatched: eligibleDocuments.length,
        candidatesMatchedAllTiers: matchedDocuments.length,
        matchedByTier: {
          hot: hotMatches,
          cold: coldMatches,
        },
        candidatesReturned: candidates.length,
        inventoryReturned: compactInventory.length,
        inventoryOmitted: Math.max(0, scoredDocuments.length - compactInventory.length),
        inventoryTruncated: scoredDocuments.length > compactInventory.length,
      },
      candidates,
      inventory: compactInventory,
      limitations: [
        "Corpus tiers are caller-supplied discovery priorities, not document authority or semantic classification.",
        "When no hot/cold hints are supplied, all project knowledge remains hot for backward compatibility.",
        "Cold documents remain indexed and discoverable but are excluded from the default hot candidate pool.",
        "Pair roots are caller-supplied deterministic path relationships; pairedPaths only reports exact indexed counterparts and does not imply semantic authority.",
        "Reusable indexes are explicit transient runtime artifacts; they must live outside the working project and must not be treated as persistent project knowledge.",
        "Structural hints are discovery hints only; they do not classify document authority or purpose.",
        "Only Markdown/MDC content up to maxFileBytes is inspected for metadata and search matching.",
        "Only H1/H2 headings are extracted for discovery.",
        "Inventory output is compact and may be truncated by maxInventory; omitted paths must not be treated as absent project knowledge.",
        "Agent-control versus project-knowledge classification remains a Brain semantic decision.",
      ],
    },
    null,
    2,
  ),
);
