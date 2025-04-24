import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";

const cases = [
  [
    {
      abgabeArt: "online",
    },
    ["/abgabe/art", "/abgabe/dokumente", "/abgabe/online"],
  ],
  [
    {
      abgabeArt: "ausdrucken",
    },
    ["/abgabe/art", "/abgabe/ausdrucken"],
  ],
] as const satisfies TestCases<BeratungshilfeFormularContext>;

export const testCasesBeratungshilfeFormularAbgabe = {
  machine,
  cases,
};
