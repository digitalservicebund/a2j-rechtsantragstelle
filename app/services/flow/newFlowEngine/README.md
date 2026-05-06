# New Flow Engine

A deterministic, simulation-based engine for multi-page form flows. It separates static configuration (pages, schemas, transitions) from dynamic per-request session evaluation — providing predictable navigation, nested array support, and data pruning without stateful actors.

## Quick Start

Define your pages and their connections once. The engine handles navigation, validation, and data pruning per request.

```ts
// 1. Define pages (done once per flow, at module load)
const myPages = {
  start:   { stepId: "/start" },
  name:    { stepId: "/name",    pageSchema: { name: z.string() } },
  address: { stepId: "/address", pageSchema: { street: z.string() } },
  end:     { stepId: "/end" },
} as const;

// 2. Compile the static flow (cached — no work repeated per request)
const staticFlow = compileFlow({
  pages: myPages,
  initialStep: "start",
  transitions: {
    start:   "name",
    name:    "address",
    address: [
      { target: "end", guard: (d) => d.name !== "" },
      { target: "name" },  // fallback: revisit name
    ],
    end: null,
  },
});

// 3. Create a per-request session
const session = createFlowSession(staticFlow, userData, currentStepId);

session.getNextStep();      // → next stepId given current userData
session.getPrevStep();      // → previous stepId (topological parent)
session.isReachable(id);    // → boolean
session.pageSchema;         // → compiled Zod schema for the current step
session.prunedUserData;     // → userData with unreachable answers stripped
session.statusTree;         // → section-level done/reachable tree (for sidebar nav)
```

## Architecture

### File Map

| File | Role |
|---|---|
| `types.ts` | Core type definitions: `PageConfigMap`, `TransitionConfigMap`, `InferredUserData` |
| `compileFlow.ts` | One-time static initialization: schema cache, stepId ↔ key map, array metadata, graph pre-computation |
| `precomputeGraph.ts` | Static BFS over all possible transitions → progress depth per node, `isFinal` detection |
| `routing.ts` | Pure routing helpers: `evaluateRoute`, `extractEdges`, `evaluateAllBranches` |
| `simulate.ts` | Dynamic two-pass simulation: linear path + BFS reachable set + parent map + status tree |
| `createFlowSession.ts` | Public API: combines static flow + simulation result into the per-request session object |

### Static vs Dynamic

The engine has a hard split between what happens **once** (at module load / app startup) and **per request**.

**Static (`compileFlow`)** — runs once:
- Normalizes all `stepId` values to have a leading `/`
- Compiles `pageSchema` (raw shape or `ZodType`) into a single `ZodObject`
- Extracts and caches `fieldNames` per page (used for pruning)
- Extracts array metadata (`name`, `entryPoint`) from `arraySummary` config
- Pre-computes static graph depth → used for progress bars

**Dynamic (`createFlowSession`)** — runs per request:
- Runs the two-pass simulation against the current `userData`
- Resolves `getNextStep` / `getPrevStep` for the current step
- Computes `prunedUserData` by filtering `userData` to only reachable keys
- Builds the `statusTree` for section navigation

### Two-Pass Simulation (`simulate`)

Every session initialization runs two passes over the transition graph with current `userData`:

**Pass 1 — Linear path:** Walks forward from `initialStep`, evaluating guards greedily. Uses an edge tracker to detect and escape cycles (required for array loops). The resulting `path` is the ordered list of nodes in the order the user would traverse them — the last element is the furthest the user has progressed. This drives `isDone` in the status tree.

**Pass 2 — BFS reachable set:** Exhaustive BFS from `initialStep`, evaluating all guards. Builds `reachableSet` (all nodes currently reachable given `userData`) and `parentMap` (for Back navigation). The BFS parent of a node is its canonical "Back" destination — deterministic regardless of browser history.

The two passes serve different purposes: Pass 1 gives chronological order (for "done" status); Pass 2 gives complete reachability (for access control and data pruning).

### Array Traversal

Array pages have an `arraySummary` config and a transition with `type: "addArrayItem"` pointing to the array item entry node. The engine handles arrays in two ways:

- **Within simulation:** With `traverseArrays: true` (used during session evaluation), Pass 1 walks into array item pages using the full `userData` as context. This means guards on array item pages receive the full session data — including `pageData.arrayIndexes` — not a scoped item view.
- **Navigation:** `getNextStep` skips `addArrayItem` transitions, returning the next main-branch step. The route handler uses `arrayIndexes` from the URL to resolve the actual array item URL.
- **Data pruning:** The `reachableSet` includes the array summary node. All field keys belonging to reachable nodes are included in `prunedUserData`; unreachable nodes' keys are stripped.

### Status Tree

`statusTree` is a nested record of `StatusNode` objects, representing **section-level** navigation state (e.g., for a sidebar). It is derived automatically from the URL path segments of `stepId` values:

- A `stepId` of `"grundvoraussetzungen/versicherung"` contributes to a `"grundvoraussetzungen"` section node.
- A `stepId` of `"start"` (flat, single segment) contributes no section node.

**Consequence:** For flows with flat stepIds (no `/` in paths), `statusTree` will be empty. Per-step reachability is always available via `session.isReachable(stepId)` regardless of URL structure.

A section is `isDone` when the simulation's linear path has exited it (the user has moved past all steps in that section). A section `isReachable` if any of its nodes appear in the `reachableSet`.

### Progress

`staticFlow.getProgress(stepId)` returns `{ progress, max }` where `progress` is the static depth of the node in the full transition graph (computed once by `precomputeGraph`). Array item nodes are assigned the same depth as their parent summary node (they don't advance the progress counter). Final nodes always return `{ progress: max, max }`.

## Comparison: New Engine vs. XState

| Feature | New Engine | XState |
|---|---|---|
| **Mental model** | Directed graph + forward simulation | Stateful actors + event transitions |
| **Back navigation** | Deterministic BFS parent map | Requires history states or manual tracking |
| **Nested arrays** | Natively supported via transition type | Extremely complex within rigid state charts |
| **Boilerplate** | Minimal — pages + transitions only | High — setup, guards, context types, actions |
| **Debuggability** | Pure functions, fully traceable | Black box, requires XState devtools |
| **Progress** | Static depth pre-computed once | Requires custom tracking |
| **Data pruning** | Built in via reachable set + field names | Not provided |

## Pending Work

### Bugs / Code Quality

- **Remove `simulation.ts`:** An earlier attempt at implementing pruning that is not wired up and has correctness issues. The pruning is now implemented directly in `createFlowSession` using the static `fieldNamesCache`.
- **Standardize `null` → `undefined`:** Routing helpers (`evaluateRoute`, `getNextStep`) return `null` in some code paths and `undefined` in others. Standardize to `undefined` throughout.

### Features

- **Cross-validation hook:** Add an optional `crossValidate(pageData, userData) => ValidationError | undefined` to `PageConfig`. This separates global state validation (e.g., "sum of fields must not exceed X") from local Zod shape validation, eliminating hidden input workarounds. The hook would be called in the route action after `pageSchema.safeParse` succeeds.
- **Heterogeneous array schemas:** Intermediate array item steps treat in-progress data as `Partial`. Full structural validation runs at the array exit node.

### Future Extensions

- **Data migrations:** A pipeline running before session initialization that transforms stored `userData` payloads (e.g., field renames across deploys). This decouples storage schema evolution from current type definitions.
