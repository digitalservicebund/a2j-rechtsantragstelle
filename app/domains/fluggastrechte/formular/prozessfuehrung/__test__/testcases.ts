import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteUserData } from "../../userData";

export const testCasesFluggastrechteFormularProzessfuehrung = [
  [
    {
      hasZeugen: "yes",
      versaeumnisurteil: "yes",
      videoverhandlung: "yes",
      pageData: {
        subflowDoneStates: {
          "/prozessfuehrung": true,
        },
        arrayIndexes: [],
      },
    },
    [
      "/prozessfuehrung/zeugen",
      "/prozessfuehrung/videoverhandlung",
      "/prozessfuehrung/versaeumnisurteil",
      "/prozessfuehrung/zahlung-nach-klageeinreichung",
      "/zusammenfassung/start",
      "/abgabe/start",
    ],
  ],
] as const satisfies TestCases<FluggastrechteUserData>;
