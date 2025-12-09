# 29. Use pnpm as package manager

2024-10-31: proposed
2024-11-21: postponed to later
2025-12-08: re-opened & updated (supply chain, rework structure)

## Context

We have been using [npm CLI](https://docs.npmjs.com/cli/v11/commands/npm) as our package manager. Its usage is dependency management, test/lint/type checking and general purpose script runner.

We initially proposed a move to [pnpm](https://pnpm.io/) due to ongoing challenges regarding speed of dependency resolution and disk space. In the light of recent [supply chain attacks on the npm registry](https://www.wiz.io/blog/shai-hulud-2-0-ongoing-supply-chain-attack), pnpm's advanced [supply chain security](https://pnpm.io/supply-chain-security) has become a deciding factor.

To summarize, we are facing the following problems:

- Supply Chain Vulnerabilities: Recent incidents, such as the [September 2025](https://cybersierra.co/blog/npm-chalk-debug-compromised/) compromise of `debug`/`chalk` and the November 2025 "Shai-Hulud 2" worm, have demonstrated how easily malicious code can spread via `npm` lifecycle scripts (`preinstall`/`postinstall`) and phantom dependencies.

- Slow installation times: `npm install` takes significant time in CI pipelines and local setup. While partly minimized by caching, fast dependency resolution of `pnpm` allows it to be added inside the `pnpm run dev` command to avoid outdated local dependencies. Non-cached dependency resolution or upgrading is consistently faster using `pnpm`.

- Disk space inefficiency: Duplicated dependencies across projects consume excessive disk space.

- Phantom dependencies: `npm` hoists transitive dependencies, allowing code to import packages not explicitly declared in `package.json`, see [pnpm's strictness helps to avoid silly bugs](https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html)

## Decision

We will migrate from `npm` to `pnpm` for this repository. We will investigate migrating our [strapi repository](https://github.com/digitalservicebund/a2j-rechtsantragstelle-strapi) after successful transition.

## Consequences

We will:

- use [Corepack](https://github.com/nodejs/corepack) (built into Node.js) to install `pnpm`
- specify the specific pnpm version via the `packageManager` field in `package.json` (used by corepack)
- specify pnpm via the `engines` field in `package.json`, to show a warning when using a non-supported CLI tool
