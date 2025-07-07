import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

export const testCasesFluggastrechteFormularProzessfuehrung = [
  [
    {
      hasZeugen: "yes",
      versaeumnisurteil: "yes",
      videoverhandlung: "yes",
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
