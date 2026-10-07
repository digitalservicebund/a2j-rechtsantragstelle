import { type FlowTestCases } from "~/domains/__test__/TestCases";
import {
  erbscheinAnfrageHappyPathData,
  mockBeguenstigtenArray,
} from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type ErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const namedBeneficiaryHappyPathData: Partial<ErbscheinAnfrageUserData> = {
  ...erbscheinAnfrageHappyPathData,
  testamentArt: "erbvertrag",
  allNamedBeneficiariesKnown: "yes",
  erbeCompletelyAllocated: "yes",
  beguenstigten: mockBeguenstigtenArray,
};

export const testamentOderErbvertragTestCases = {
  noTestamentOrErbvertragSingle: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...erbscheinAnfrageHappyPathData,
        testamentArt: "none",
        verstorbeneFamilienstand: "ledig",
      },
    },
    {
      stepId: "/angehoerige/hatte-kinder",
    },
  ],
  noTestamentOrErbvertragNotSingle: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...erbscheinAnfrageHappyPathData,
        testamentArt: "none",
        verstorbeneFamilienstand: "verheiratet",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
    },
  ],
  testamentUnknownBeneficiaries: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...erbscheinAnfrageHappyPathData,
        testamentArt: "erbvertrag",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/bekannte-beguenstigten",
      userInput: {
        allNamedBeneficiariesKnown: "no",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/unbekannte-beguenstigten",
    },
  ],
  testamentNoBeneficiariesNamed: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...erbscheinAnfrageHappyPathData,
        testamentArt: "erbvertrag",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/bekannte-beguenstigten",
      userInput: {
        allNamedBeneficiariesKnown: "yes",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/verteiltes-erbe",
      userInput: {
        erbeCompletelyAllocated: "yes",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/warnung",
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
    },
  ],
  testamentNamedBeneficiaryDeceased: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...erbscheinAnfrageHappyPathData,
        testamentArt: "erbvertrag",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/bekannte-beguenstigten",
      userInput: {
        allNamedBeneficiariesKnown: "yes",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/verteiltes-erbe",
      userInput: {
        erbeCompletelyAllocated: "yes",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
      addArrayItemEvent: "add-beguenstigten",
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/#/name",
      userInput: {
        "beguenstigten#vorname": "Max",
        "beguenstigten#nachname": "Mustermann",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/#/verhaeltnis",
      userInput: {
        "beguenstigten#verhaeltnis": "aunt-uncle",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/#/geburtsdatum",
      userInput: {
        "beguenstigten#geburtsdatum": {
          day: "01",
          month: "01",
          year: "1950",
        },
        "beguenstigten#isAlive": "no",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/#/sterbedatum",
      userInput: {
        "beguenstigten#sterbedatum": {
          day: "01",
          month: "01",
          year: "2020",
        },
        "beguenstigten#geburtsdatum": {
          day: "01",
          month: "01",
          year: "1950",
        },
        "beguenstigten#sterbeort": "Musterstadt",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
    },
  ],
  testamentNamedBeneficiaryAlive: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...erbscheinAnfrageHappyPathData,
        testamentArt: "erbvertrag",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/bekannte-beguenstigten",
      userInput: {
        allNamedBeneficiariesKnown: "yes",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/verteiltes-erbe",
      userInput: {
        erbeCompletelyAllocated: "yes",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
      addArrayItemEvent: "add-beguenstigten",
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/#/name",
      userInput: {
        "beguenstigten#vorname": "Marcia",
        "beguenstigten#nachname": "Mustermann",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/#/verhaeltnis",
      userInput: {
        "beguenstigten#verhaeltnis": "cousin",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/#/geburtsdatum",
      userInput: {
        "beguenstigten#geburtsdatum": {
          day: "01",
          month: "01",
          year: "1990",
        },
        "beguenstigten#isAlive": "yes",
        beguenstigten: mockBeguenstigtenArray,
      },
      pageData: {
        arrayIndexes: [0],
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/#/anschrift",
      userInput: {
        "beguenstigten#strasse": "Musterstraße 1",
        "beguenstigten#hausnummer": "1",
        "beguenstigten#plz": "12345",
        "beguenstigten#ort": "Musterstadt",
        "beguenstigten#land": "Deutschland",
      },
    },
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
    },
  ],
  namedBeneficiaryToSpouseTransition: [
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...namedBeneficiaryHappyPathData,
        verstorbeneFamilienstand: "verheiratet",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
    },
  ],
  namedBeneficiaryToAngehoerigeTransition: [
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...namedBeneficiaryHappyPathData,
        verstorbeneFamilienstand: "ledig",
        allNamedBeneficiariesKnown: "yes",
        erbeCompletelyAllocated: "no",
      },
    },
    {
      stepId: "/angehoerige/hatte-kinder",
    },
  ],
  namedBeneficiaryToGrundbesitzTransition: [
    {
      stepId: "/testament-oder-erbvertrag/beguenstigten/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...namedBeneficiaryHappyPathData,
        verstorbeneFamilienstand: "ledig",
        allNamedBeneficiariesKnown: "yes",
        erbeCompletelyAllocated: "yes",
      },
    },
    {
      stepId: "/nachlass/grundbesitz/grundbesitz-frage",
    },
  ],
} satisfies FlowTestCases<ErbscheinAnfrageUserData>;
