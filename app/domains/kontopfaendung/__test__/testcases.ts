import type { TestCases } from "~/domains/__test__/TestCases";
import { kontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import { machine } from "./testMachine";
const cases = [
  [
    { hasKontopfaendung: "nein" },
    ["/start", "/kontopfaendung", "/ergebnisseite"],
  ],
  [
    { hasKontopfaendung: "ja", euroSchwelle: "nein" },
    [
      "/start",
      "/kontopfaendung",
      "/p-konto",
      "/glaeubiger",
      "/euro-schwelle",
      "/ergebnisseite",
    ],
  ],
] as const satisfies TestCases<kontopfaendungWegweiserContext>;

export const testCasesKontopfaendungWegweiser = { machine, cases };
