# Arrays in a flow

An array lets the user add any number of items of the same kind (children, incomes, Hauptanträge, ...). On the flow engine ([ADR 0034](./adr/0034-new-flow-engine.md)), an array is just a few pages plus one special transition. No separate array config or add-event guard is needed.

If you are new to flows, read [adding-a-new-service.md](./adding-a-new-service.md) first.

## The standard pattern

Most arrays have four pages:

| Page         | Example `stepId`            | Purpose                                                                                      |
| ------------ | --------------------------- | -------------------------------------------------------------------------------------------- |
| `frage`      | `/unterhalt/frage`          | Yes/no question: does the user have any items at all?                                        |
| `uebersicht` | `/unterhalt/uebersicht`     | Array summary: lists all items with edit/delete, plus an "add" button                        |
| `warnung`    | `/unterhalt/warnung`        | Shown when the user answered "yes" but continued with no items                               |
| item pages   | `/unterhalt/person/#/daten` | One or more pages per item. `#` is replaced by the item index in the URL (`/person/0/daten`) |

### Pages (`pages.ts`)

Define the item schema once and reuse its fields in both the summary and the item pages:

```ts
import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const unterhaltszahlungenArraySchema = z
  .object({
    firstName: stringRequiredSchema,
    monthlyPayment: buildMoneyValidationSchema(),
  })
  .array()
  .min(1);

const itemFields = unterhaltszahlungenArraySchema.element.shape;

export const myPages = {
  unterhaltFrage: {
    stepId: "/unterhalt/frage",
    pageSchema: { hasUnterhaltszahlungen: YesNoAnswer },
  },
  unterhaltUebersicht: {
    stepId: "/unterhalt/uebersicht",
    arraySummary: {
      name: "unterhaltszahlungen",
      schema: unterhaltszahlungenArraySchema,
      isArrayRelevant: (context) => context.hasUnterhaltszahlungen === "yes",
    },
  },
  unterhaltWarnung: {
    stepId: "/unterhalt/warnung",
  },
  unterhaltPerson: {
    stepId: "/unterhalt/person/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "unterhaltszahlungen#firstName": itemFields.firstName,
      "unterhaltszahlungen#monthlyPayment": itemFields.monthlyPayment,
    },
  },
} as const satisfies PagesConfig;
```

- **`arraySummary.name`** is the key under which the array is stored in user data (`userData.unterhaltszahlungen = [{ firstName, monthlyPayment }, ...]`). The inferred user data type picks up this key and the item type from `arraySummary.schema`.
- **Item fields are named `<arrayName>#<field>`.** The engine resolves `#` with the current item index, so `unterhaltszahlungen#firstName` on `/person/2/daten` reads and writes `unterhaltszahlungen[2].firstName`.
- **`#` in `stepId`** marks where the index goes in the URL. The segment before `#` (here `person`) is only a URL segment. It does not have to match the array name.
- **`shouldCollapseIntoParentNavItem: true`** on item pages keeps them out of the side navigation.

### Transitions (`flowConfig.ts`)

```ts
unterhaltFrage: [
  {
    guard: (context) => context.hasUnterhaltszahlungen === "yes",
    target: "unterhaltUebersicht",
  },
  { target: "naechsterAbschnitt" },
],
unterhaltUebersicht: [
  { type: "addArrayItem", target: "unterhaltPerson" },
  {
    guard: (context) =>
      context.hasUnterhaltszahlungen === "yes" &&
      !arrayIsNonEmpty(context.unterhaltszahlungen),
    target: "unterhaltWarnung",
  },
  { target: "naechsterAbschnitt" },
],
unterhaltWarnung: "naechsterAbschnitt",
unterhaltPerson: "unterhaltUebersicht",
```

- The branch with **`type: "addArrayItem"`** connects the summary to the first item page. The "add" button and each item's edit link go there. When the user submits the summary page ("weiter"), this branch is skipped and the remaining branches decide where to go next.
- The **last item page goes back to the summary**. If an item has several pages, chain them (`kindName → kindWohnort → ... → kinderUebersicht`). Guards on item pages see the full user data, with the current item index in `context.pageData.arrayIndexes`.
- **No back transitions are needed.** Back from an item page goes to the previous item page or the summary. Back from the summary goes to the page before the array (e.g. `frage`), never into an item.

### `arraySummary` options

| Option                   | Purpose                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `name` (required)        | User data key of the array. Must match the `<name>#` prefix of the item fields                                                       |
| `schema` (required)      | `z.array(...)` of the item. Used for the user data type and to validate the whole array when the section is checked for completeness |
| `isArrayRelevant`        | `(userData) => boolean`. When `false`, the array is not required for the section to be done (e.g. the user answered "no")            |
| `shouldDisableAddButton` | `(userData) => boolean`. Disable the "add" button, e.g. when a maximum is reached                                                    |
| `indexOffset`            | Shift the item number shown to users (e.g. start counting at 2 when item 1 is the applicant)                                         |
| `hiddenFields`           | Item fields that are not shown on the summary card                                                                                   |

## Nested arrays

An array item can contain its own array. Add one `#` per level in both the `stepId` and the field names, and use the full `#` path as the inner array's name:

```ts
antraegeUebersicht: {
  stepId: "/tatsachenvortrag/uebersicht",
  arraySummary: { name: "hauptantrag", schema: hauptantragArraySchema },
},
absaetzeUebersicht: {
  stepId: "/tatsachenvortrag/hauptantrag/#/absaetze",
  shouldCollapseIntoParentNavItem: true,
  arraySummary: { name: "hauptantrag#absaetze", schema: absaetzeArraySchema },
},
absatzDaten: {
  stepId: "/tatsachenvortrag/hauptantrag/#/absaetze/#/daten",
  shouldCollapseIntoParentNavItem: true,
  pageSchema: {
    "hauptantrag#absaetze#formulierung": stringRequiredSchema,
  },
},
```

`/tatsachenvortrag/hauptantrag/1/absaetze/0/daten` then writes `hauptantrag[1].absaetze[0].formulierung`. The transitions follow the same pattern as above: the inner summary has an `addArrayItem` branch to `absatzDaten`, and `absatzDaten` goes back to `absaetzeUebersicht`. For full examples, see `app/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/` and the Erbschein Erbfolge flow (`app/domains/nachlass/erbschein/erbfolge/`).

## Content (Strapi)

- The summary page needs a `page.array-summary` component whose category matches `arraySummary.name`.
- Item pages are created with the `stepId` including `#` (e.g. `/unterhalt/person/#/daten`), and their form field names include the prefix (`unterhaltszahlungen#firstName`).

## Testing

In `testcasesWithUserInputs.ts`, set `addArrayItemEvent: "add-<arrayName>"` on the summary step to follow the "add" branch. Then use a concrete index in the item `stepId` and the `#` field names in `userInput`:

```ts
{ stepId: "/unterhalt/uebersicht", addArrayItemEvent: "add-unterhaltszahlungen" },
{
  stepId: "/unterhalt/person/0/daten",
  userInput: {
    "unterhaltszahlungen#firstName": "Erika",
    "unterhaltszahlungen#monthlyPayment": "100",
  },
},
{ stepId: "/unterhalt/uebersicht" },
```

## Things to watch out for

- Always add the `addArrayItem` branch to the summary page. Without it, the summary has no "add" target and the engine cannot reach the item pages.
- Don't create a separate `ArrayConfigServer` or `meta.arrays` entry; those belonged to the old XState setup. The summary's config is derived from `arraySummary` and the `addArrayItem` target.
