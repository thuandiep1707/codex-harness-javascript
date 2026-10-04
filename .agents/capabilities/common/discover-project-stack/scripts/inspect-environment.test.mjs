#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const inspectorPath = fileURLToPath(new URL("./inspect-environment.mjs", import.meta.url));

function writeFile(projectRoot, relativePath, content) {
  const absolute = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, "utf8");
}

function runInspector(projectRoot, args = []) {
  const result = spawnSync(
    process.execPath,
    [inspectorPath, "--project-root", projectRoot, ...args],
    { encoding: "utf8" },
  );

  assert.equal(
    result.status,
    0,
    [`inspector exited with ${result.status}`, result.stderr, result.stdout]
      .filter(Boolean)
      .join("\n"),
  );

  return JSON.parse(result.stdout);
}

function variable(result, filePath, key) {
  const file = result.files.find((item) => item.path === filePath);
  assert.ok(file, `missing env file ${filePath}`);
  const item = file.variables.find((entry) => entry.key === key);
  assert.ok(item, `missing variable ${key} in ${filePath}`);
  return item;
}

test("sanitizes secrets while preserving safe context", (t) => {
  const runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "brain-env-safe-"));
  const projectRoot = path.join(runtimeRoot, "project");
  fs.mkdirSync(projectRoot, { recursive: true });
  t.after(() => fs.rmSync(runtimeRoot, { recursive: true, force: true }));

  writeFile(
    projectRoot,
    ".env",
    [
      "NEXT_PUBLIC_API_URL=https://api.example.com",
      "API_TOKEN=super-secret-token",
      "TEST_USER_EMAIL=tester@example.com",
      "SERVICE_URL=https://user:password@example.com/private",
      "CALLBACK_URL=https://example.com/callback?token=hidden",
      "EMPTY_VALUE=",
      "",
    ].join("\n"),
  );

  const result = runInspector(projectRoot);

  const publicUrl = variable(result, ".env", "NEXT_PUBLIC_API_URL");
  assert.equal(publicUrl.classification, "CONTEXT_SAFE");
  assert.equal(publicUrl.value, "https://api.example.com");

  const token = variable(result, ".env", "API_TOKEN");
  assert.equal(token.classification, "SECRET");
  assert.equal("value" in token, false);

  const userEmail = variable(result, ".env", "TEST_USER_EMAIL");
  assert.equal(userEmail.classification, "OPERATIONAL_SENSITIVE");
  assert.equal("value" in userEmail, false);

  const credentialUrl = variable(result, ".env", "SERVICE_URL");
  assert.equal(credentialUrl.classification, "SECRET");
  assert.equal("value" in credentialUrl, false);

  const tokenizedUrl = variable(result, ".env", "CALLBACK_URL");
  assert.equal(tokenizedUrl.classification, "SECRET");
  assert.equal("value" in tokenizedUrl, false);

  const empty = variable(result, ".env", "EMPTY_VALUE");
  assert.equal(empty.state, "empty");
  assert.equal(empty.classification, "OPERATIONAL_SENSITIVE");
  assert.equal("value" in empty, false);
});

test("operational values require explicit opt-in and secrets remain redacted", (t) => {
  const runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "brain-env-operational-"));
  const projectRoot = path.join(runtimeRoot, "project");
  fs.mkdirSync(projectRoot, { recursive: true });
  t.after(() => fs.rmSync(runtimeRoot, { recursive: true, force: true }));

  writeFile(
    projectRoot,
    ".env.test",
    [
      "TEST_USER_EMAIL=tester@example.com",
      "TEST_ACCOUNT=qa-account",
      "SESSION_TOKEN=must-never-appear",
      "",
    ].join("\n"),
  );

  const hidden = runInspector(projectRoot);
  assert.equal("value" in variable(hidden, ".env.test", "TEST_USER_EMAIL"), false);

  const included = runInspector(projectRoot, ["--include-operational"]);
  assert.equal(variable(included, ".env.test", "TEST_USER_EMAIL").value, "tester@example.com");
  assert.equal(variable(included, ".env.test", "TEST_ACCOUNT").value, "qa-account");
  assert.equal(variable(included, ".env.test", "SESSION_TOKEN").classification, "SECRET");
  assert.equal("value" in variable(included, ".env.test", "SESSION_TOKEN"), false);
});

test("discovers referenced env files but rejects outside-project and generated paths", (t) => {
  const runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "brain-env-discovery-"));
  const projectRoot = path.join(runtimeRoot, "project");
  fs.mkdirSync(projectRoot, { recursive: true });
  t.after(() => fs.rmSync(runtimeRoot, { recursive: true, force: true }));

  writeFile(
    projectRoot,
    "package.json",
    JSON.stringify({
      scripts: {
        dev: "dotenv -e config/runtime.env -- node server.js",
      },
    }),
  );
  writeFile(projectRoot, "config/runtime.env", "API_HOST=https://runtime.example.com\n");
  writeFile(projectRoot, "node_modules/.env", "API_HOST=https://generated.example.com\n");
  writeFile(runtimeRoot, "outside.env", "API_HOST=https://outside.example.com\n");

  const result = runInspector(projectRoot, [
    "--path", "../outside.env",
    "--path", "node_modules/.env",
  ]);

  const runtime = result.files.find((item) => item.path === "config/runtime.env");
  assert.ok(runtime);
  assert.ok(runtime.discoveredFrom.includes("package.json"));
  assert.equal(variable(result, "config/runtime.env", "API_HOST").value, "https://runtime.example.com");

  assert.equal(result.files.some((item) => item.path === "../outside.env"), false);
  assert.equal(result.files.some((item) => item.path.startsWith("node_modules/")), false);
});
