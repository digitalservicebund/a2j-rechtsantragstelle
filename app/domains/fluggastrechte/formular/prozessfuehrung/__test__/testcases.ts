import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteProzessfuehrungUserData } from "~/domains/fluggastrechte/formular/prozessfuehrung/userData";
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
] as const satisfies TestCases<FluggastrechteProzessfuehrungUserData>;
