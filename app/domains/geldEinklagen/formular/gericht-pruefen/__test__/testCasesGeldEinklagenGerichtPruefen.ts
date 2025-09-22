import { TestCases } from "~/domains/__test__/TestCases";
import { GeldEinklagenFormularUserData } from "../../userData";

export const testCasesGeldEinklagenGerichtPruefen = [
  [
    {
      forderung: "maximal5000",
    },
    [
      "/gericht-pruefen/intro/intro",
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/fragen",
    ],
  ],
  [
    {
      forderung: "etwasAnderes",
    },
    [
      "/gericht-pruefen/intro/intro",
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/fragen",
      "/gericht-pruefen/forderung/ergebnis/forderung-etwas-anderes",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
