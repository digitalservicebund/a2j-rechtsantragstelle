# Adding a new service

Every service (a Vorab-Check or a Formular) is a **flow** that runs on the flow engine in [`app/services/flow/flowEngine/`](../app/services/flow/flowEngine/README.md). The reasons for the engine are recorded in [ADR 0034](./adr/0034-new-flow-engine.md).

The steps below use the Grundbuchauszug Antrag (`app/domains/grundbuchauszug/antrag/`, added in #4427) as a small, complete reference.

## Checklist

| #   | File                                                              | What to do                                                    |
| --- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | `app/domains/<domain>/<flow>/pages.ts`                            | Define pages: `stepId` + Zod `pageSchema`                     |
| 2   | `app/domains/<domain>/<flow>/userData.ts`                         | Infer the user data type from the pages                       |
| 3   | `app/domains/<domain>/<flow>/flowConfig.ts`                       | Define transitions with `compileFlow`                         |
| 4   | `app/domains/<domain>/<flow>/index.ts`                            | Export the `Flow` object                                      |
| 5   | `app/domains/flowIds.ts`                                          | Add the flow ID to `flowIds`                                  |
| 6   | `app/domains/flows.server.ts`                                     | Register the flow in `flows`                                  |
| 7   | `app/domains/pageSchemas.ts`                                      | Register the pages in `pages`                                 |
| 8   | `app/domains/userData.ts`                                         | Add the user data type to `AllUserDataKeys`                   |
| 9   | `app/routes.ts`                                                   | Add routes                                                    |
| 10  | `app/services/isFeatureFlagEnabled.server.ts` (optional)          | Add a feature flag to hide the flow until launch              |
| 11  | `app/services/flow/userDataAndFlow/getUserDataAndFlow.ts`         | Map the flow ID to its feature flag (only if you added one)   |
| 12  | `app/domains/<domain>/<flow>/__test__/`                           | Add flow test cases and register them in `flowSchema.test.ts` |
| 13  | Strapi                                                            | Create the page content for every `stepId`                    |
| 14  | `app/domains/<domain>/<flow>/multiFieldsValidation.ts` (optional) | Validate fields that depend on each other                     |
| 15  | `app/domains/flowLifecycleConfig.ts` (optional)                   | Keep the flow's user data longer than 24 hours                |

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
- Result pages use `stepId`s with an `ergebnis/` segment. In a Vorab-Check they live under `/ergebnis/...`. A Formular can have result pages too, but they need an extra route (see [Result pages in a Formular](#result-pages-in-a-formular)).
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

| Property               | Purpose                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stringReplacements`   | Values for `{{placeholders}}` in CMS content, computed from user data                                                                                   |
| `migration`            | Copy answers over from another flow (e.g. Vorab-Check → Formular)                                                                                       |
| `flowTransitionConfig` | Only allow entry when the user reached certain pages of a source flow                                                                                   |
| `pdfConfig`            | Generate a PDF download (see [Adding a PDF](#adding-a-pdf))                                                                                             |
| `xjustizConfig`        | Generate an XJustiz download                                                                                                                            |
| `metaConfiguration`    | Per-section options: exclude from validation, show in the navigation, ...                                                                               |
| `posFlowActions`       | Server-side side effects after a page is submitted                                                                                                      |
| `summaryFieldOverride` | Override question/answer labels in the generated summary                                                                                                |
| `useStepper`           | Show the top-level sections as steps in a stepper at the top of the page. The side navigation is still shown and lists the sections of the current step |

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

### Result pages in a Formular

`flowRoutes` only serves form pages, so result pages in a Formular need their own route to the shared result loader. Geld einklagen Formular does this for result pages inside a section, e.g. `/gericht-pruefen/forderung/ergebnis/forderung-etwas-anderes`:

```ts
...prefix("formular", [
  route("*", "routes/geld-einklagen.formular.$.tsx", { id: `flowGEF` }),
  route(":path/:path2/ergebnis/*", "routes/shared/result.ts", { id: `resGEF` }),
]),
```

Match the route pattern to where your result `stepId`s sit (here: two path segments before `ergebnis/`). The Strapi page goes into `result-pages`, with `ergebnis/` removed from the `stepId` (see [Content](#13-content-strapi)).

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

Content is looked up by flow ID and `stepId`. In Strapi, create a page for every page in your pages config: `form-flow-pages` for Formular pages, `vorab-check-pages` for Vorab-Check questions and `result-pages` for `/ergebnis/...` pages. Link each page to the flow ID.

The Strapi `stepId` is derived from the engine `stepId`; it is not always identical. The loaders apply two mappings before fetching:

| Page type    | Engine `stepId`                   | Strapi `stepId`               | Rule                   |
| ------------ | --------------------------------- | ----------------------------- | ---------------------- |
| Regular page | `/antragsgrund/angaben-zum-recht` | unchanged                     | none                   |
| Array item   | `/kinder/#/daten`                 | `/kinder/daten`               | every `/#` is removed  |
| Nested array | `/hauptantrag/#/absaetze/#/daten` | `/hauptantrag/absaetze/daten` | every `/#` is removed  |
| Result page  | `/ergebnis/keine-kontopfaendung`  | `/keine-kontopfaendung`       | `ergebnis/` is removed |

Form field names in Strapi must match the `pageSchema` keys exactly, including the `#` prefix for array fields (e.g. `kinder#vorname`).

## 14. Multi-field validation (optional)

A `pageSchema` validates each field on its own. When a rule depends on several fields of the same page (e.g. departure and arrival airport must differ), add a multi-field validation. It receives the page's schema as a `z.object` and returns it with an extra check:

```ts
// app/domains/<domain>/<flow>/services/validation.ts
import type { MultiFieldsValidationBaseSchema } from "~/domains/types";
import { myFlowPages } from "../pages";

const _schema = myFlowPages.flughaefen.pageSchema;

export const validateDifferentAirports = (
  baseSchema: MultiFieldsValidationBaseSchema<typeof _schema>,
) =>
  baseSchema.check((ctx) => {
    if (ctx.value.startAirport !== ctx.value.endAirport) return;
    (["startAirport", "endAirport"] as const).forEach((field) =>
      ctx.issues.push({
        code: "custom",
        message: "sameDepartureAndArrivalAirports",
        path: [field],
        fatal: true,
        input: ctx.value[field],
      }),
    );
  });
```

Map it to the page's `stepId` in `multiFieldsValidation.ts` next to the flow, and register that object by flow ID in `app/domains/multiFieldsFlowValidation.ts`:

```ts
// app/domains/<domain>/<flow>/multiFieldsValidation.ts
export const myFlowMultiFieldsValidation: MultiFieldsStepIdValidation<
  typeof _schema
> = {
  "/flughaefen": validateDifferentAirports,
};
```

The combined schema is used both in the browser and on the server. Each issue is shown on the field in `path`. Its `message` is an error code: add an error with that code to the field in Strapi to give it a text. For a full example, see `app/domains/fluggastrechte/vorabcheck/multiFieldsValidation.ts`.

## 15. Session lifetime (optional)

A flow's user data is kept in the session for 24 hours by default. For a flow where users need more time (e.g. to collect documents), set a longer lifetime in hours in `app/domains/flowLifecycleConfig.ts`:

```ts
export const flowLifecycleOverridesInHours: Partial<Record<FlowId, number>> = {
  "/geld-einklagen/formular": 720, // 30 days
};
```

This config is kept separate from `flows.server.ts` on purpose, to avoid a circular import with the session code. The session cookie's lifetime follows the longest override.

---

## Adding a PDF

A flow offers a PDF download by setting `pdfConfig` in its `index.ts`. `flowRoutes` already includes the `download/pdf` route, which calls `pdfConfig.pdfFunction` with the user data.

```ts
pdfConfig: {
  pdfFunction: async (userData: MyFlowUserData) =>
    await myFlowPdfFromUserdata(userData),
  name: "My_Flow_Antrag", // file name of the download
},
```

There are two ways to build the PDF. Most flows generate it from scratch with pdfkit. Only use a template when the court requires its official form.

### Generating the PDF with pdfkit (default)

Most flows (e.g. Erbschein Anfrage, Erbausschlagung, Geld einklagen, Fluggastrechte, P-Konto) draw the whole document with [pdfkit](https://pdfkit.org/). The shared setup in `app/services/pdf/` takes care of the A4 format, BundesSans fonts, margins, metadata and accessible (tagged PDF/UA) output.

1. Write a builder function of type `PDFDocumentBuilder<MyFlowUserData>`. It receives the pdfkit `doc`, the root `documentStruct` (for accessibility tags) and the user data.
2. Split the document into one function per section and call them from the builder, e.g. `createDeceasedPerson(doc, documentStruct, userData)`. Put them in `app/domains/<domain>/services/pdf/<flow>/sections/`.
3. Wrap the builder with `pdfFromUserData`, which creates the document and returns the PDF as a buffer.

```ts
import {
  type PDFDocumentBuilder,
  pdfFromUserData,
} from "~/services/pdf/pdfFromUserData";
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";
import { createFooter } from "~/services/pdf/footer/createFooter";

const buildMyFlowPDFDocument: PDFDocumentBuilder<MyFlowUserData> = (
  doc,
  documentStruct,
  userData,
) => {
  setPdfMetadata(doc, { title: TITLE, subject: SUBJECT, keywords: KEYWORDS });
  createApplicantSection(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData);
};

export const myFlowPdfFromUserdata = (userData: MyFlowUserData) =>
  pdfFromUserData(userData, buildMyFlowPDFDocument);
```

`app/domains/nachlass/services/pdf/erbschein/erbscheinAnfragePdfFromUserdata.ts` is a complete example. Reuse the shared helpers in `app/services/pdf/` (headings, styles, header, footer, page breaks, `weitereAngabenAnhang`) before writing new ones.

### Filling an official PDF form (template)

Beratungshilfe and Prozesskostenhilfe fill the official court form with [pdf-lib](https://pdf-lib.js.org/) instead:

1. Create a folder in `data/pdf/`, for example `data/pdf/prozesskostenhilfe/`, and store the official PDF there.
2. Register it in `app/services/pdf/pdfs.ts` with its `flowId`, `service`, `pdfFilename` and `typeName`.
3. Run `pnpm run build:pdf`. This generates `data/pdf/<service>/<service>.generated.ts`, which lists every form field of the PDF.
4. Write fill functions that map user data to those fields, and pass them to `pdfFillReducer` and `fillPdf` (see `app/domains/beratungshilfe/services/pdf/index.ts`).

Both flows still use pdfkit for extra pages. Text that is too long for a form field goes into an attachment, and pages such as "Weitere Angaben" (plus a checklist in Beratungshilfe) are generated with `pdfFromUserData` and then appended to the filled form with `appendPagesToPdf`.
