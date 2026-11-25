import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const skillsRoot = join(root, "agent", "skills");
const skills = ["aifinpay", "aifinpay-merchant"];
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
let failed = false;
// A guide names no current, target or baseline version, and its commands install the latest release.
const STALE_CLAIMS = [
  [/release target/i, "a release target"],
  [/published baseline/i, "a publication baseline"],
  [/released and current|current (?:npm |pypi )?release/i, "a current-release claim"],
  [/\bchecked \d{4}-\d{2}-\d{2}/, "a dated publication check"],
  [/`@?aifinpay[\w/-]*`? \d+\.\d+\.x/, "a version-series label"],
  [/(?:@aifinpay\/[a-z-]+@|aifinpay-(?:agent|gate)==)\d/, "a pinned package version"],
];

function checkLatest(name, text) {
  const fail = (message) => {
    console.error(`FAIL: ${name}: ${message}`);
    failed = true;
  };
  for (const [pattern, what] of STALE_CLAIMS) {
    const found = text.match(pattern);
    if (found) fail(`names ${what} ("${found[0]}")`);
  }
  for (const [, rest] of text.matchAll(/npx(?: -y)? @aifinpay\/mcp(\S*)/g)) {
    if (!rest.startsWith("@latest")) fail("an npx command must run @latest");
  }
  for (const [, pkg, rest] of text.matchAll(/npm install @aifinpay\/(agent|gate|skill)(\S*)/g)) {
    if (!rest.startsWith("@latest")) fail(`npm install @aifinpay/${pkg} must install @latest`);
  }
  for (const [, upgrade, pkg] of text.matchAll(/pip install (-U )?aifinpay-(agent|gate)/g)) {
    if (!upgrade) fail(`pip install aifinpay-${pkg} must upgrade (-U)`);
  }
}

for (const name of skills) {
  const path = join(skillsRoot, name, "SKILL.md");
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error(`FAIL: missing ${path}`);
    failed = true;
    continue;
  }
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) {
    console.error(`FAIL: ${name}: no frontmatter block`);
    failed = true;
    continue;
  }
  for (const field of ["name:", "description:"]) {
    if (!m[1].includes(field)) {
      console.error(`FAIL: ${name}: frontmatter missing ${field}`);
      failed = true;
    }
  }
  const declared = m[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  if (declared !== name) {
    console.error(`FAIL: ${name}: frontmatter name is "${declared}"`);
    failed = true;
  }
  const skillVersion = m[1].match(/^version:\s*(\S+)$/m)?.[1];
  if (skillVersion !== version) {
    console.error(`FAIL: ${name}: frontmatter version ${skillVersion} differs from package ${version}`);
    failed = true;
  }
  checkLatest(name, text);
  if (name === "aifinpay" && !text.includes("\n## Always the latest release\n")) {
    console.error("FAIL: payer guide requires the section \"Always the latest release\"");
    failed = true;
  }
  if (text.includes("aifinpay.company") && !text.includes("retired")) {
    console.error(`FAIL: ${name}: references retired domain without noting retirement`);
    failed = true;
  }
  console.log(`ok: ${name} (${text.length} chars)`);
}

checkLatest("README.md", readFileSync(join(root, "README.md"), "utf8"));
const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8");
if (!changelog.startsWith(`## ${version} — `)) {
  console.error("FAIL: changelog must label the package version in its first release entry");
  failed = true;
}

// The Claude Code plugin manifests ship in the npm tarball and are what the
// marketplace install reads. They said 2.1.0 while npm served 2.4.0.
const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
if (lock.version !== version || lock.packages?.[""]?.version !== version) {
  console.error("FAIL: package-lock root versions differ from package.json");
  failed = true;
}
const plugin = JSON.parse(readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8"));
const marketplace = JSON.parse(readFileSync(join(root, ".claude-plugin", "marketplace.json"), "utf8"));
for (const [where, declared] of [
  ["plugin.json", plugin.version],
  ...marketplace.plugins.map((entry) => [`marketplace.json plugin "${entry.name}"`, entry.version]),
]) {
  if (declared !== version) {
    console.error(`FAIL: .claude-plugin/${where} version is ${declared}, package.json is ${version}`);
    failed = true;
  }
}

// No stray top-level skill files besides the index shim.
const topLevel = readdirSync(skillsRoot);
console.log(`skills/: ${topLevel.join(", ")}`);

if (failed) process.exit(1);
console.log("skill package valid");
