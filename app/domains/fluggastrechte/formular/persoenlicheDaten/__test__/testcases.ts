import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { fluggastrechteFormularHappyPathData } from "~/domains/fluggastrechte/formular/__test__/mockTestData";
import { type FluggastrechteFormularWeiterePersonen } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

const personDatenInput = {
  anrede: "",
  title: "",
  vorname: "test",
  nachname: "test",
  strasse: "test",
  hausnummer: "1",
  plz: "13055",
  ort: "test",
  land: "Deutschland",
  telefonnummer: "",
  iban: "",
} satisfies Partial<FluggastrechteUserData>;

const weiterePersonInput = {
  buchungsnummer: "123456",
  anrede: "",
  title: "",
  vorname: "test",
  nachname: "test",
  strasse: "test",
  hausnummer: "1",
  plz: "13055",
  ort: "test",
  land: "Deutschland",
  telefonnummer: "",
  datenverarbeitungZustimmung: "on",
} satisfies FluggastrechteFormularWeiterePersonen[number];

export const testCasesFluggastrechteFormularPersoenlicheDaten: FlowTestCases<FluggastrechteUserData> =
  {
    ohneWeiterePersonenAntwort: [
      {
        stepId: "/persoenliche-daten/person/daten",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...fluggastrechteFormularHappyPathData,
          ...personDatenInput,
        },
      },
      { stepId: "/persoenliche-daten/weitere-personen/frage" },
    ],
    weiterePersonenNein: [
      {
        stepId: "/persoenliche-daten/person/daten",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...fluggastrechteFormularHappyPathData,
          ...personDatenInput,
        },
      },
      {
        stepId: "/persoenliche-daten/weitere-personen/frage",
        userInput: {
          isWeiterePersonen: "no",
        },
      },
      { stepId: "/prozessfuehrung/zeugen" },
    ],
    weiterePersonenJaMitPerson: [
      {
        stepId: "/persoenliche-daten/person/daten",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...fluggastrechteFormularHappyPathData,
          ...personDatenInput,
        },
      },
      {
        stepId: "/persoenliche-daten/weitere-personen/frage",
        userInput: {
          isWeiterePersonen: "yes",
        },
      },
      {
        stepId: "/persoenliche-daten/weitere-personen/uebersicht",
        skipPageSchemaValidation: true,
        userInput: {
          weiterePersonen: [weiterePersonInput],
        },
      },
      { stepId: "/prozessfuehrung/zeugen" },
    ],
    weiterePersonenJaLeeresArray: [
      {
        stepId: "/persoenliche-daten/person/daten",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...fluggastrechteFormularHappyPathData,
          ...personDatenInput,
        },
      },
      {
        stepId: "/persoenliche-daten/weitere-personen/frage",
        userInput: {
          isWeiterePersonen: "yes",
        },
      },
      {
        stepId: "/persoenliche-daten/weitere-personen/uebersicht",
        skipPageSchemaValidation: true,
        userInput: {
          weiterePersonen: [],
        },
      },
      { stepId: "/persoenliche-daten/weitere-personen/warnung" },
    ],
    weiterePersonenJaOhneArray: [
      {
        stepId: "/persoenliche-daten/person/daten",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...fluggastrechteFormularHappyPathData,
          ...personDatenInput,
        },
      },
      {
        stepId: "/persoenliche-daten/weitere-personen/frage",
        userInput: {
          isWeiterePersonen: "yes",
        },
      },
      { stepId: "/persoenliche-daten/weitere-personen/uebersicht" },
      { stepId: "/persoenliche-daten/weitere-personen/warnung" },
    ],
  };
