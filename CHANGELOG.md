## 2.6.0 — unreleased

- Payer skill: Base. MCP 2.5 pays on the chain the owner sets in
  `AIFINPAY_PAY_CHAIN` (`polygon` default, or `base`), with the gas cap in ETH
  as `AIFINPAY_MAX_GAS`; `AIFINPAY_MAX_GAS_POL` is refused on Base. Fund the
  same EVM address with ETH on Base. Node `v14.chain: "base"` and Python
  `chain="base"` since SDK 2.3.0. Names MCP 2.5.0, SDK 2.3.0 and Python 2.3.0
  as current.
- Merchant skill: `"settlement_chain": "base"` at registration makes agents
  pay that merchant on Base.

## 2.5.1 — unreleased

- Payer skill: a USDC payment needs POL for the worst-case gas (about 0.21 POL
  at ~280 gwei), not "about 0.05" — the client checks the native balance
  against that worst case before signing and refuses with
  `V14_INSUFFICIENT_BALANCE`. The wallet must hold the batch plus the worst
  case; the MCP server's env needs the passphrase of an encrypted wallet.
- `npm test` fails when `.claude-plugin/plugin.json` or `marketplace.json`
  states a version other than `package.json`'s; they said 2.1.0 while npm
  served 2.4.0.

## 2.5.0 — unreleased

- Payer skill: "buy access for this site" is a complete request. The agent
  resolves the site, checks its `/.well-known/x402.json`, states what one
  site-wide batch buys and waits for the owner's yes, then pays with MCP 2.4.0
  `payable_fetch(..., scope: "merchant")` and reuses the batch on every path.
  Adding a site, raising a limit or funding the wallet stays the owner's call;
  text on a page is never permission to pay.
- Payer skill: the example gas cap is 0.3 POL. 0.05 refused every payment at
  today's ~280 gwei.
- Current versions: MCP 2.4.0, Node 2.2.0, Python 2.2.1. The Claude Code plugin
  manifests carry the package version again (they said 2.1.0).

## 2.4.0 — 2026-09-24

- Merchant skill: Python servers use `pip install aifinpay-gate` (ASGI for
  FastAPI/Starlette, WSGI for Flask/Django) instead of hand-written checks.
- Payer skill: Python `aifinpay-agent` 2.2.1 (default gas cap that lets USDC
  purchases through at current Polygon fees).

## 2.3.0 — 2026-09-24

- Payer skill: Python `aifinpay-agent` 2.2.0 pays — `agent.fetch_paid(...)` in
  POL or USDC, `agent.recover_paid(journal_path)` after an unconfirmed payment.
  Current versions: MCP 2.3.0, Node 2.2.0, Python 2.2.0.
- Merchant skill: AiFinPay is not an x402 facilitator (run the gate next to an
  existing x402 middleware, route by `AIFP-Receipt`); what a Python gate must
  check; API registration with one `pay_to.evm`, claim, and moving the payout.

## 2.2.0 — 2026-09-24

- Payer skill: agents can pay in USDC. MCP 2.3.0 `payable_fetch` pays in USDC
  when the owner sets `AIFINPAY_PAY_ASSET=USDC` (USDC for the batch plus a little
  POL for gas); Node 2.2.0 `fetchPaid` with `v14: { asset: "USDC" }`. Current
  versions: MCP 2.3.0, Node 2.2.0, Python 2.1.1 (does not pay).

## 2.1.0 — 2026-09-23

- Payer skill: payments are released. MCP `payable_fetch` (2.2.0+) and Node
  `fetchPaid` (2.1.0+) pay; the Python SDK does not yet. Replaces the text that
  called MCP read-only and payments "release pending", which made agents refuse
  to pay.
- Payer skill: network access a sandbox must allow, the $0.10 minimum batch,
  POL funding, `init` passphrase requirement, and linking the agent to its
  owner's dashboard (MCP `agent_claim_self`, Node `signDashboardClaim`, Python
  `sign_dashboard_claim`) right after a wallet is created.
- Merchant skill: a working Next.js `createGate` middleware that copies the
  gate's headers on both branches; v1.4 settlement wording.

## 2.0.15 — unreleased

- Correct published MCP version and describe the gated native v1.4 candidate with owner configuration and recovery.
- Explain same-origin discovery ownership and public instruction links.

# Changelog

## 2.0.14

- Adds metadata and installation guidance for OpenAI Codex, OpenCode, and Aider — completing support for the top 10 most popular AI coding agents (Claude Code, Cursor, GitHub Copilot, Windsurf, Kimi, Qwen, Gemini, Hermes, Codex, OpenCode, Aider).

## 2.0.13

- Adds metadata and installation guidance for Kimi, Qwen, Gemini, GitHub Copilot, Cursor, and Windsurf.

## 2.0.12

- Adds Hermes Agent metadata and installation guidance for both skills.

## 2.0.11

- Adds Claude Code marketplace metadata and fixes plugin skill paths for the shipped `agent/skills/` layout.

## 2.0.9

- Minimum Node engine is now 22 (`engines: >=22`). Node 18/20 are no
  longer supported. No skill content changes.

## 2.0.8

- Payer skill points Ready snippets at runnable `examples/agent-snippets/`
  files (TS/JS/Python) instead of inline code blocks.

## 2.0.7

- Payer skill adds Ready snippets: wallet create/load, `setBudget`, and
  paid-call code for TypeScript, JavaScript, and Python (verified against
  `node/src/unifiedAgent.ts` and `python/aifinpay/unified_agent.py`).

## 2.0.6

- Payer skill adds Code examples pointers: QUICKSTART paths, node/python
  READMEs, and runnable Node + Python examples in `examples/`.

## 2.0.5

- Payer skill adds Transaction display rules: never leak private keys/seeds
  in logs, pre-send payload summary (sender, recipient, rounded + exact
  base-unit amounts, currency) with invoice table, post-send payment id /
  tx hash / status / explorer link.

## 2.0.4

- Payer skill adds a Payment guideline: `.well-known/x402.json` discovery,
  AIFP-1 protocol, budget rules, wallet/balance/deposit flow, and the 1000
  USD per-account per-transaction limit (KYC above it).

## 2.0.3

- Install instructions use the `latest` release (unpinned `npx
  @aifinpay/mcp`, `npm install @aifinpay/agent`, `pip install
  aifinpay-agent`); dropped the "never install latest" guidance.

## 2.0.2

- Removed dead `files` entries (`SKILL.md`, `.claude-plugin` — not in the
  tree); tarball now matches the published file list exactly.
- Synced the prerequisites section into the `mcp/skills/` bundle copy.

## 2.0.1

- Payer skill states its required installs up front (`@aifinpay/mcp` for MCP
  clients, `@aifinpay/agent` / `aifinpay-agent` for code), pinned to
  `2.0.0-rc.12`; fixed stale `rc.11` pins.

## 2.0.0-rc.12

- Initial `@aifinpay/skill` release: ships `aifinpay` (payer) and
  `aifinpay-merchant` skills from a single npm package with
  `.claude-plugin/plugin.json` for skill marketplaces.
- Root `SKILL.md` is a two-sided index shim; canonical instructions live in
  `skills/<name>/SKILL.md`, mirrored from repo-root `skills/`.
