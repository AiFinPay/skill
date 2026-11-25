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

test("the package passes its metadata guard", () => {
  const result = validateFixture();
  assert.equal(result.status, 0, result.output);
});

const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
const payer = "agent/skills/aifinpay/SKILL.md";
const merchant = "agent/skills/aifinpay-merchant/SKILL.md";
for (const [name, path, before, after, diagnostic] of [
  ["payer version drift", payer, `version: ${version}`, "version: 0.0.0", /frontmatter version/],
  ["merchant version drift", merchant, `version: ${version}`, "version: 0.0.0", /frontmatter version/],
  ["lock version drift", "package-lock.json", `"version": "${version}"`, '"version": "0.0.0"', /package-lock root versions/],
  ["plugin version drift", ".claude-plugin/plugin.json", `"version": "${version}"`, '"version": "0.0.0"', /plugin.json version/],
  ["marketplace version drift", ".claude-plugin/marketplace.json", `"version": "${version}"`, '"version": "0.0.0"', /marketplace.json.*version/],
  ["release target", payer, "## Always the latest release", "Release target: MCP **9.9.9**.\n\n## Always the latest release", /names a release target/],
  ["publication baseline", merchant, "## Agent traffic: report gate events", "Published baseline: gate 9.9.9.\n\n## Agent traffic: report gate events", /names a publication baseline/],
  ["current-release claim", "README.md", "# @aifinpay/skill", "# @aifinpay/skill\n\nCurrent npm release: 9.9.9.", /names a current-release claim/],
  ["dated publication check", merchant, "## Agent traffic: report gate events", "Both are published (checked 2026-11-12).\n\n## Agent traffic: report gate events", /names a dated publication check/],
  ["version-series label", payer, "| MCP `@aifinpay/mcp` |", "| MCP `@aifinpay/mcp` 9.9.x |", /names a version-series label/],
  ["pinned command", payer, "claude mcp add aifinpay -- npx -y @aifinpay/mcp@latest", "claude mcp add aifinpay -- npx -y @aifinpay/mcp@9.9.9", /names a pinned package version/],
  ["bare npx", payer, "claude mcp add aifinpay -- npx -y @aifinpay/mcp@latest", "claude mcp add aifinpay -- npx -y @aifinpay/mcp", /an npx command must run @latest/],
  ["bare npm install", merchant, "npm install @aifinpay/gate@latest\n```", "npm install @aifinpay/gate\n```", /must install @latest/],
  ["pip without upgrade", merchant, "pip install -U aifinpay-gate\n```", "pip install aifinpay-gate\n```", /must upgrade/],
  ["missing latest section", payer, "## Always the latest release", "## Versions", /requires the section/],
  ["changelog version drift", "CHANGELOG.md", `## ${version}`, "## 0.0.0", /changelog must label the package version/],
]) {
  test(`reject ${name}`, () => {
    const result = validateFixture((fixture) => replace(fixture, path, before, after));
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, diagnostic);
  });
}
