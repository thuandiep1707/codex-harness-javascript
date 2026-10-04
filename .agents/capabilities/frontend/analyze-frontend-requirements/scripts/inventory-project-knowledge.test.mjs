#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const helperPath = fileURLToPath(new URL("./inventory-project-knowledge.mjs", import.meta.url));

function writeFile(projectRoot, relativePath, content) {
  const absolute = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, "utf8");
}

function runHelper(projectRoot, args, expectedStatus = 0) {
  const result = spawnSync(
    process.execPath,
    [helperPath, "--project-root", projectRoot, ...args],
    { encoding: "utf8" },
  );

  assert.equal(
    result.status,
    expectedStatus,
    [
      `helper exited with ${result.status}, expected ${expectedStatus}`,
      result.stderr,
      result.stdout,
    ].filter(Boolean).join("\n"),
  );

  if (expectedStatus !== 0) return result;
  return JSON.parse(result.stdout);
}

function createLargeFixture() {
  const runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "brain-knowledge-fixture-"));
  const projectRoot = path.join(runtimeRoot, "project");
  fs.mkdirSync(projectRoot, { recursive: true });

  writeFile(projectRoot, "README.md", "# CTU FE\nProject bootstrap.\n");
  writeFile(
    projectRoot,
    "AGENTS.md",
    "# Project conventions\nanalysis is curated current-system knowledge. plans and progresses are generated history.\n",
  );
  writeFile(projectRoot, "CLAUDE.md", "# Project AI notes\nDo not treat generated history as product truth.\n");

  writeFile(
    projectRoot,
    "analysis/README.md",
    "# Analysis index\n- rescue -> analysis/rescue.md\n- mission -> analysis/mission.md\n",
  );
  writeFile(
    projectRoot,
    "analysis/rescue.md",
    "# Rescue\nRescue writes rescueStore and CT-Map renders rescue markers from MapEntityStore.\n",
  );

  const modules = ["fleet", "mission", "setting", "map", "drone", "auth", "dashboard", "telemetry"];
  for (const moduleName of modules) {
    writeFile(
      projectRoot,
      `analysis/${moduleName}.md`,
      `# ${moduleName}\nCurrent ${moduleName} architecture notes.\n`,
    );
  }

  for (let i = 0; i < 100; i += 1) {
    writeFile(
      projectRoot,
      `docs/rescue-page-redesign/spec-${String(i).padStart(3, "0")}.md`,
      `# Rescue requirement ${i}\nThe rescue page must preserve marker behavior and CT-Map integration.\n`,
    );
  }

  const pairedStem = "rescue-marker-refactor-20260912";
  writeFile(
    projectRoot,
    `plans/${pairedStem}.md`,
    "# Rescue marker refactor plan\nHistorical implementation intent for rescue marker refactor.\n",
  );
  writeFile(
    projectRoot,
    `progresses/${pairedStem}.md`,
    "# Rescue marker refactor progress\nHistorical execution claim for rescue marker refactor.\n",
  );

  for (let i = 1; i < 500; i += 1) {
    const stem = `rescue-generated-${String(i).padStart(3, "0")}`;
    writeFile(
      projectRoot,
      `plans/${stem}.md`,
      `# Rescue generated plan ${i}\nHistorical rescue implementation intent.\n`,
    );
    writeFile(
      projectRoot,
      `progresses/${stem}.md`,
      `# Rescue generated progress ${i}\nHistorical rescue execution claim.\n`,
    );
  }

  return {
    runtimeRoot,
    projectRoot,
    indexFile: path.join(runtimeRoot, "project-knowledge-index.json"),
    pairedStem,
  };
}

const corpusArgs = [
  "--hot-path", "analysis",
  "--hot-path", "docs",
  "--cold-path", "plans",
  "--cold-path", "progresses",
  "--pair-roots", "plans=progresses",
];

