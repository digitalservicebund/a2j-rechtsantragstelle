# Adding a new service

Every service (a Vorab-Check or a Formular) is a **flow** that runs on the flow engine in [`app/services/flow/flowEngine/`](../app/services/flow/flowEngine/README.md). The reasons for the engine are recorded in [ADR 0034](./adr/0034-new-flow-engine.md).

The steps below use the Grundbuchauszug Antrag (`app/domains/grundbuchauszug/antrag/`, added in #4427) as a small, complete reference.

## Checklist

| #   | File                                                      | What to do                                                    |
| --- | --------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | `app/domains/<domain>/<flow>/pages.ts`                    | Define pages: `stepId` + Zod `pageSchema`                     |
| 2   | `app/domains/<domain>/<flow>/userData.ts`                 | Infer the user data type from the pages                       |
| 3   | `app/domains/<domain>/<flow>/flowConfig.ts`               | Define transitions with `compileFlow`                         |
| 4   | `app/domains/<domain>/<flow>/index.ts`                    | Export the `Flow` object                                      |
| 5   | `app/domains/flowIds.ts`                                  | Add the flow ID to `flowIds`                                  |
| 6   | `app/domains/flows.server.ts`                             | Register the flow in `flows`                                  |
| 7   | `app/domains/pageSchemas.ts`                              | Register the pages in `pages`                                 |
| 8   | `app/domains/userData.ts`                                 | Add the user data type to `AllUserDataKeys`                   |
| 9   | `app/routes.ts`                                           | Add routes                                                    |
| 10  | `app/services/isFeatureFlagEnabled.server.ts` (optional)  | Add a feature flag to hide the flow until launch              |
| 11  | `app/services/flow/userDataAndFlow/getUserDataAndFlow.ts` | Map the flow ID to its feature flag (only if you added one)   |
| 12  | `app/domains/<domain>/<flow>/__test__/`                   | Add flow test cases and register them in `flowSchema.test.ts` |
| 13  | Strapi                                                    | Create the page content for every `stepId`                    |

## 1. Pages (`pages.ts`)

The pages record is the single source of truth for URLs, validation and the user data type. The record key (`nodeKey`) is the page's internal name, used in transitions. `stepId` is its URL relative to the flow ID and **must start with `/`**.

```ts
import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const myFlowPages = {
  start: {
    stepId: "/start", // no pageSchema: info page without inputs
  },
  antragsgrund: {
    stepId: "/antragsgrund/berechtigtes-interesse",
    pageSchema: {
      legitimateInterest: z.enum(["owner", "otherReasons"]),
    },
  },
  angabenZumRecht: {
    stepId: "/antragsgrund/angaben-zum-recht",
    pageSchema: { registerLaw: stringRequiredSchema },
  },
  zusammenfassung: {
    stepId: "/abgabe/zusammenfassung",
  },
} satisfies PagesConfig;
```

- Use the shared validators in `app/services/validation/` instead of writing new Zod schemas where possible.
- Enum values are in English, even in German-language flows (`"owner"`, not `"eigentuemer"`).
- The first path segment of `stepId` is the **section** (`/antragsgrund/...`). Sections drive the side navigation and `subflowDoneStates` (see [Section done guards](#section-done-guards)).
- Vorab-Check result pages use `stepId`s under `/ergebnis/...`.
- For array pages, see [array-user-data.md](./array-user-data.md).

Optional page properties:

| Property                          | Purpose                                                                                      |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| `arraySummary`                    | Marks the page as an array overview. See [array-user-data.md](./array-user-data.md)          |
| `shouldCollapseIntoParentNavItem` | Keep this page out of the side navigation (typical for array item pages)                     |
| `isRelevantForDone`               | `(userData) => boolean`. When `false`, the page counts as done without validating its fields |
| `controlledFieldConfig`           | Config for fields whose value is controlled by another field                                 |

For a large flow, split pages by section (`<section>/pages.ts`) and spread them into one `pages.ts`, as PKH does.

## 2. User data type (`userData.ts`)

Don't write the type by hand; infer it from the pages:

```ts
import type { InferredUserData } from "~/services/flow/flowEngine/types";
import type { myFlowPages } from "./pages";

export type MyFlowUserData = InferredUserData<typeof myFlowPages>;
```

`InferredUserData` makes every field optional and adds `pageData` (array indexes, `subflowDoneStates`).

## 3. Transitions (`flowConfig.ts`)

```ts
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/flowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { myFlowPages } from "./pages";

export const myFlowConfig = compileFlow({
  pages: myFlowPages,
  initialStep: "start",
  transitions: {
    start: "antragsgrund",
    antragsgrund: [
      {
        guard: (context) => context.legitimateInterest === "owner",
        target: "zusammenfassung",
      },
      {
        guard: (context) => context.legitimateInterest === "otherReasons",
        target: "angabenZumRecht",
      },
    ],
    angabenZumRecht: [
      {
        guard: (context) => objectKeysNonEmpty(context, ["registerLaw"]),
        target: "zusammenfassung",
      },
    ],
    zusammenfassung: null,
  },
}) as CompiledFlow<PageConfigMap>;
```

Rules:

- **Every page needs a transition entry.** The `TransitionConfigMap` type enforces this.
- A transition is one of the following:
  - a `nodeKey` string: always go there
  - `null`: the end of the flow
  - an array of branches: evaluated top to bottom, **the first branch whose `guard` passes wins**. A branch without a `guard` always passes, so use it as the last fallback.
- **Forward transitions only.** There are no `BACK` transitions. The back button is derived from the path the user took.
- **Guard on the data the page collects.** In the example, `angabenZumRecht` only moves on once `registerLaw` is filled. Without that guard, every later page would count as reachable before the user has answered.
- Guards receive the full typed user data (`context`). Put reusable guards in a `guards.ts` next to the flow.
- Pass `pruningStrategy: "cascading"` to `compileFlow` if stale answers can keep pages reachable that should not be. The default `"singlePass"` prunes once; `"cascading"` repeats pruning until the data stops changing (PKH uses this).

For a large flow, define one transitions object per section and type it as `Partial<TransitionConfigMap<typeof myFlowPages>>`, then spread the objects into `compileFlow`. See `app/domains/prozesskostenhilfe/formular/flowConfig.ts`.

### Section done guards

The engine marks a page as done when all its schema fields are valid, and a section (first `stepId` segment) as done when all its reachable pages are done. After every submit, these states are saved in `pageData.subflowDoneStates`, keyed by section. To block a step until a section is complete, guard on that key:

```ts
persoenlicheDatenKontakt: [
  {
    guard: (context) =>
      context.pageData?.subflowDoneStates?.["/persoenliche-daten"] === true,
    target: "abgabeZusammenfassung",
  },
],
```

## 4. Flow object (`index.ts`)

```ts
import type { Flow } from "~/domains/flows.server";
import { myFlowConfig } from "./flowConfig";

export const myFlow = {
  flowType: "formFlow", // or "vorabCheck"
  config: myFlowConfig,
  stringReplacements: () => ({}),
} satisfies Flow<typeof myFlowConfig.pages>;
```

Optional `Flow` properties (see the `Flow` type in `app/domains/flows.server.ts`):

| Property               | Purpose                                                                        |
| ---------------------- | ------------------------------------------------------------------------------ |
| `stringReplacements`   | Values for `{{placeholders}}` in CMS content, computed from user data          |
| `migration`            | Copy answers over from another flow (e.g. Vorab-Check → Formular)              |
| `flowTransitionConfig` | Only allow entry when the user reached certain pages of a source flow          |
| `pdfConfig`            | Generate a PDF download (see [Adding a PDF](#adding-a-new-antrag-or-form-pdf)) |
| `xjustizConfig`        | Generate an XJustiz download                                                   |
| `metaConfiguration`    | Per-section options: exclude from validation, show in the navigation, ...      |
| `posFlowActions`       | Server-side side effects after a page is submitted                             |
| `summaryFieldOverride` | Override question/answer labels in the generated summary                       |
| `useStepper`           | Show the stepper instead of the side navigation                                |

## 5–8. Registries

Add the flow in four central places:

```ts
// app/domains/flowIds.ts
export const flowIds = [/* ... */, "/my-domain/my-flow"] as const;

// app/domains/flows.server.ts
export const flows = { /* ... */, "/my-domain/my-flow": myFlow };

// app/domains/pageSchemas.ts
export const pages = { /* ... */, "/my-domain/my-flow": myFlowPages };

// app/domains/userData.ts
export type AllUserDataKeys = KeysOfUnion</* ... */ | MyFlowUserData>;
```

TypeScript reports an error in `flows.server.ts` and `pageSchemas.ts` until a new flow ID is registered in both.

## 9. Routes (`app/routes.ts`)

Use the shared route helpers from `app/services/routing/flowRoutes.ts`:

```ts
...prefix("my-domain", [
  ...prefix("my-flow", flowRoutes("MDMF")),         // Formular: pages + PDF download
  // ...prefix("my-check", vorabcheckRoutes("MDMC")), // Vorab-Check: pages + /ergebnis/*
]),
```

The argument is a unique, short suffix for the route IDs. Only add a custom route module (like `routes/erbschein.erbfolge.$.tsx`) if the flow really needs its own loader or action.

## 10–11. Feature flag (optional)

To hide the flow in production until launch:

```ts
// app/services/isFeatureFlagEnabled.server.ts
const localFeatureFlags = { /* ... */, showMyFlow: true } as const;

// app/services/flow/userDataAndFlow/getUserDataAndFlow.ts
const flowIdFeatureFlag = { /* ... */, "/my-domain/my-flow": "showMyFlow" };
```

When the flag is off, the loader returns a 404 for the whole flow.

## 12. Tests

Add `__test__/testcasesWithUserInputs.ts`. Each test case is a list of steps the user goes through, with the input they submit on each page:

```ts
import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import { myFlowConfig } from "../flowConfig";
import { type MyFlowUserData } from "../userData";

export const myFlowTestCases = {
  config: myFlowConfig,
  testcases: {
    owner: [
      { stepId: "/start" },
      {
        stepId: "/antragsgrund/berechtigtes-interesse",
        userInput: { legitimateInterest: "owner" },
      },
      { stepId: "/abgabe/zusammenfassung" },
    ],
  },
} satisfies FlowTestConfig<MyFlowUserData>;
```

Register it in `flowSchemaTests` in `app/domains/__test__/flowSchema.test.ts`. For each step, the test:

- validates `userInput` (if given) against that page's `pageSchema`. The input of all previous steps is merged, so later guards see earlier answers.
- checks that `nextPath` is the following step's `stepId` and that `prevPath` is the preceding one.

The last step of a test case is only navigated to, not submitted.

For flow-specific logic (guards, back navigation, array edge cases), write focused unit tests with `createFlowSession(myFlowConfig, userData, "/some/step")` and assert on `nextPath`, `prevPath`, `isReachable(...)` or `prunedUserData`.

## 13. Content (Strapi)

Content is looked up by flow ID and `stepId`. In Strapi, create a page for every `stepId` in your pages config: `form-flow-pages` for Formular pages, `vorab-check-pages` for Vorab-Check questions and `result-pages` for `/ergebnis/...` pages. Link each page to the flow ID and set its `stepId` exactly as it appears in `pages.ts`, including `#` for array item pages (e.g. `/kinder/#/daten`). Form field names in Strapi must match the `pageSchema` keys.

---

## Adding a new "Antrag" or form pdf

1. Create a new folder in `app/services/pdf/`, for example: `prozesskostenhilfe`
2. Store the antrag or form pdf there: `prozesskostenhilfe/Erklaerung_Verhaeltnisse_Prozess_oder_Verfahrenskostenhilfe.pdf`
3. Run `pnpm run build:pdf`

After running the command, a new file named `prozesskostenhilfe.generated.ts` will be generated in the specified directory. You can use this file to fill out the PDF based on the input fields defined within it. Then add a `pdfConfig` to the flow's `index.ts`.
