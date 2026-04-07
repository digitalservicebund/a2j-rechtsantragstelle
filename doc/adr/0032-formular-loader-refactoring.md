# ADR: Refactor the Formular Loader

## Status

- 2026-04-07: Drafted

## Context

A detailed sequence diagram was produced to map out what the formular loader actually does on a single GET request. The exercise surfaced several deficiencies that make the handler hard to understand, test, and safely change:

### Identified Problems

#### 1. URL / Pathname Parsed Three Times Per Request

`parsePathname` (or its wrapper `getPageAndFlowDataFromPathname`) is called three separate times across the request lifecycle:

1. Inside `getPrunedUserDataFromPathname` (re-parses `pathname` to extract `flowId` and `arrayIndexes`)
2. Inside `getUserDataAndFlow` (calls `getPageAndFlowDataFromPathname`)
3. Inside `retrieveContentData` (calls `getPageAndFlowDataFromPathname` yet again)

The same values — `flowId`, `stepId`, `arrayIndexes`, `currentFlow` — are derived from the URL independently in each of these scopes and then passed back up or re-derived in the caller.

#### 2. Flow Session Read Twice

The same Redis key is read twice in every request via two different code paths:

- `getSessionData(flowId, cookieHeader)` inside `getPrunedUserDataFromPathname` — returns the raw `userData` object.
- `getSessionManager(flowId).getSession(cookieHeader)` inside `getUserDataAndFlow` — returns the session in "session object" form to access `userVisitedValidationPage` and `emailCaptureConsent`.

Both resolves to the same underlying Redis entry.

#### 3. `FlowController` Built Multiple Times

`buildFlowController` is called at least twice, and sometimes three times, per request:

1. Inside `pruneIrrelevantData` — with raw (unpruned) `userData`, to traverse the flow graph for pruning.
2. Inside `getUserDataAndFlow` — with the pruned and page-augmented `userDataWithPageData`.
3. Inside `validateFlowTransition` — a separate instance for the source flow, when a cross-flow transition config is present.

The first instance is then silently discarded; the second is what the loader ultimately uses.

#### 4. `cookieHeader` Extracted in Multiple Places

`request.headers.get("Cookie")` is called at the top level of `getUserDataAndFlow` and again at the top level of the main `loader` function, producing the same string twice with no sharing between them.

#### 5. `request` Passed Through Multiple Layers

The full `Request` object is threaded through `getUserDataAndFlow` → `validateStepIdFlow` purely to extract `searchParams` and `cookieHeader` in those inner functions. This couples internal business-logic modules to the HTTP layer and makes them harder to test in isolation.

#### 6. Migration Object Conflates Runtime Data and Static Config

The `migration` object returned by `getUserDataAndFlow` and passed to the loader response bundles two fundamentally different concerns:

- `migration.userData` — runtime data loaded from the source flow's Redis session
- `migration.sortedFields` / `migration.buttonUrl` — static display configuration from the flow definition

These have different lifetimes and ownership. Mixing them in one object obscures their origin and makes each harder to reason about independently.

#### 7. Parallel Session Writes with Lost Headers

In `Promise.all`, `updateMainSession` and `setUserVisitedValidationPage` both write to Redis and return HTTP headers carrying `Set-Cookie`. Only the headers from `updateMainSession` are threaded through to the response; the cookie from `setUserVisitedValidationPage` is silently discarded. Depending on Redis implementation details, the two writes could race and one could overwrite the other.

#### 8. Feature Flag Guard Buried in a Data-Loading Function

`throw404IfFeatureFlagDisabled` is called inside `getUserDataAndFlow`, a function whose stated purpose is to assemble user data and flow state. Access control / feature gating is a distinct concern that belongs at the loader boundary, not inside a service module.

#### 9. `getUserDataAndFlow` Is a God Function

The function currently:

