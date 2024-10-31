# 15. Should we use pnpm instead pnpm

Date: 2024-10-28

## Status

Proposed

## Context

First, in my opinion it is more a RFC than an ADR.

Actually we use `npm` in our development process, but this ends up in several challanges. One of the biggest challanges is the installation speed and the disk space usage.

Since version 3 `npm` uses a flat dependency structure but in three cases it creates a nested `node_modules` folder which leads to a higher disk space usage and a complex dependency resolution.

### Version conflicts

```node_modules/
├── package-a@1.0.0/
│   └── node_modules/
│       └── lodash@5.0.0/  # refers top level lodash
├── package-b@2.0.0/
│   └── node_modules/
│       └── lodash@3.0.0/  # Needs different version
└── lodash@5.0.0/
```

#### Additional Reading

For a more detail view of what can happened with npm, you can refer to this article: [pnpm's strictness helps to avoid silly bugs](https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html#disqus_thread)

### What makes `pnpm` different?

The performant package manager, `pnpm` addresses these issues by using a content-addressable storage system to store packages. This means that packages are stored in a global store and symlinked into `node_modules`. That means `pnpm` keeps all the fetched packages in the "store" directory and first looks there if a package is already installed instead of fetching it again like npm does.

Another advantage with this structure is that dependencies are isolated. A package in your project can only access the dependencies explicitly declared in its package.json. Unlike `npm` where a package have implizit access to all their dependencies and subdependencies.

Additional benefits:

- you can install dependencies while offline mode `pnpm i --offline`
- CI/CD integrate fetching from cache during installation process

## Decision

We will create a test pipeline to evaluate the performance and disk space usage of `pnpm` vs `npm`.

My guess is that `pnpm` will perform better up to 50% on installaton speed and use less disk space up to 10%.

## Consequences

- for now nothing
