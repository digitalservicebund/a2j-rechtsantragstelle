import {
  type ExpectedStep,
  type FlowTestCases,
} from "~/domains/__test__/TestCases";
import { erbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type ErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { MAX_SUPPORTED_DESCENDANT_DEPTH } from "~/domains/nachlass/erbschein/shared/erbfolgeHelpers";
import { type Kind } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

const happyPathData: ErbscheinAnfrageUserData = {
  ...erbscheinAnfrageHappyPathData,
  testamentArt: "none",
  verstorbeneFamilienstand: "ledig",
};

const geburtsdatum = { day: "01", month: "01", year: "1990" };
const sterbedatum = { day: "01", month: "01", year: "2020" };

const livingKind = (vorname: string): Kind =>
  ({
    vorname,
    nachname: "Mustermann",
    geburtsdatum,
    geburtsort: "Musterstadt",
    isAlive: "yes",
    strasse: "Musterstraße",
    hausnummer: "1",
    plz: "12345",
    ort: "Musterstadt",
    land: "Deutschland",
  }) as Kind;

const deceasedKind = (
  vorname: string,
  hatteKinder: "yes" | "no",
  kinder?: Kind[],
): Kind =>
  ({
    vorname,
    nachname: "Mustermann",
    geburtsdatum,
    geburtsort: "Musterstadt",
    isAlive: "no",
    sterbedatum,
    sterbeort: "Musterstadt",
    hatteKinder,
    ...(kinder ? { kinder } : {}),
  }) as Kind;

const nestedKindDepths = [2, 3, 4, 5] as const;

const nestedKindPath = (depth: number, page: string) =>
  `/angehoerige${"/kinder/#".repeat(depth)}/${page}`;

const nestedKindPrefix = (depth: number) => "kinder#".repeat(depth);

const nestedKindTree = (depth: number, leaf: Kind) => {
  let node = leaf;
  for (let level = depth; level > 1; level--) {
    node = deceasedKind(`Vorfahre ${level}`, "yes", [node]);
  }

  return {
    ...happyPathData,
    hatteKinder: "yes" as const,
    kinder: [node],
  };
};

const nestedKindNameInput = (depth: number, leaf: Kind) => {
  const prefix = nestedKindPrefix(depth);
  return {
    ...nestedKindTree(depth, leaf),
    [`${prefix}vorname`]: leaf.vorname,
    [`${prefix}nachname`]: leaf.nachname,
    [`${prefix}parentKindIndex`]: "0",
  };
};

const nestedKindPageData = (depth: number) => ({
  arrayIndexes: Array.from({ length: depth }, () => 0),
});

const nestedLivingKindSteps = (
  depth: number,
): Array<ExpectedStep<ErbscheinAnfrageUserData>> => {
  const leaf = livingKind(`Nachkomme ${depth}`);
  const prefix = nestedKindPrefix(depth);
  const pageData = nestedKindPageData(depth);

  return [
    {
      stepId: nestedKindPath(depth, "name"),
      userInput: nestedKindNameInput(depth, leaf),
      pageData,
    },
    {
      stepId: nestedKindPath(depth, "geburtsdatum"),
      userInput: {
        [`${prefix}geburtsdatum`]: geburtsdatum,
        [`${prefix}geburtsort`]: "Musterstadt",
      },
      pageData,
    },
    {
      stepId: nestedKindPath(depth, "lebend"),
      userInput: {
        ...nestedKindTree(depth, leaf),
        [`${prefix}isAlive`]: "yes",
      },
      pageData,
    },
    {
      stepId: nestedKindPath(depth, "adresse"),
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
      stepId: "/angehoerige/kinder/uebersicht",
    },
  ];
};

const nestedDeceasedKindSteps = (
  depth: number,
): Array<ExpectedStep<ErbscheinAnfrageUserData>> => {
  const leaf = deceasedKind(`Nachkomme ${depth}`, "no");
  const prefix = nestedKindPrefix(depth);
  const pageData = nestedKindPageData(depth);

  return [
    {
      stepId: nestedKindPath(depth, "name"),
      userInput: nestedKindNameInput(depth, leaf),
      pageData,
    },
    {
      stepId: nestedKindPath(depth, "geburtsdatum"),
      userInput: {
        [`${prefix}geburtsdatum`]: geburtsdatum,
        [`${prefix}geburtsort`]: "Musterstadt",
      },
      pageData,
    },
    {
      stepId: nestedKindPath(depth, "lebend"),
      userInput: {
        ...nestedKindTree(depth, leaf),
        [`${prefix}isAlive`]: "no",
      },
      pageData,
    },
    {
      stepId: nestedKindPath(depth, "sterbedatum"),
      userInput: {
        [`${prefix}sterbedatum`]: sterbedatum,
        [`${prefix}geburtsdatum`]: geburtsdatum,
        [`${prefix}sterbeort`]: "Musterstadt",
      },
      pageData,
    },
    {
      stepId: nestedKindPath(depth, "hatte-kinder"),
      userInput: { [`${prefix}hatteKinder`]: "no" },
      pageData,
    },
    {
      stepId: "/angehoerige/kinder/uebersicht",
    },
  ];
};

const nestedKindTestCases = Object.fromEntries(
  nestedKindDepths.flatMap((depth) => [
    [`livingKindAtDepth${depth}`, nestedLivingKindSteps(depth)],
    [`deceasedKindAtDepth${depth}`, nestedDeceasedKindSteps(depth)],
  ]),
) as FlowTestCases<ErbscheinAnfrageUserData>;

if (nestedKindDepths.at(-1) !== MAX_SUPPORTED_DESCENDANT_DEPTH) {
  throw new Error("Nested kinder test depths must match the supported depth.");
}

export const kinderTestCases = {
  keineKinder: [
    {
      stepId: "/angehoerige/hatte-kinder",
      userInput: { ...happyPathData, hatteKinder: "no" },
    },
    {
      stepId: "/angehoerige/elternteile/uebersicht",
    },
  ],
  hatteKinderLeadsToSummary: [
    {
      stepId: "/angehoerige/hatte-kinder",
      userInput: { ...happyPathData, hatteKinder: "yes" },
    },
    {
      stepId: "/angehoerige/kinder/uebersicht",
    },
  ],
  // hatteKinder=yes but nobody was ever added: the deceased itself is the
  // person whose children are missing.
  kinderFehlenWhenNoneAdded: [
    {
      stepId: "/angehoerige/kinder/uebersicht",
      skipPageSchemaValidation: true,
      userInput: { ...happyPathData, hatteKinder: "yes", kinder: [] },
    },
    {
      stepId: "/angehoerige/kinder-fehlen",
    },
  ],
  kinderFehlenWhenDescendantsMissing: [
    {
      stepId: "/angehoerige/kinder/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...happyPathData,
        hatteKinder: "yes",
        kinder: [deceasedKind("Kind", "yes")],
      },
    },
    {
      stepId: "/angehoerige/kinder-fehlen",
    },
  ],
  livingKind: [
    {
      stepId: "/angehoerige/kinder/uebersicht",
      addArrayItemEvent: "add-kinder",
    },
    {
      stepId: "/angehoerige/kinder/#/name",
      userInput: {
        ...happyPathData,
        hatteKinder: "yes",
        "kinder#vorname": "Max",
        "kinder#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/kinder/#/geburtsdatum",
      userInput: {
        "kinder#geburtsdatum": geburtsdatum,
        "kinder#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/kinder/#/lebend",
      userInput: {
        "kinder#isAlive": "yes",
        kinder: [livingKind("Max")],
      },
      pageData: { arrayIndexes: [0] },
    },
    {
      stepId: "/angehoerige/kinder/#/adresse",
      userInput: {
        "kinder#strasse": "Musterstraße",
        "kinder#hausnummer": "1",
        "kinder#plz": "12345",
        "kinder#ort": "Musterstadt",
        "kinder#land": "Deutschland",
      },
    },
    {
      stepId: "/angehoerige/kinder/uebersicht",
    },
  ],
  deceasedKindWithoutChildren: [
    {
      stepId: "/angehoerige/kinder/uebersicht",
      addArrayItemEvent: "add-kinder",
    },
    {
      stepId: "/angehoerige/kinder/#/name",
      userInput: {
        ...happyPathData,
        hatteKinder: "yes",
        "kinder#vorname": "Max",
        "kinder#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/kinder/#/geburtsdatum",
      userInput: {
        "kinder#geburtsdatum": geburtsdatum,
        "kinder#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/kinder/#/lebend",
      userInput: {
        "kinder#isAlive": "no",
        kinder: [deceasedKind("Max", "no")],
      },
      pageData: { arrayIndexes: [0] },
    },
    {
      stepId: "/angehoerige/kinder/#/sterbedatum",
      userInput: {
        "kinder#sterbedatum": sterbedatum,
        "kinder#geburtsdatum": geburtsdatum,
        "kinder#sterbeort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/kinder/#/hatte-kinder",
      userInput: { "kinder#hatteKinder": "no" },
    },
    {
      stepId: "/angehoerige/kinder/uebersicht",
    },
  ],
  // Answering hatteKinder=yes returns to the summary; the descendant itself is
  // added from there via the array "add" affordance, not by linear navigation.
  deceasedKindWithChildren: [
    {
      stepId: "/angehoerige/kinder/uebersicht",
      addArrayItemEvent: "add-kinder",
    },
    {
      stepId: "/angehoerige/kinder/#/name",
      userInput: {
        ...happyPathData,
        hatteKinder: "yes",
        "kinder#vorname": "Max",
        "kinder#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/kinder/#/geburtsdatum",
      userInput: {
        "kinder#geburtsdatum": geburtsdatum,
        "kinder#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/kinder/#/lebend",
      userInput: {
        "kinder#isAlive": "no",
        kinder: [deceasedKind("Max", "yes", [livingKind("Enkel")])],
      },
      pageData: { arrayIndexes: [0] },
    },
    {
      stepId: "/angehoerige/kinder/#/sterbedatum",
      userInput: {
        "kinder#sterbedatum": sterbedatum,
        "kinder#geburtsdatum": geburtsdatum,
        "kinder#sterbeort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/kinder/#/hatte-kinder",
      userInput: { "kinder#hatteKinder": "yes" },
    },
    {
      stepId: "/angehoerige/kinder/uebersicht",
    },
  ],
  ...nestedKindTestCases,
} satisfies FlowTestCases<ErbscheinAnfrageUserData>;
