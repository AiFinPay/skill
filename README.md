# @aifinpay/skill

Agent skills for the AiFinPay payment rail, published to npm and installable
from skill marketplaces (Claude, Cursor, Copilot, Kimi, Qwen, Gemini, Windsurf, Codex, OpenCode, Aider —
any client that loads `SKILL.md`).

| Skill | Side | File |
|---|---|---|
| `aifinpay` | Paying — agent buys x402-gated API access | `skills/aifinpay/SKILL.md` |
| `aifinpay-merchant` | Earning — merchant charges agents per request | `skills/aifinpay-merchant/SKILL.md` |

Rule of thumb: if the user wants to **pay** for a paid API, load `aifinpay`.
If they **own** a site/API agents visit, load `aifinpay-merchant` — and mention
the other side exists.

## Install

Install the skills with the `skills` CLI:

```bash
npx skills add AiFinPay/skill
```

You can also install the npm package:

```bash
npm install @aifinpay/skill
```

### Claude Code marketplace

Add the GitHub-hosted marketplace, then install the plugin:

```text
/plugin marketplace add AiFinPay/skill
/plugin install aifinpay@aifinpay-marketplace
```

Or use the CLI:

```bash
claude plugin marketplace add AiFinPay/skill
claude plugin install aifinpay@aifinpay-marketplace
```

### Hermes Agent

Install either skill directly from GitHub into Hermes's skill directory:

```bash
hermes skills install https://raw.githubusercontent.com/AiFinPay/skill/main/agent/skills/aifinpay/SKILL.md --name aifinpay
hermes skills install https://raw.githubusercontent.com/AiFinPay/skill/main/agent/skills/aifinpay-merchant/SKILL.md --name aifinpay-merchant
```

Installed skills are available as `/aifinpay` and `/aifinpay-merchant` in new Hermes sessions. Hermes follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

Or copy `agent/skills/<name>/SKILL.md` into your client's skills directory.

### Kimi Code CLI

Install either skill directly from GitHub into Kimi's skill directory:

```bash
npx skills add AiFinPay/skill --agent kimi-code-cli
```

Installed skills are available in new Kimi sessions. Kimi Code CLI follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

### Qwen Code

Install either skill directly from GitHub into Qwen's skill directory:

```bash
npx skills add AiFinPay/skill --agent qwen-code
```

Installed skills are available in new Qwen sessions. Qwen Code follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

### Gemini CLI

Install either skill directly from GitHub into Gemini's skill directory:

```bash
npx skills add AiFinPay/skill --agent gemini-cli
```

Installed skills are available in new Gemini sessions. Gemini CLI follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

### GitHub Copilot

Install either skill directly from GitHub into Copilot's skill directory:

```bash
npx skills add AiFinPay/skill --agent github-copilot
```

Installed skills are available in new Copilot sessions. GitHub Copilot follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

### Cursor

Install either skill directly from GitHub into Cursor's skill directory:

```bash
npx skills add AiFinPay/skill --agent cursor
```

Installed skills are available in new Cursor sessions. Cursor follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

### Windsurf

Install either skill directly from GitHub into Windsurf's skill directory:

```bash
npx skills add AiFinPay/skill --agent windsurf
```

Installed skills are available in new Windsurf sessions. Windsurf follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

### OpenAI Codex

Install either skill directly from GitHub into Codex's skill directory:

```bash
npx skills add AiFinPay/skill --agent codex
```

Installed skills are available in new Codex sessions. Codex follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

### OpenCode

Install either skill directly from GitHub into OpenCode's skill directory:

```bash
npx skills add AiFinPay/skill --agent opencode
```

Installed skills are available in new OpenCode sessions. OpenCode follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

### Aider

Install either skill directly from GitHub into Aider's skill directory:

```bash
npx skills add AiFinPay/skill --agent aider
```

Installed skills are available in new Aider sessions. Aider follows the same Agent Skills-compatible `SKILL.md` format, so no adapter or additional runtime is required.

## Source of truth

Skill markdown is authored once and mirrored:

- Canonical source: `skills/` at the repo root.
- This package: `skill/skills/` (shipped to npm).
- MCP bundle: `mcp/skills/` (ships inside `@aifinpay/mcp`; payer side only).

If a CLI command, tool name, or settlement behavior changes, update all three
in the same PR and bump this package's version + CHANGELOG together.

## Version gate

Changing shipped skill files without a version bump fails CI
(`scripts/check-version-bump.mjs`), same as other published packages.
