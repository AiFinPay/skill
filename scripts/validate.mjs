import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const skillsRoot = join(root, "agent", "skills");
const skills = ["aifinpay", "aifinpay-merchant"];
let failed = false;

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
  if (text.includes("aifinpay.company") && !text.includes("retired")) {
    console.error(`FAIL: ${name}: references retired domain without noting retirement`);
    failed = true;
  }
  console.log(`ok: ${name} (${text.length} chars)`);
}

// The Claude Code plugin manifests ship in the npm tarball and are what the
// marketplace install reads. They said 2.1.0 while npm served 2.4.0.
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
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
