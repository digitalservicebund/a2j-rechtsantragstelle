# New Flow Engine

A deterministic, simulation-based engine for multi-page form flows. It separates static configuration (pages, schemas, transitions) from dynamic per-request session evaluation — providing predictable navigation, nested array support, and section-level progress tracking without stateful actors.

## Quick Start

Define your pages and their connections once. The engine handles navigation, validation, and status per request.

```ts
import { compileFlow } from "./compileFlow";
import { createFlowSession } from "./createFlowSession";

// 1. Define pages (done once per flow, at module load)
const myFlow = compileFlow({
  pages: {
    start:   { stepId: "/start" },
    name:    { stepId: "/personal/name",    pageSchema: { name: z.string() } },
    address: { stepId: "/personal/address", pageSchema: { street: z.string() } },
    end:     { stepId: "/end" },
  },
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

// 2. Create a per-request session (pass current path from the URL)
const session = createFlowSession(myFlow, userData, currentPath);

session.nextPath;           // → path of the next step given current userData, or undefined
session.prevPath;           // → path of the previous step (BFS parent), or undefined
session.initialPath;        // → path of the initial step (e.g. "/start")
session.isReachable(path);  // → boolean: is this path reachable given current userData?
session.pageSchema;         // → compiled Zod schema for the current step
session.fieldNames;         // → field names belonging to the current step
session.statusTree;         // → section-level done/reachable tree (for sidebar nav)
session.path;               // → ordered list of steps visited in the linear simulation
session.isComplete;         // → true if the linear simulation reached a terminal node
session.arrayInfo;          // → { name, entryPoint } if the current step is an array summary
session.nodeKey;            // → the internal key for the current step (from the pages record)
session.prunedUserData;     // → userData with only reachable pages' fields kept
```

## Architecture

### File Map

| File | Role |
|---|---|
| `types.ts` | Core type definitions: `PageConfig`, `PageConfigMap`, `NodeKey`, `TransitionConfigMap`, `InferredUserData` |
| `compileFlow.ts` | One-time static initialization: schema cache, `stepId` ↔ `nodeKey` map, array metadata, graph pre-computation |
| `precomputeGraph.ts` | Static BFS over all possible transitions → progress depth per node, `isFinal` detection |
| `routing.ts` | Pure routing helpers: `evaluateRoute`, `extractEdges`, `evaluateAllBranches` |
| `simulate.ts` | Dynamic two-pass simulation: linear path + BFS reachable set + parent map; `buildStatusTree` |
| `createFlowSession.ts` | Public API: combines compiled flow + simulation result into a per-request `FlowSession` object |

### Key Types

```ts
// The record key is the internal node identifier (e.g. "start", "personal-name")
type PageConfig = {
  stepId: string;          // URL path segment, must start with "/"
  pageSchema?: z.ZodTypeAny | z.ZodRawShape;  // optional — steps without input omit this
  arraySummary?: { name: string; schema: z.ZodArray };
};

// NodeKey<C> = Extract<keyof C, string>  — always assignable to string
// InferredUserData<C> — union-intersected type of all page schemas in the flow
// TransitionConfigMap<C> — maps every nodeKey to a transition (string | null | GuardedTransition[])
```

### Static vs Dynamic

The engine has a hard split between what happens **once** (at module load) and **per request**.

**Static (`compileFlow`)** — runs once:
- Validates that all `stepId` values start with `/` (throws at compile time if any are missing)
- Builds a bidirectional `pathMap`: `stepId → nodeKey` and `nodeKey → stepId`
- Compiles `pageSchema` (raw shape or `ZodType`) into a single `ZodObject`
- Extracts and caches `fieldNames` per page
- Extracts array metadata (`name`, `entryPoint`) from `arraySummary` config + transitions
- Pre-computes static graph depth via `precomputeGraph` → used for progress bars
- Exposes `initialPath` as a plain string (no per-request recomputation)

**Dynamic (`createFlowSession`)** — runs per request:
- Runs the two-pass simulation against the current `userData`
- Resolves `nextPath` / `prevPath` for the current step
- Builds the `statusTree` for section navigation

### Two-Pass Simulation (`simulate`)

Every session initialization runs two passes over the transition graph with current `userData`:

**Pass 1 — Linear path:** Walks forward from `initialStep`, evaluating guards greedily. Uses an edge tracker to detect and escape cycles (required for array loops). The resulting `path` is the ordered list of nodes the user would traverse — the last element is the furthest the user has progressed. Drives `isDone` in the status tree.

