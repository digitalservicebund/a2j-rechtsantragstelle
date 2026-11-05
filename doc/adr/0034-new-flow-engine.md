# ADR: Replace XState with a custom flow engine

## Status

- 2026-11-03: Drafted (retroactively records a decision implemented between 2026-06 and 2026-10)

## Context

Every service in the app (Vorab-Checks and Formulare) is a multi-page flow: the user answers questions page by page, and the answers decide which page comes next. Until 2026 these flows were modelled as [XState](https://stately.ai/docs/xstate) state machines. Each flow had a `flow.json` / `xstateConfig.ts` machine definition, a set of named guards, and an `ArrayConfigServer` in `meta.arrays` for every array. On every request, `buildFlowController` created the machine from the user's data and asked it for the next step, the previous step, which steps were reachable and the step states.

As the flows grew (PKH, Beratungshilfe, Erbschein Erbfolge, TGA Anwaltschaft), we kept running into limits of that approach:

1. **Back navigation was manual.** Every state needed an explicit `BACK` event, and every guarded forward branch needed a matching guarded back branch. These pairs often drifted apart, which caused bugs where "Zurück" sent users to the wrong page.
2. **Nested arrays were very hard.** Arrays needed a `-frage` / `uebersicht` / `warnung` / item sub-machine, an `add-*` event, an `isValid*ArrayIndex` guard and an `ArrayConfigServer` entry (see the previous version of [array-user-data.md](../array-user-data.md)). Arrays inside arrays, as needed for Erbfolge (children of children) and TGA (paragraphs per Hauptantrag), were close to impossible to express.
3. **A lot of boilerplate.** Machine setup, context types, named guard maps and events had to be kept in sync with the page schemas by hand. The machine, the page schemas and the array config were three separate sources of truth for the same flow.
4. **Repeated, opaque work per request.** `buildFlowController` was rebuilt up to four times per request (see [ADR 0033](./0033-formular-loader-refactoring.md)). Reachability used XState's shortest-path utilities, which were hard to debug without XState devtools.
5. **Pruning and progress lived outside the machine.** Data pruning ([ADR 0014](./0014-data-pruner.md)) and progress tracking needed their own traversal logic next to the machine, and that logic had to match the machine's behaviour.

We do not use the features XState is built for (actors, parallel states, side effects, long-lived interpreters). Our flows are stateless: the full state is the user's data, which is evaluated fresh on every request.

## Decision

We replace XState with our own small flow engine in [`app/services/flow/flowEngine/`](../../app/services/flow/flowEngine/README.md). It models a flow as a typed directed graph and evaluates it with pure functions.

A flow is defined once with `compileFlow({ pages, initialStep, transitions })`:

- **`pages`**: one record per page with its `stepId` (URL), an optional Zod `pageSchema`, and optional `arraySummary` metadata. This is the single source of truth for URLs, validation, the user data type (`InferredUserData`) and arrays.
- **`transitions`**: forward transitions only. Each one is a target, `null` (end of the flow), or an ordered list of `{ guard, target }` branches where the first branch that matches wins. Guards are inline functions over the typed user data. An array is entered with a branch of `type: "addArrayItem"`.

`compileFlow` runs once when the module loads. It validates the config, builds lookup tables and computes static progress depths. `createFlowSession(compiledFlow, userData, currentPath)` runs once per request. It simulates the flow against the current data in two passes, a linear walk and a breadth-first search (BFS), and returns everything the loader and action need: `nextPath`, `prevPath`, `isReachable`, `pageSchema`, `statusTree`, `prunedUserData` and progress.

Key properties:

- **Back navigation is derived, not configured.** `prevPath` comes from the simulated path, falling back to the BFS parent. No `BACK` transitions are written.
- **Arrays and nested arrays are first-class.** A `#` wildcard in `stepId` and field names (e.g. `/kinder/#/daten`, `kinder#vorname`, `hauptantrag#absaetze#formulierung`) supports any nesting depth.
- **Pruning, done status and progress are part of the engine.** They use the same simulation as navigation, so they always agree with it.
- **No runtime dependency.** The engine is plain TypeScript plus Zod and can be tested with ordinary unit tests.

Migration was incremental. The engine started with Erbschein Erbfolge (2026-06) and was then adopted by TGA, Fluggastrechte, PKH and the remaining flows. XState was removed entirely in #4348 (2026-10-15).

## Consequences

### Positive

- Defining a flow takes `pages.ts`, `flowConfig.ts` and a one-line `userData.ts`; the machine, guard maps and array config are gone. See [adding-a-new-service.md](../adding-a-new-service.md).
- Back navigation, reachability, pruning, section status and progress come from one simulation, so they can no longer disagree with each other.
- Nested arrays of any depth work without special-case code in the flow.
- The user data type is inferred from the page schemas, so guards are type-checked against real field names.
- Each request is a pure function of `(transitions, userData, path)`, so it is reproducible and easy to unit test.
- The graph is compiled once at module load instead of rebuilding a machine on every request.

### Negative

- We now own the engine: bugs, edge cases (cycles in array loops, BFS scoping, back navigation from array summaries) and documentation are our job.
- The team's XState knowledge no longer applies, and new team members have to learn a custom model. We address this with the engine README and the guides in `doc/`.
- Some XState terminology remains, such as `stepId` for what is really a page path. A rename to `path` is planned (TODO in `types.ts`).
- Cross-section rules (e.g. "all sections done before the summary") are written as guards on `pageData.subflowDoneStates` and are not built into the engine.

## Alternatives considered

- **Keep XState and refactor around it.** This would have reduced the per-request rebuilds ([ADR 0033](./0033-formular-loader-refactoring.md)), but not the manual back navigation, the array boilerplate or the nested-array limits, which were the main problems.
- **Upgrade to a newer XState major version.** This would not change the model. The cost of the statechart abstraction would stay, without us using its strengths.
- **Another form/wizard library.** The libraries we looked at are tied to client-side state or a UI framework. They do not fit our server-rendered, no-JavaScript-compatible ([ADR 0021](./0021-users-without-javascript.md)), session-backed flows.
