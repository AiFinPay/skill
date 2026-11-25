# @aifinpay/skill — agent guide

Published skill package: `agent/skills/aifinpay/SKILL.md` (payer) + `agent/skills/aifinpay-merchant/SKILL.md` (merchant).

## Scope
- This package only. Do not touch `mcp/`, `gate/`, `wallet/`, `node/`, `python/`.
- Skill markdown is authored once in this repository's `agent/skills/`, shipped by this npm package, then copied by the SDK MCP build into `mcp/skills/SKILL.md` (payer only). Coordinate the two repository PRs; the SDK's old `skill/` is only a moved-repo shim.

## Commands
- `npm test` — validates frontmatter (`name`, `description`) from `skill/`
- `npm pack --dry-run` — verify tarball contents before publish

## Rules
- Keep instructions aligned with shipped packages and the gated MCP tool inventory; never document ungated signing or unverified settlement.
- Bump package, lock, plugin manifest versions and CHANGELOG together when shipped files change. `npm test` validates metadata. The guides name no current, target or baseline package version: commands install `@latest` (npm) or upgrade (`pip install -U`), and a version number appears only as a minimum ("X and later"). `npm test` enforces it.
