import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function validateFixture(mutate = () => {}) {
  const fixture = mkdtempSync(join(tmpdir(), "aifinpay-skill-metadata-"));
  try {
    for (const path of ["agent", ".claude-plugin", "package.json", "package-lock.json", "README.md", "CHANGELOG.md", "scripts"]) {
      cpSync(join(root, path), join(fixture, path), { recursive: true });
    }
    mutate(fixture);
    const result = spawnSync(process.execPath, [join(fixture, "scripts", "validate.mjs")], { encoding: "utf8" });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

function replace(fixture, path, before, after) {
  const filename = join(fixture, path);
  const original = readFileSync(filename, "utf8");
  assert.ok(original.includes(before), `missing mutation target in ${path}`);
  writeFileSync(filename, original.replace(before, after));
}

test("the coordinated candidate passes its metadata guard", () => {
  const result = validateFixture();
  assert.equal(result.status, 0, result.output);
});

const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
const payer = "agent/skills/aifinpay/SKILL.md";
const merchant = "agent/skills/aifinpay-merchant/SKILL.md";
const cohort = readFileSync(join(root, payer), "utf8").match(/^Release target:.+$/m)[0];
const reporting = readFileSync(join(root, merchant), "utf8").match(/^Reporting release target:.+$/m)[0];
const baseline = readFileSync(join(root, payer), "utf8").match(/^Published baseline checked.+$/m)[0];

for (const [name, path, before, after, diagnostic] of [
  ["payer version drift", payer, `version: ${version}`, "version: 0.0.0", /frontmatter version/],
  ["merchant version drift", merchant, `version: ${version}`, "version: 0.0.0", /frontmatter version/],
  ["lock version drift", "package-lock.json", `"version": "${version}"`, '"version": "0.0.0"', /package-lock root versions/],
  ["plugin version drift", ".claude-plugin/plugin.json", `"version": "${version}"`, '"version": "0.0.0"', /plugin.json version/],
  ["marketplace version drift", ".claude-plugin/marketplace.json", `"version": "${version}"`, '"version": "0.0.0"', /marketplace.json.*version/],
  ["merchant cohort drift", merchant, cohort, cohort.replace(/MCP \*\*[^*]+\*\*/, "MCP **0.0.0**"), /cohort targets differ/],
  ["README cohort drift", "README.md", cohort, cohort.replace(/Python \*\*[^*]+\*\*/, "Python **0.0.0**"), /cohort targets differ/],
  ["reporting gate cohort drift", "README.md", reporting, reporting.replace(/Node gate \*\*[^*]+\*\*/, "Node gate **0.0.0**"), /reporting gate targets differ/],
  ["duplicate release target", payer, cohort, `${cohort}\n${cohort}`, /one explicit cohort release target/],
  ["undated publication claim", payer, baseline, baseline.replace(/ checked \d{4}-\d{2}-\d{2}/, ""), /dated publication baseline/],
  ["current-release claim", payer, cohort, `${cohort}\nReleased and current:`, /current-release claim/],
  ["changelog version drift", "CHANGELOG.md", `## ${version}`, "## 0.0.0", /changelog must label the package version/],
]) {
  test(`reject ${name}`, () => {
    const result = validateFixture((fixture) => replace(fixture, path, before, after));
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, diagnostic);
  });
}
