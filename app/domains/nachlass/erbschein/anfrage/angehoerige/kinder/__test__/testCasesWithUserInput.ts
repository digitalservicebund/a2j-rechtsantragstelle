import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { nachlassErbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { type Kind } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  ...nachlassErbscheinAnfrageHappyPathData,
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
} satisfies FlowTestCases<NachlassErbscheinAnfrageUserData>;