test("large fixture keeps historical corpus cold and reuses one transient index", (t) => {
  const fixture = createLargeFixture();
  t.after(() => fs.rmSync(fixture.runtimeRoot, { recursive: true, force: true }));

  const first = runHelper(fixture.projectRoot, [
    ...corpusArgs,
    "--index-file", fixture.indexFile,
    "--query", "rescue",
    "--max-results", "20",
    "--max-inventory", "20",
  ]);

  assert.equal(first.stats.filesIndexed, 1113);
  assert.equal(first.stats.hotFiles, 113);
  assert.equal(first.stats.coldFiles, 1000);
  assert.equal(first.stats.filesystemScans, 1);
  assert.equal(first.stats.indexReused, false);
  assert.equal(first.stats.indexWritten, true);
  assert.ok(first.stats.matchedByTier.cold > 0);
  assert.ok(first.candidates.length > 0);
  assert.ok(first.candidates.every((candidate) => candidate.corpusTier === "hot"));
  assert.ok(first.inventory.every((document) => document.corpusTier === "hot"));
  assert.equal(first.candidates[0].path, "analysis/rescue.md");

  const followUp = runHelper(fixture.projectRoot, [
    ...corpusArgs,
    "--index-file", fixture.indexFile,
    "--query", "MapEntityStore",
  ]);

  assert.equal(followUp.stats.filesystemScans, 0);
  assert.equal(followUp.stats.indexReused, true);
  assert.equal(followUp.stats.indexWritten, false);
  assert.equal(followUp.candidates[0].path, "analysis/rescue.md");

  const cold = runHelper(fixture.projectRoot, [
    ...corpusArgs,
    "--index-file", fixture.indexFile,
    "--search-tier", "cold",
    "--query", fixture.pairedStem,
    "--max-results", "10",
  ]);

  assert.equal(cold.stats.filesystemScans, 0);
  assert.equal(cold.stats.indexReused, true);
  assert.ok(cold.candidates.length >= 2);

  const plan = cold.candidates.find(
    (candidate) => candidate.path === `plans/${fixture.pairedStem}.md`,
  );
  const progress = cold.candidates.find(
    (candidate) => candidate.path === `progresses/${fixture.pairedStem}.md`,
  );

  assert.ok(plan);
  assert.ok(progress);
  assert.deepEqual(plan.pairedPaths, [`progresses/${fixture.pairedStem}.md`]);
  assert.deepEqual(progress.pairedPaths, [`plans/${fixture.pairedStem}.md`]);
});

test("no corpus hints preserves backward-compatible all-hot behavior", (t) => {
  const runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "brain-knowledge-default-"));
  const projectRoot = path.join(runtimeRoot, "project");
  fs.mkdirSync(projectRoot, { recursive: true });
  t.after(() => fs.rmSync(runtimeRoot, { recursive: true, force: true }));

  writeFile(projectRoot, "analysis/rescue.md", "# Rescue\nCurrent rescue behavior.\n");
  writeFile(projectRoot, "plans/rescue.md", "# Rescue plan\nHistorical rescue intent.\n");

  const result = runHelper(projectRoot, ["--query", "rescue"]);

  assert.equal(result.stats.hotFiles, 2);
  assert.equal(result.stats.coldFiles, 0);
  assert.equal(result.candidates.length, 2);
  assert.ok(result.candidates.every((candidate) => candidate.corpusTier === "hot"));
});

test("transient index must not be written inside the working project", (t) => {
  const runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "brain-knowledge-index-boundary-"));
  const projectRoot = path.join(runtimeRoot, "project");
  fs.mkdirSync(projectRoot, { recursive: true });
  t.after(() => fs.rmSync(runtimeRoot, { recursive: true, force: true }));

  writeFile(projectRoot, "analysis/rescue.md", "# Rescue\nCurrent rescue behavior.\n");

  const result = runHelper(
    projectRoot,
    ["--index-file", path.join(projectRoot, ".brain-index.json"), "--query", "rescue"],
    2,
  );

  assert.match(result.stderr, /outside the working project/i);
});
