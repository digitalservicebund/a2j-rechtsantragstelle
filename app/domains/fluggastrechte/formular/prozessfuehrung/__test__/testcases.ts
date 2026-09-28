import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { fluggastrechteFormularHappyPathData } from "~/domains/fluggastrechte/formular/__test__/mockTestData";
import type { FluggastrechteUserData } from "../../userData";

export const testCasesFluggastrechteFormularProzessfuehrung: FlowTestCases<FluggastrechteUserData> =
  {
    zeugenVerhandlungVideoverhandlungVersaeumnisurteilAlleJa: [
      {
        stepId: "/prozessfuehrung/zeugen",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
            "/prozessfuehrung": true,
          },
        },
        userInput: {
          ...fluggastrechteFormularHappyPathData,
          hasZeugen: "yes",
        },
      },
      {
        stepId: "/prozessfuehrung/muendliche-verhandlung",
        userInput: {
          muendlicheVerhandlung: "yes",
        },
      },
      {
        stepId: "/prozessfuehrung/videoverhandlung",
        userInput: {
          videoverhandlung: "yes",
        },
      },
      {
        stepId: "/prozessfuehrung/versaeumnisurteil",
        userInput: {
          versaeumnisurteil: "yes",
        },
      },
      {
        stepId: "/prozessfuehrung/zahlung-nach-klageeinreichung",
      },
      {
        stepId: "/zusammenfassung/start",
      },
      {
        stepId: "/abgabe/start",
      },
    ],
  };
