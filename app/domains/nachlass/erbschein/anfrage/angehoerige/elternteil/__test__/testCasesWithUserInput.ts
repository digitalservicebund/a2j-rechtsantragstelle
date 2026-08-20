import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { nachlassErbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  type BaseElternteil,
  type Kind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  ...nachlassErbscheinAnfrageHappyPathData,
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
  }) as BaseElternteil;

const deceased = (
  vorname: string,
  hatteKinder: "yes" | "no",
  kinder?: BaseElternteil[],
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
  }) as BaseElternteil;

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
} satisfies Pick<NachlassErbscheinAnfrageUserData, "hatteKinder" | "kinder">;

export const elternteilTestCases = {
  // A living Elternteil inherits, so the flow leaves the Angehoerige section.
  lebendesElternteil: [
    {
      stepId: "/angehoerige/elternteile",
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
      stepId: "/angehoerige/elternteile",
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
      stepId: "/angehoerige/elternteile",
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
  lebendesElternteilErfassen: [
    {
      stepId: "/angehoerige/elternteile",
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
      stepId: "/angehoerige/elternteile",
    },
  ],
  verstorbenesElternteilOhneKinder: [
    {
      stepId: "/angehoerige/elternteile",
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
        "elternteile#sterbeort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/hatte-kinder",
      userInput: { "elternteile#hatteKinder": "no" },
    },
    {
      stepId: "/angehoerige/elternteile",
    },
  ],
  // Answering hatteKinder=yes returns to the summary; the sibling itself is
  // added from there via the array "add" affordance, not by linear navigation.
  verstorbenesElternteilMitKindern: [
    {
      stepId: "/angehoerige/elternteile",
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
        "elternteile#sterbeort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/elternteile/#/hatte-kinder",
      userInput: { "elternteile#hatteKinder": "yes" },
    },
    {
      stepId: "/angehoerige/elternteile",
    },
  ],
} satisfies FlowTestCases<NachlassErbscheinAnfrageUserData>;
