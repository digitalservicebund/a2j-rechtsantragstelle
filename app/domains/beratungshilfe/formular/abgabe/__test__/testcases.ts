import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";

const cases = [
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

export const testCasesBeratungshilfeFormularAbgabe = {
  machine,
  cases,
};