- Parses the URL
- Checks feature flags
- Loads and prunes user data
- Loads migration data
- Loads the flow session
- Builds the FlowController
- Validates the current step's reachability
- Validates cross-flow eligibility

This breadth makes it large (117 lines of logic), hard to test individual phases, and difficult to onboard new contributors to.

---

## Decision

Refactor the formular loader and its supporting modules to establish clean phases with clear ownership, without changing any observable behaviour.

### Scope

The primary focus is the loader. The action shares some of the same structural issues — `getPageAndFlowDataFromPathname` is called again independently, `buildFlowController` is reinstantiated purely to compute `stepStates()`, and `request` is passed into `postValidationFlowAction`. It is simpler and easier to follow than the loader, but it will be aligned to the same principles as part of this work rather than in a separate pass.

### Goals

- Each piece of work happens exactly once per request (parse, session read, FlowController build).
- Each module has a single, clearly named responsibility.
- No inner module takes `Request` as an argument; they receive the extracted primitives instead.
- Session writes are sequential or explicitly merged to avoid header conflicts.
- Feature gating lives at the loader boundary only.

### Proposed Structure

The loader should orchestrate the following distinct, sequential phases:

```
1. Parse request
   └─ Extract: pathname, cookieHeader, searchParams
   └─ Derive: flowId, stepId, arrayIndexes, currentFlow (once only)

2. Guard: feature flag check (loader boundary)

3. Load session data (single read per flow)
   └─ userData (raw), userVisitedValidationPage, emailCaptureConsent

4. Prune + augment userData
   └─ pruneIrrelevantData → addPageDataToUserData
   └─ (FlowController built here, reused later)

5. Load migration data (conditional, based on stepId)
   └─ Separate: migrationUserData vs. migrationDisplayConfig

6. Validate step reachability + flow transition (uses FlowController from step 4)

7. Fetch CMS content (receives flowId, stepId, currentFlow — not pathname)

8. Write session updates (sequentially or merged to avoid header conflicts)
   └─ updateMainSession
   └─ setUserVisitedValidationPage

9. Assemble and return loader response
```

### Key Changes

- `getPageAndFlowDataFromPathname` / `parsePathname` is called **once** in the loader; its result is threaded down as explicit arguments.
- `getSessionData` is called **once** for the flow session and returns both data and metadata; the `getSession` / `getSessionData` dual-access pattern is eliminated.
- `buildFlowController` is called **once** on the pruned data; the pruner uses a different internal mechanism or receives the controller as a parameter.
- Inner modules (`validateStepIdFlow`, `retrieveContentData`) accept `flowId`, `stepId`, `currentFlow`, `cookieHeader` — not `Request`.
- `migration.userData` and `migration.displayConfig` are two separate named values or clearly typed fields.
- Session writes are either awaited sequentially or combined into a single `commitSession` call to guarantee header integrity.
- Feature flag gating moves to the top of the loader, before any data is loaded.
- The action is aligned to the same principles: URL parsed once, `buildFlowController` not reinstantiated unnecessarily, `request` not passed into inner modules.

## Migration

We will use the [Strangler Fig](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig) pattern within the loader:

1. Extract each phase into a well-named, independently testable function.
2. Replace one phase at a time, keeping the existing tests green throughout.
3. Add unit tests per phase as each is extracted (the previous lack of isolated tests is itself a symptom of the god-function problem).
4. Once all phases are extracted and clearly owned, the loader is ready for future work.

## Consequences

### Positive

- Significantly reduced cognitive overhead when reading or debugging a request.
- Each phase can be unit-tested in isolation.
- Redundant I/O (Redis reads, URL parsing) is eliminated, giving a small but real performance improvement per request.
- Establishes clean module boundaries that make the codebase easier to extend and maintain going forward.

### Negative / Risks

- Pure internal refactor with no feature changes: risk of subtle regressions is non-zero.
- Short-term velocity reduction while the refactor is in progress.
