import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { fluggastrechteFormularHappyPathData } from "~/domains/fluggastrechte/formular/__test__/mockTestData";
import { type FluggastrechteUserData } from "../../userData";

const baseContext = {
  ...fluggastrechteFormularHappyPathData,
  pageData: {
    subflowDoneStates: {
      "/grundvoraussetzungen": true,
    },
  },
} satisfies Partial<FluggastrechteUserData>;

export const testCasesFluggastrechteFormularFlugdatenFluggesellschaftAddresse: FlowTestCases<FluggastrechteUserData> =
  {
    filledByUser: [
      {
        stepId: "/flugdaten/adresse-fluggesellschaft-auswahl",
        userInput: {
          ...baseContext,
          fluggesellschaftAuswahlAdresse: "filledByUser",
        },
      },
      {
        stepId: "/flugdaten/adresse-fluggesellschaft",
        userInput: {
          fluggesellschaftStrasse: "Musterstr.",
          fluggesellschaftHausnummer: "30",
          fluggesellschaftPostleitzahl: "10970",
          fluggesellschaftOrt: "Frankfurt",
          fluggesellschaftLand: "Deutschland",
        },
      },
      { stepId: "/flugdaten/geplanter-flug" },
    ],
    fromAirlineDB: [
      {
        stepId: "/flugdaten/adresse-fluggesellschaft-auswahl",
        userInput: {
          ...baseContext,
          fluggesellschaftAuswahlAdresse: "fromAirlineDB",
        },
      },
      { stepId: "/flugdaten/geplanter-flug" },
    ],
  };
