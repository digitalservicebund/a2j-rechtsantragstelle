import {
  type ExpectedStep,
  type FlowTestCases,
} from "~/domains/__test__/TestCases";
import { erbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type ErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { MAX_SUPPORTED_DESCENDANT_DEPTH } from "~/domains/nachlass/erbschein/shared/erbfolgeHelpers";
import {
  type Elternteil,
  type Kind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

const happyPathData: ErbscheinAnfrageUserData = {
  ...erbscheinAnfrageHappyPathData,
  testamentArt: "none",
  verstorbeneFamilienstand: "ledig",
};

const geburtsdatum = { day: "01", month: "01", year: "1990" };
const sterbedatum = { day: "01", month: "01", year: "2020" };

const person = { geburtsdatum, geburtsort: "Musterstadt" };

const living = (vorname: string) =>
  ({
    ...person,
    vorname,
    nachname: "Mustermann",
    isAlive: "yes",
    strasse: "Musterstraße",
    hausnummer: "1",
    plz: "12345",
    ort: "Musterstadt",
    land: "Deutschland",
  }) as Elternteil;

const deceased = (
  vorname: string,
  hatteKinder: "yes" | "no",
  kinder?: Elternteil[],
) =>
  ({
    ...person,
    vorname,
    nachname: "Mustermann",
    isAlive: "no",
    sterbedatum,
    sterbeort: "Musterstadt",
    hatteKinder,
    ...(kinder ? { kinder } : {}),
  }) as Elternteil;

const incompleteLivingElternteil = {
  ...person,
  vorname: "Elternteil",
  nachname: "Mustermann",
  isAlive: "yes",
  strasse: "",
  hausnummer: "1",
  plz: "12345",
  ort: "Musterstadt",
  land: "Deutschland",
} as Elternteil;

// The 2nd order is only reached once the 1st order is extinct.
const extinctKinder = {
  hatteKinder: "yes",
  kinder: [
    {
      ...person,
      vorname: "Kind",
      nachname: "Mustermann",
      isAlive: "no",
      sterbedatum,
      sterbeort: "Musterstadt",
      hatteKinder: "no",
    } as Kind,
  ],
} satisfies Pick<ErbscheinAnfrageUserData, "hatteKinder" | "kinder">;

const elternteilKindDepths = [1, 2, 3, 4, 5] as const;

const elternteilKindPath = (depth: number, page: string) =>
  `/angehoerige/elternteile/#${"/kinder/#".repeat(depth)}/${page}`;

const elternteilKindPrefix = (depth: number) =>
  `elternteile#${"kinder#".repeat(depth)}`;

const elternteilKindTree = (depth: number, leaf: Elternteil) => {
  let node = leaf;
  for (let level = depth; level > 1; level--) {
    node = deceased(`Vorfahre ${level}`, "yes", [node]);
  }

  return {
    ...happyPathData,
    ...extinctKinder,
    elternteile: [deceased("Elternteil", "yes", [node])],
  };
};

const elternteilKindNameInput = (depth: number, leaf: Elternteil) => {
  const prefix = elternteilKindPrefix(depth);
  return {
    ...elternteilKindTree(depth, leaf),
    [`${prefix}vorname`]: leaf.vorname,
    [`${prefix}nachname`]: leaf.nachname,
    [`${prefix}${depth === 1 ? "parentElternteilIndex" : "parentKindIndex"}`]:
      "0",
  };
};

const elternteilKindPageData = (depth: number) => ({
  arrayIndexes: Array.from({ length: depth + 1 }, () => 0),
});

const livingElternteilKindSteps = (
  depth: number,
): Array<ExpectedStep<ErbscheinAnfrageUserData>> => {
  const leaf = living(`Nachkomme ${depth}`);
  const prefix = elternteilKindPrefix(depth);
  const pageData = elternteilKindPageData(depth);

  return [
    {
      stepId: elternteilKindPath(depth, "name"),
      userInput: elternteilKindNameInput(depth, leaf),
      pageData,
    },
    {
      stepId: elternteilKindPath(depth, "geburtsdatum"),
      userInput: {
        [`${prefix}geburtsdatum`]: geburtsdatum,
        [`${prefix}geburtsort`]: "Musterstadt",
      },
      pageData,
    },
    {
      stepId: elternteilKindPath(depth, "lebend"),
      userInput: {
        ...elternteilKindTree(depth, leaf),
        [`${prefix}isAlive`]: "yes",
      },
      pageData,
    },
    {
      stepId: elternteilKindPath(depth, "adresse"),
      userInput: {
        [`${prefix}strasse`]: "Musterstraße",
        [`${prefix}hausnummer`]: "1",
        [`${prefix}plz`]: "12345",
        [`${prefix}ort`]: "Musterstadt",
        [`${prefix}land`]: "Deutschland",
      },
      pageData,
    },
    {
      stepId: "/angehoerige/elternteile/uebersicht",
    },
  ];
};

const deceasedElternteilKindSteps = (
  depth: number,
): Array<ExpectedStep<ErbscheinAnfrageUserData>> => {
  const leaf = deceased(`Nachkomme ${depth}`, "no");
  const prefix = elternteilKindPrefix(depth);
  const pageData = elternteilKindPageData(depth);

  return [
    {
      stepId: elternteilKindPath(depth, "name"),
      userInput: elternteilKindNameInput(depth, leaf),
      pageData,
    },
    {
      stepId: elternteilKindPath(depth, "geburtsdatum"),
      userInput: {
        [`${prefix}geburtsdatum`]: geburtsdatum,
        [`${prefix}geburtsort`]: "Musterstadt",
      },
      pageData,
    },
    {
      stepId: elternteilKindPath(depth, "lebend"),
      userInput: {
        ...elternteilKindTree(depth, leaf),
        [`${prefix}isAlive`]: "no",
      },
      pageData,
    },
    {
      stepId: elternteilKindPath(depth, "sterbedatum"),
      userInput: {
        [`${prefix}sterbedatum`]: sterbedatum,
        [`${prefix}geburtsdatum`]: geburtsdatum,
        [`${prefix}sterbeort`]: "Musterstadt",
      },
      pageData,
    },
    {
      stepId: elternteilKindPath(depth, "hatte-kinder"),
      userInput: { [`${prefix}hatteKinder`]: "no" },
      pageData,
    },
    {
      stepId: "/angehoerige/elternteile/uebersicht",
    },
  ];
};

const elternteilKindTestCases = Object.fromEntries(
  elternteilKindDepths.flatMap((depth) => [
    [`livingElternteilKindAtDepth${depth}`, livingElternteilKindSteps(depth)],
    [
      `deceasedElternteilKindAtDepth${depth}`,
      deceasedElternteilKindSteps(depth),
    ],
  ]),
) as FlowTestCases<ErbscheinAnfrageUserData>;

if (elternteilKindDepths.at(-1) !== MAX_SUPPORTED_DESCENDANT_DEPTH) {
  throw new Error(
    "Nested elternteil-kind test depths must match the supported depth.",
  );
}

export const elternteilTestCases = {
  // A living Elternteil inherits, so the flow leaves the Angehoerige section.
  lebendesElternteil: [
    {
      stepId: "/angehoerige/elternteile/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        ...extinctKinder,
        elternteile: [living("Elternteil")],
      },
    },
    {
      stepId: "/nachlass/grundbesitz/grundbesitz-frage",
    },
  ],
  // No 1st- and no 2nd-order heirs: the flow falls back to the Angehoerige overview.
  keineErbenErsterOderZweiterOrdnung: [
    {
      stepId: "/angehoerige/elternteile/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        ...extinctKinder,
        elternteile: [deceased("Elternteil", "no")],
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  elternteilKinderFehlen: [
    {
      stepId: "/angehoerige/elternteile/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        ...extinctKinder,
        elternteile: [deceased("Elternteil", "yes")],
      },
    },
    {
      stepId: "/angehoerige/kinder-fehlen",
    },
  ],
  elternteileFehlen: [
    {
      stepId: "/angehoerige/elternteile/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        ...extinctKinder,
        elternteile: [incompleteLivingElternteil],
      },
    },
    {
      stepId: "/angehoerige/elternteile-fehlen",
    },
  ],
  lebendesElternteilErfassen: [
    {
      stepId: "/angehoerige/elternteile/uebersicht",
      addArrayItemEvent: "add-elternteile",
    },
    {
      stepId: "/angehoerige/elternteile/#/name",
      userInput: {
        ...happyPathData,
        ...extinctKinder,
        "elternteile#vorname": "Max",
        "elternteile#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/geburtsdatum",
      userInput: {
        "elternteile#geburtsdatum": geburtsdatum,
        "elternteile#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/lebend",
      userInput: {
        "elternteile#isAlive": "yes",
        elternteile: [living("Max")],
      },
      pageData: { arrayIndexes: [0] },
    },
    {
      stepId: "/angehoerige/elternteile/#/adresse",
      userInput: {
        "elternteile#strasse": "Musterstraße",
        "elternteile#hausnummer": "1",
        "elternteile#plz": "12345",
        "elternteile#ort": "Musterstadt",
        "elternteile#land": "Deutschland",
      },
    },
    {
      stepId: "/angehoerige/elternteile/uebersicht",
    },
  ],
  verstorbenesElternteilOhneKinder: [
    {
      stepId: "/angehoerige/elternteile/uebersicht",
      addArrayItemEvent: "add-elternteile",
    },
    {
      stepId: "/angehoerige/elternteile/#/name",
      userInput: {
        ...happyPathData,
        ...extinctKinder,
        "elternteile#vorname": "Max",
        "elternteile#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/geburtsdatum",
      userInput: {
        "elternteile#geburtsdatum": geburtsdatum,
        "elternteile#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/lebend",
      userInput: {
        "elternteile#isAlive": "no",
        elternteile: [deceased("Max", "no")],
      },
      pageData: { arrayIndexes: [0] },
    },
    {
      stepId: "/angehoerige/elternteile/#/sterbedatum",
      userInput: {
        "elternteile#sterbedatum": sterbedatum,
        "elternteile#geburtsdatum": geburtsdatum,
        "elternteile#sterbeort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/hatte-kinder",
      userInput: { "elternteile#hatteKinder": "no" },
    },
    {
      stepId: "/angehoerige/elternteile/uebersicht",
    },
  ],
  // Answering hatteKinder=yes returns to the summary; the sibling itself is
  // added from there via the array "add" affordance, not by linear navigation.
  verstorbenesElternteilMitKindern: [
    {
      stepId: "/angehoerige/elternteile/uebersicht",
      addArrayItemEvent: "add-elternteile",
    },
    {
      stepId: "/angehoerige/elternteile/#/name",
      userInput: {
        ...happyPathData,
        ...extinctKinder,
        "elternteile#vorname": "Max",
        "elternteile#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/geburtsdatum",
      userInput: {
        "elternteile#geburtsdatum": geburtsdatum,
        "elternteile#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/lebend",
      userInput: {
        "elternteile#isAlive": "no",
        elternteile: [deceased("Max", "yes", [living("Geschwister")])],
      },
      pageData: { arrayIndexes: [0] },
    },
    {
      stepId: "/angehoerige/elternteile/#/sterbedatum",
      userInput: {
        "elternteile#sterbedatum": sterbedatum,
        "elternteile#geburtsdatum": geburtsdatum,
        "elternteile#sterbeort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/hatte-kinder",
      userInput: { "elternteile#hatteKinder": "yes" },
    },
    {
      stepId: "/angehoerige/elternteile/uebersicht",
    },
  ],
  elternteilKind: [
    {
      stepId: "/angehoerige/elternteile/#/kinder/#/name",
      userInput: {
        ...happyPathData,
        ...extinctKinder,
        elternteile: [deceased("Elternteil", "yes", [living("Kind")])],
        "elternteile#kinder#vorname": "Kind",
        "elternteile#kinder#nachname": "Mustermann",
      },
      pageData: { arrayIndexes: [0, 0] },
    },
    {
      stepId: "/angehoerige/elternteile/#/kinder/#/geburtsdatum",
      userInput: {
        "elternteile#kinder#geburtsdatum": geburtsdatum,
        "elternteile#kinder#geburtsort": "Musterstadt",
      },
      pageData: { arrayIndexes: [0, 0] },
    },
    {
      stepId: "/angehoerige/elternteile/#/kinder/#/lebend",
      userInput: {
        "elternteile#kinder#isAlive": "no",
        elternteile: [deceased("Elternteil", "yes", [deceased("Kind", "no")])],
      },
      pageData: { arrayIndexes: [0, 0] },
    },
    {
      stepId: "/angehoerige/elternteile/#/kinder/#/sterbedatum",
      userInput: {
        "elternteile#kinder#sterbedatum": sterbedatum,
        "elternteile#kinder#geburtsdatum": geburtsdatum,
        "elternteile#kinder#sterbeort": "Musterstadt",
      },
      pageData: { arrayIndexes: [0, 0] },
    },
    {
      stepId: "/angehoerige/elternteile/#/kinder/#/hatte-kinder",
      userInput: {
        "elternteile#kinder#hatteKinder": "no",
      },
      pageData: { arrayIndexes: [0, 0] },
    },
    {
      stepId: "/angehoerige/elternteile/uebersicht",
    },
  ],
  ...elternteilKindTestCases,
} satisfies FlowTestCases<ErbscheinAnfrageUserData>;
