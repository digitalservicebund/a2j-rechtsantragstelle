import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

export const testCasesForderung = [
  [
    {
      forderung: "etwasAnderes",
    },
    [
      "/gericht-pruefen/intro/voraussetzungen",
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/was",
      "/gericht-pruefen/forderung/ergebnis/forderung-etwas-anderes",
    ],
  ],
  [
    {
      forderung: "maximal5000",
    },
    [
      "/gericht-pruefen/intro/voraussetzungen",
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/was",
      "/gericht-pruefen/sachgebiet/info",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
