import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";

export const testCasesBeratungshilfeFormularAbgabe = [
  [
    {
      abgabeArt: "online",
    },
    [
      "/abgabe/zusammenfassung",
      "/abgabe/art",
      // "/abgabe/dokumente", // Uncomment when file upload is released
      "/abgabe/online",
    ],
  ],
  [
    {
      abgabeArt: "ausdrucken",
    },
    ["/abgabe/zusammenfassung", "/abgabe/art", "/abgabe/ausdrucken"],
  ],
] as const satisfies TestCases<BeratungshilfeFormularUserData>;
