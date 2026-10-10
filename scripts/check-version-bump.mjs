import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const baseRef = process.argv[2] || "origin/main";
// Unlike a missing-base skip, a history/configuration failure is a failed gate.
const base = git(["merge-base", "HEAD", baseRef]);
// Include pending candidate edits as well as committed changes. CI's clean
// checkout is identical; a local precommit check must not silently pass no diff.
const changed = git(["diff", "--name-only", base]).split("\n");
const published = /^(agent\/|\.claude-plugin\/|package\.json$|README\.md$|LICENSE$|CHANGELOG\.md$)/;
if (changed.some((path) => published.test(path))) {
  const before = JSON.parse(git(["show", `${base}:package.json`])).version;
  const now = JSON.parse(readFileSync("package.json", "utf8")).version;
  if (now === before) {
    console.error(`Published skill files changed, but version is still ${now}`);
    process.exit(1);
  }
  console.log(`Skill version ${before} -> ${now}`);
}
console.log("Skill version gate passed");
