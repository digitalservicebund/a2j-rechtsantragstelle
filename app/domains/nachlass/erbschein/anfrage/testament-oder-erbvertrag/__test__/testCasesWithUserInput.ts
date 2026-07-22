import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  datenverarbeitungZustimmung: "on",
  verstorbenePersonStrasse: "Musterstraße",
  verstorbenePersonHausnummer: "1",
  verstorbenePersonOrt: "Musterstadt",
  antragstellendePersonTelefonnummer: "0123456789",
};

export const testamentOderErbvertragTestCases = {
  noTestamentOrErbvertragSingle: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...happyPathData,
        testamentArt: "none",
        verstorbeneFamilienstand: "ledig",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
  noTestamentOrErbvertragNotSingle: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...happyPathData,
        testamentArt: "none",
        verstorbeneFamilienstand: "verheiratet",
      },
    },
    {
      stepId: "/ehepartner-oder-ehepartnerin/name",
    },
  ],
  testamentNoBeneficiariesNamed: [
    {
      stepId: "/testament-oder-erbvertrag/art",
      userInput: {
        ...happyPathData,
        testamentArt: "erbvertrag",
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
        ...happyPathData,
        testamentArt: "erbvertrag",
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
        ...happyPathData,
        testamentArt: "erbvertrag",
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
        beguenstigten: [
          {
            vorname: "Marcia",
            nachname: "Mustermann",
            verhaeltnis: "cousin",
            geburtsdatum: {
              day: "01",
              month: "01",
              year: "1990",
            },
            isAlive: "yes",
          } as any,
        ],
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
} satisfies FlowTestCases<NachlassErbscheinAnfrageUserData>;
