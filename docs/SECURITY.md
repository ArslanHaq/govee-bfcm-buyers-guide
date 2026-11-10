# Security notes

## Why this repo starts from a clean history

On 2026-11-10, while preparing this project, an obfuscated payload was found
appended to `next.config.js` **and** `tailwind.config.js` in the predecessor
repo `Grovvy-Quiz-web-app`. The legitimate config in each file is ~150 bytes;
both files were 7.1 KB, padded with whitespace so the payload sat off-screen.

### What it did

A blockchain-hosted dropper ("EtherHiding"):

1. Stashed `require`/`module` on `global` under the keys `r` / `m`.
2. Built a function via the `Function` constructor from a shuffled,
   dictionary-compressed string.
3. Read the latest transaction of TRON wallet
   `TMfKQEd7TJJa5xNZJZ2Lep838vrzrs7mAP` from `api.trongrid.io`, hex-decoded
   `raw_data.data` and reversed it to get a pointer (fallback: Aptos
   `fullnode.mainnet.aptoslabs.com`).
4. Called `eth_getTransactionByHash` on `bsc-dataseed.binance.org` for tx
   `0xbe037400…0811e`, hex-decoded the `input` field and XOR-decrypted it with
   the key `2[gWfGj;<:-93Z^C` to obtain stage two.
5. Ran it via `child_process.spawn('node', ['-e', …], {detached: true,
   stdio: 'ignore', windowsHide: true})`, falling back to `eval`.
   Throttled to once per 30s via `global._p_t`.

Because the payload lives in blockchain transactions, there is no domain to
block and the attacker can swap it at any time.

### Blast radius

`next.config.js` is evaluated by Node on `next dev`, `next build` and
`next start`, so it executed on every developer machine, on the GitHub Actions
runner (`RUN npm run build` in the Dockerfile) and in the production ECS
container.

### Timeline

| Commit | Date | State |
|---|---|---|
| `6c28fbe` | 2025-07-01 | `next.config.js` **added already infected** (7173 B) |
| `4b09432` | 2026-05-11 | incidentally clean (142 B) |
| `02a9800` | 2026-05-14 | infected again (7146 B) |

Neither later commit mentions config files — two machines held different local
copies. The repo was created 2025-06-18 from `create-next-app`; the infected
`next.config.js` appeared two weeks later.

### Response

- Both files were restored to their legitimate contents in the old repo
  (left **uncommitted** — pushing to `main` triggers an ECS deploy).
- `~/Development` was scanned: no other project was affected, and
  `node_modules` was clean.
- Credentials to rotate: `KLAVIYO_PRIVATE_API_KEY`, `KLAVIYO_LIST_ID`, the
  `AWS_OIDC_ROLE_ARN` GitHub secret, and anything reachable from the ECS task
  role. Review CloudTrail from 2025-07-01.
- This repo starts from `git init`, not a clone, and carries
  `npm run check:integrity` in CI and in the Docker build.

### Guard

`scripts/check-integrity.mjs` fails the build if a guarded config exceeds
2 KB, contains a known signature, or has any line over 500 characters — the
whitespace padding is what hid this one.
