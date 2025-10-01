import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

export const testCasesGeldEinklagenGerichtPruefen = [
  [
    {
      forderung: "etwasAnderes",
    },
    [
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/fragen",
      "/gericht-pruefen/forderung/ergebnis/forderung-etwas-anderes",
    ],
  ],
  [
    {
      forderung: "maximal5000",
    },
    [
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/fragen",
      "/gericht-pruefen/sachgebiet/info",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
