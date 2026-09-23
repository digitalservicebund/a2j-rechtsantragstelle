import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { fluggastrechteFormularHappyPathData } from "~/domains/fluggastrechte/formular/__test__/mockTestData";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

const baseContext = {
  ...fluggastrechteFormularHappyPathData,
  pageData: {
    subflowDoneStates: {
      "/grundvoraussetzungen": true,
    },
  },
} satisfies Partial<FluggastrechteUserData>;

export const testCasesFluggastrechteFormularStreitwertKosten: FlowTestCases<FluggastrechteUserData> =
  {
    ohneAirlineAdresse: [
      {
        stepId: "/streitwert-kosten/gerichtskosten",
        skipPageSchemaValidation: true,
        userInput: {
          ...baseContext,
          fluggesellschaft: "SU",
        },
      },
      { stepId: "/streitwert-kosten/andere-kosten" },
      {
        stepId: "/streitwert-kosten/prozesszinsen",
        userInput: {
          prozesszinsen: "yes",
        },
      },
      { stepId: "/flugdaten/adresse-fluggesellschaft" },
    ],
    mitAirlineAdresse: [
      {
        stepId: "/streitwert-kosten/gerichtskosten",
        skipPageSchemaValidation: true,
        userInput: {
          ...baseContext,
          fluggesellschaft: "LH",
        },
      },
      { stepId: "/streitwert-kosten/andere-kosten" },
      {
        stepId: "/streitwert-kosten/prozesszinsen",
        userInput: {
          prozesszinsen: "yes",
        },
      },
      { stepId: "/flugdaten/adresse-fluggesellschaft-auswahl" },
    ],
  };
