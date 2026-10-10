import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const skillsRoot = join(root, "agent", "skills");
const skills = ["aifinpay", "aifinpay-merchant"];
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
let failed = false;
const targetsBySurface = new Map();
const targetPattern = /^Release target: MCP \*\*(\d+\.\d+\.\d+)\*\*, Node SDK \*\*(\d+\.\d+\.\d+)\*\*, Python \*\*(\d+\.\d+\.\d+)\*\*\.$/gm;
const reportingTargetPattern = /^Reporting release target: Node gate \*\*(\d+\.\d+\.\d+)\*\*, Python gate \*\*(\d+\.\d+\.\d+)\*\*\.$/gm;
const reportingTargetsBySurface = new Map();

function checkTargets(name, text) {
  const targets = [...text.matchAll(targetPattern)];
  if (targets.length !== 1 || text.includes("Released and current:")) {
    console.error(`FAIL: ${name}: requires one explicit cohort release target, not a current-release claim`);
    failed = true;
  } else {
    targetsBySurface.set(name, targets[0].slice(1).join("/"));
  }
  if (name !== "aifinpay") {
    const reportingTargets = [...text.matchAll(reportingTargetPattern)];
    if (reportingTargets.length !== 1) {
      console.error(`FAIL: ${name}: requires one explicit reporting gate release target`);
      failed = true;
    } else {
      reportingTargetsBySurface.set(name, reportingTargets[0].slice(1).join("/"));
    }
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
  checkTargets(name, text);
  if (name === "aifinpay") {
    if (!/^Published baseline checked \d{4}-\d{2}-\d{2}: MCP \*\*\d+\.\d+\.\d+\*\*, Node SDK \*\*\d+\.\d+\.\d+\*\*\.$/m.test(text)) {
      console.error("FAIL: payer guide requires a dated publication baseline");
      failed = true;
    }
  }
  if (text.includes("aifinpay.company") && !text.includes("retired")) {
    console.error(`FAIL: ${name}: references retired domain without noting retirement`);
    failed = true;
  }
  console.log(`ok: ${name} (${text.length} chars)`);
}

checkTargets("README.md", readFileSync(join(root, "README.md"), "utf8"));
if (new Set(targetsBySurface.values()).size > 1) {
  console.error("FAIL: payer, merchant and README cohort targets differ");
  failed = true;
}
if (new Set(reportingTargetsBySurface.values()).size > 1) {
  console.error("FAIL: merchant and README reporting gate targets differ");
  failed = true;
}
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
