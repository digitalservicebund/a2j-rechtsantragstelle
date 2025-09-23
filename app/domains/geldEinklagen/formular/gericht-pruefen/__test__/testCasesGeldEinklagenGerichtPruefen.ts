import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

export const testCasesGeldEinklagenGerichtPruefen = [
  [
    {
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
    },
    [
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/fragen",
      "gericht-pruefen/sachgebiet/info",
      "gericht-pruefen/sachgebiet/ausgeschlossen",
      "gericht-pruefen/sachgebiet/besondere",
    ],
  ],
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
      sachgebietAusgeschlossen: "yes",
    },
    [
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/fragen",
      "gericht-pruefen/sachgebiet/info",
      "gericht-pruefen/sachgebiet/ausgeschlossen",
      "ergebnis/sachgebiet-abbruch",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
