import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";

const cases = [
  [
    {
      abgabeArt: "online",
    },
    ["/abgabe/art", "/abgabe/online"],
  ],
  [
    {
      abgabeArt: "ausdrucken",
    },
    ["/abgabe/art", "/abgabe/ausdrucken"],
  ],
] as const satisfies TestCases<BeratungshilfeFormularUserData>;

export const testCasesBeratungshilfeFormularAbgabe = {
  machine,
  cases,
};
