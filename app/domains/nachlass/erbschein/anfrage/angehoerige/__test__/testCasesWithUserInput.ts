import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const happyPathData: NachlassErbscheinAnfrageUserData = {
  datenverarbeitungZustimmung: "on",
  verstorbenePersonStrasse: "Musterstraße",
  verstorbenePersonHausnummer: "1",
  verstorbenePersonOrt: "Musterstadt",
  antragstellendePersonTelefonnummer: "0123456789",
  testamentArt: "none",
  verstorbeneFamilienstand: "ledig",
};

export const angehoerigeTestCases = {
  deceasedAngehoerige: [
    {
      stepId: "/angehoerige/uebersicht",
      addArrayItemEvent: "add-angehoerige",
    },
    {
      stepId: "/angehoerige/#/name",
      userInput: {
        ...happyPathData,
        "angehoerige#vorname": "Max",
        "angehoerige#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/#/geburtsdatum",
      userInput: {
        "angehoerige#geburtsdatum": {
          day: "01",
          month: "01",
          year: "1990",
        },
        "angehoerige#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/#/lebend",
      userInput: {
        "angehoerige#isAlive": "no",
      },
    },
    {
      stepId: "/angehoerige/#/sterbedatum",
      userInput: {
        "angehoerige#sterbedatum": {
          day: "01",
          month: "01",
          year: "2020",
        },
        "angehoerige#sterbeort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        angehoerige: [
          {
            vorname: "Max",
            nachname: "Mustermann",
            geburtsdatum: {
              day: "01",
              month: "01",
              year: "1990",
            },
            geburtsort: "Musterstadt",
            isAlive: "no",
            sterbedatum: {
              day: "01",
              month: "01",
              year: "2020",
            },
            sterbeort: "Musterstadt",
          },
        ],
      },
    },
    {
      stepId: "/nachlass/grundbesitz-frage",
    },
  ],
  survivingAngehoerige: [
    {
      stepId: "/angehoerige/uebersicht",
      addArrayItemEvent: "add-angehoerige",
    },
    {
      stepId: "/angehoerige/#/name",
      userInput: {
        ...happyPathData,
        "angehoerige#vorname": "Max",
        "angehoerige#nachname": "Mustermann",
      },
    },
    {
      stepId: "/angehoerige/#/geburtsdatum",
      userInput: {
        "angehoerige#geburtsdatum": {
          day: "01",
          month: "01",
          year: "1990",
        },
        "angehoerige#geburtsort": "Musterstadt",
      },
    },
    {
      stepId: "/angehoerige/#/lebend",
      userInput: {
        "angehoerige#isAlive": "yes",
        angehoerige: [
          {
            isAlive: "yes",
          } as any,
        ],
      },
      pageData: {
        arrayIndexes: [0],
      },
    },
    {
      stepId: "/angehoerige/#/anschrift",
      userInput: {
        "angehoerige#strasse": "Musterstraße 1",
        "angehoerige#hausnummer": "1",
        "angehoerige#plz": "12345",
        "angehoerige#ort": "Musterstadt",
        "angehoerige#land": "Deutschland",
      },
    },
    {
      stepId: "/angehoerige/uebersicht",
    },
  ],
} satisfies FlowTestCases<NachlassErbscheinAnfrageUserData>;