**Pass 2 — BFS reachable set:** Exhaustive BFS from `initialStep`, evaluating all guards. Builds `reachableSet` (all nodes currently reachable given `userData`) and `parentMap` (for Back navigation). The BFS parent of a node is its canonical "Back" destination — deterministic regardless of browser history.

The two passes serve different purposes: Pass 1 gives chronological order (for "done" status); Pass 2 gives complete reachability (for access control and data pruning).

`simulate` returns a `SimulationResult`:

```ts
type SimulationResult = {
  path: string[];                            // Pass 1: linear walk order
  reachableSet: Set<string>;                 // Pass 2: all reachable nodeKeys
  isComplete: boolean;                       // true if linear walk reached a terminal node
};
// + parentMap: Map<NodeKey<C>, NodeKey<C>>  // internal — consumed by createFlowSession
```

### Status Tree

`statusTree` is a nested record of `StatusNode` objects, representing **section-level** navigation state (e.g. for a sidebar). It is built by `buildStatusTree(pages, simulationResult)` from the URL path segments of each `stepId`:

- `"/grundvoraussetzungen/versicherung"` → contributes to a `"/grundvoraussetzungen"` section
- `"/a/b/c"` → contributes to `"/a"` with a nested `"/b"` child
- `"/start"` (single segment) → produces a flat top-level entry `"/start"`

```ts
type StatusNode = {
  isDone: boolean;       // linear path has exited this section
  isReachable: boolean;  // any node inside is in reachableSet
  children?: Record<string, StatusNode>;
};
```

`buildStatusTree` only needs `Record<string, { stepId: string }>` and a `SimulationResult` — it does not require a fully compiled flow, making it independently testable with plain objects.

### Array Traversal

Array pages have an `arraySummary` config and a transition with `type: "addArrayItem"` pointing to the array item entry node. The engine handles arrays in two ways:

- **Within simulation:** With `traverseArrays: true` (always used during session evaluation), Pass 1 walks into array item pages. Guards on array item pages receive the full session data — including `pageData.arrayIndexes` — not a scoped item view.
- **Navigation:** `nextPath` skips `addArrayItem` transitions, returning the next main-branch step. The route handler uses `arrayIndexes` from the URL to resolve the actual array item URL.

### Progress

`compiledFlow.getProgress(path)` returns `{ progress, max }` where `progress` is the static depth of the node in the full transition graph (computed once by `precomputeGraph`). Array item nodes are assigned the same depth as their parent summary node (they don't advance the progress counter). Final nodes always return `{ progress: max, max }`.

## Comparison: New Engine vs. XState

| Feature | New Engine | XState |
|---|---|---|
| **Mental model** | Directed graph + forward simulation | Stateful actors + event transitions |
| **Back navigation** | Deterministic BFS parent map | Requires history states or manual tracking |
| **Nested arrays** | Natively supported via transition type | Extremely complex within rigid state charts |
| **Boilerplate** | Minimal — pages + transitions only | High — setup, guards, context types, actions |
| **Debuggability** | Pure functions, fully traceable | Black box, requires XState devtools |
| **Progress** | Static depth pre-computed once | Requires custom tracking |
| **Data pruning** | `prunedUserData` on `FlowSession` | Not provided |

## Pending Work

### Bugs / Code Quality

- **Standardize `null` → `undefined`:** `evaluateRoute` returns `null` in some code paths; the rest of the engine uses `undefined`. Standardize to `undefined` throughout.
- **Rename `stepId` → `path` in `PageConfig`:** `stepId` is the old XState engine's terminology. Once all flows have migrated, rename the field to `path` for clarity. A TODO comment marks the location in `types.ts`.

### Features

- **Cross-validation hook:** Add an optional `crossValidate(pageData, userData) => ValidationError | undefined` to `PageConfig`. This separates global state validation (e.g. "sum of fields must not exceed X") from local Zod shape validation, eliminating hidden input workarounds. The hook would be called in the route action after `pageSchema.safeParse` succeeds.
- **Heterogeneous array schemas:** Intermediate array item steps treat in-progress data as `Partial`. Full structural validation runs at the array exit node.

### Future Extensions

- **Data migrations:** A pipeline running before session initialization that transforms stored `userData` payloads (e.g. field renames across deploys). This decouples storage schema evolution from current type definitions.
