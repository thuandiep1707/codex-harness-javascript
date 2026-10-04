#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const getArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};

const projectRoot = path.resolve(getArg("--project-root") || process.cwd());
const includeOperational = args.includes("--include-operational");
const explicitPaths = [];
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--path" && args[i + 1]) explicitPaths.push(args[i + 1]);
}

const generatedRoots = new Set(["node_modules", ".next", "dist", "build", "vendor"]);

const secretKey = /(password|passwd|pwd|token|secret|private[_-]?key|client[_-]?secret|api[_-]?key|access[_-]?key|refresh[_-]?token|session|cookie|signing[_-]?key|encryption[_-]?key)/i;
const operationalKey = /(test.*(user|email|account)|(^|[_-])(user(name)?|email|account|tenant|organization|org|role)([_-]|$))/i;
const safeKey = /(swagger|openapi|(^|[_-])(url|uri|host|hostname|port|origin|base[_-]?url)([_-]|$)|^(next_public_|vite_|public_))/i;
const sensitiveQueryKey = /(token|secret|password|passwd|pwd|key|signature|sig|credential|auth|session|cookie)/i;

function fileRole(filePath) {
  const s = filePath.toLowerCase();
  if (/(example|sample|template)/.test(s)) return "template";
  if (/(^|[./_-])(test|e2e)([./_-]|$)/.test(s)) return "test-runtime";
  if (/(production|prod)/.test(s)) return "production-runtime";
  if (/staging/.test(s)) return "staging-runtime";
  if (/(development|dev|local)/.test(s)) return "local-runtime";
  return "base";
}

function normalizeCandidate(p) {
  const abs = path.resolve(projectRoot, p);
  const rel = path.relative(projectRoot, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  const first = rel.split(path.sep)[0];
  if (generatedRoots.has(first)) return null;
  return { abs, rel: rel.split(path.sep).join("/") };
}

function extractEnvRefs(text) {
  const refs = new Set();
  const patterns = [
    /--env-file(?:=|\s+)(["']?)([^\s"'\x60]+)\1/g,
    /dotenv(?:\s+[^\n\r]*?)?\s+-e\s+(["']?)([^\s"'\x60]+)\1/g,
    /(?:path|envFile|envFilePath)\s*[:=]\s*(["'\x60])([^"'\x60]+)\1/g,
    /(?:^|[\s"'\x60(=])((?:\.?\/?[\w.-]+\/)*\.env(?:\.[\w.-]+)*|(?:\.?\/?[\w.-]+\/)+[\w.-]*env[\w.-]*)(?=$|[\s"'\x60),;])/gim,
  ];
  for (const re of patterns) {
    for (const match of text.matchAll(re)) {
      const candidate = match[2] || match[1];
      if (candidate && !candidate.includes("$") && !candidate.includes("{")) refs.add(candidate);
    }
  }
  return refs;
}

function parseDotenv(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      const comment = value.search(/\s+#/);
      if (comment >= 0) value = value.slice(0, comment).trimEnd();
    }
    out.push({ key: m[1], value });
  }
  return out;
}

function urlContainsSecret(value) {
  try {
    const u = new URL(value);
    if (u.username || u.password) return true;
    for (const key of u.searchParams.keys()) {
      if (sensitiveQueryKey.test(key)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

function classify(key, value) {
  if (secretKey.test(key)) return "SECRET";
  if (safeKey.test(key)) {
    if (/^https?:\/\//i.test(value) && urlContainsSecret(value)) return "SECRET";
    return "CONTEXT_SAFE";
  }
  if (operationalKey.test(key)) return "OPERATIONAL_SENSITIVE";
  return "OPERATIONAL_SENSITIVE";
}

const candidates = new Map();
function addCandidate(candidatePath, discoveredFrom) {
  const normalized = normalizeCandidate(candidatePath);
  if (!normalized || !fs.existsSync(normalized.abs) || !fs.statSync(normalized.abs).isFile()) return;
  const prev = candidates.get(normalized.rel) || {
    path: normalized.rel,
    abs: normalized.abs,
    role: fileRole(normalized.rel),
    discoveredFrom: new Set(),
  };
  prev.discoveredFrom.add(discoveredFrom);
  candidates.set(normalized.rel, prev);
}

for (const explicit of explicitPaths) addCandidate(explicit, "explicit");

if (fs.existsSync(projectRoot)) {
  for (const name of fs.readdirSync(projectRoot)) {
    if (name === ".env" || name.startsWith(".env.")) addCandidate(name, "root-convention");
  }
}

const discoveryFiles = [];
const packageJson = path.join(projectRoot, "package.json");
if (fs.existsSync(packageJson)) discoveryFiles.push(packageJson);

for (const name of fs.existsSync(projectRoot) ? fs.readdirSync(projectRoot) : []) {
  if (/^(next|vite|vitest|playwright|webpack|jest|cypress)\.config\.[cm]?[jt]s$/i.test(name)) {
    discoveryFiles.push(path.join(projectRoot, name));
  }
}

for (const file of discoveryFiles) {
  try {
    const text = fs.readFileSync(file, "utf8");
    for (const ref of extractEnvRefs(text)) {
      addCandidate(ref, path.relative(projectRoot, file).split(path.sep).join("/"));
    }
  } catch {
    // Deliberately omit raw parser/read errors that could include sensitive text.
  }
}

const files = [];
for (const item of [...candidates.values()].sort((a, b) => a.path.localeCompare(b.path))) {
  let text;
  try {
    text = fs.readFileSync(item.abs, "utf8");
  } catch {
    files.push({
      path: item.path,
      role: item.role,
      discoveredFrom: [...item.discoveredFrom],
      readable: false,
      variables: [],
    });
    continue;
  }

  const variables = parseDotenv(text).map(({ key, value }) => {
    const classification = classify(key, value);
    const base = {
      key,
      classification,
      state: value === "" ? "empty" : "present",
      reference: `env:${key}`,
    };

    if (classification === "CONTEXT_SAFE") {
      return { ...base, value };
    }

    if (classification === "OPERATIONAL_SENSITIVE" && includeOperational) {
      return { ...base, value };
    }

    return base;
  });

  files.push({
    path: item.path,
    role: item.role,
    discoveredFrom: [...item.discoveredFrom],
    readable: true,
    variables,
  });
}

process.stdout.write(
  JSON.stringify(
    {
      kind: "sanitized-environment-evidence",
      projectRoot: ".",
      includeOperational,
      files,
      limitations: [
        "Environment precedence is not inferred unless project/runtime evidence establishes it.",
        "Only project-root conventions and explicit references in selected package/framework/tool config are discovered.",
        "SECRET values are never emitted.",
      ],
    },
    null,
    2,
  ),
);
