# @aifinpay/skill

Agent skills for the AiFinPay payment rail, published to npm and installable
from skill marketplaces (Claude, Cursor, Copilot, Kimi, Qwen, Gemini, Windsurf, Codex, OpenCode, Aider —
any client that loads `SKILL.md`).

| Skill | Side | File |
|---|---|---|
| `aifinpay` | Paying — agent buys x402-gated API access | `agent/skills/aifinpay/SKILL.md` |
| `aifinpay-merchant` | Earning — merchant charges agents per request | `agent/skills/aifinpay-merchant/SKILL.md` |

Version2.8.1 describes the coordinated MCP2.7.0 / Node and Python SDK2.5.0
release target, including the Solana source adapter. Canonical disabled Solana
records remain unavailable until accepted and served. Its nine EVM descriptors
require explicit owner and merchant
network consent plus backend readiness; installing instructions does not
activate networks. Historical published baselines are dated in the payer
guide and do not claim the target packages have already been published.

Rule of thumb: if the user wants to **pay** for a paid API, load `aifinpay`.
If they **own** a site/API agents visit, load `aifinpay-merchant` — and mention
the other side exists.

## Install

Install the skills with the `skills` CLI:

```bash
npx skills add AiFinPay/skill
```

Then ask your agent: **"Buy access for this site."** It checks that the site
accepts AiFinPay, tells you what one batch buys, and pays only after you agree
and only within the limits and sites you configured for the MCP server or SDK.

You can also install the npm package:

```bash
npm install @aifinpay/skill
```

### Claude Chat: enable the payment network path

Chat's code-execution sandbox can use the Node or Python SDK; an AiFinPay MCP
connection is not required. Installing the skill alone does not install the
SDK or grant permission to pay.

1. In **Settings → Capabilities**, enable **Code execution and file creation**
   and **Allow network egress**. Managed accounts may require an organization
   owner to change organization settings.
2. In **Domain allowlist**, choose **Package managers and specific domains**
   and add `api.aifinpay.io`, the selected RPC host (`polygon.drpc.org` for
   Polygon), and the exact site you want to pay, e.g. `dev.ratersapp.com`.
   If the independent-price path needs them, also allow `api.coinbase.com`
   or `api.coingecko.com`. **Package managers only** permits installation,
   not those payment requests. Labels may vary by plan/client.
3. **All domains** can also allow the requests, but is broader and riskier.
   It is your choice, not a requirement; restore your narrower setting after
   the session if you expanded it. Network access never changes payment limits.
4. Ask: **"Set yourself up with a wallet on Polygon so you can pay for APIs."**
   The agent must warn that its sandbox is temporary, offer continuing here
   versus using a local client, and wait for your choice. It must test
   AiFinPay discovery (HTTP 200) and the RPC (`eth_chainId` = `0x89`) from that
   same sandbox, reuse an existing configured wallet, and ask for missing
   limits, allowed sites, gas cap and private storage choices before creating
   a new one. Do not fund it until those checks pass.

If you choose to continue in the sandbox, fund only what this session needs.
If the only key copy is in a discarded container, remaining funds become
inaccessible. Never paste keys or passphrases into chat. Payment approval is
your explicit confirmation, not an MCP `Allow payable_fetch` dialog. The SDK
must still enforce your origins, budgets, gas cap and journal/recovery rules.

To link it: **dash.aifinpay.io → My Agents → Add agent by address**. Enter its
public address, give the issued challenge to the agent, then paste its
`signDashboardClaim` signature into the dashboard. Linking does not back up
or move the key. Returning remaining funds is a separate transfer requiring
your approval of destination, amount and network; do not assume it happened.

See [Claude's network settings and security guidance](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude).

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

- Canonical source and npm package: this repository's `agent/skills/`.
- MCP bundle: SDK repository `mcp/skills/SKILL.md`, copied from the installed
  canonical package at build time (payer side only).
- The SDK repository's old `skill/README.md` only points here; it is not a
  second skill package or authored mirror.

If a CLI command, tool name, or settlement behavior changes, update all three
in coordinated PRs and bump this package's version + CHANGELOG together.
MCP verifies installed/bundled/served bytes and the exact release target;
publish this package before refreshing MCP's real registry dependency lock.

## Version gate

Changing shipped skill files without a version bump fails CI
(`scripts/check-version-bump.mjs`), same as other published packages.
