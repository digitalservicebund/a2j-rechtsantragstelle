import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

export const testCasesIntroForderung = [
  [
    {
      anwaltschaft: "no",
      forderung: "etwasAnderes",
    },
    [
      "/gericht-pruefen/intro/anwaltschaft",
      "/gericht-pruefen/intro/voraussetzungen",
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/was",
      "/gericht-pruefen/forderung/ergebnis/forderung-etwas-anderes",
    ],
  ],
  [
    {
      anwaltschaft: "no",
      forderung: "maximal10000",
    },
    [
      "/gericht-pruefen/intro/anwaltschaft",
      "/gericht-pruefen/intro/voraussetzungen",
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/was",
      "/gericht-pruefen/sachgebiet/info",
    ],
  ],
  [
    {
      anwaltschaft: "yes",
      forderung: "etwasAnderes",
    },
    [
      "/gericht-pruefen/intro/anwaltschaft",
      "/gericht-pruefen/intro/voraussetzungen-anwaltschaft",
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/was",
      "/gericht-pruefen/forderung/ergebnis/forderung-etwas-anderes",
    ],
  ],
  [
    {
      anwaltschaft: "yes",
      forderung: "maximal10000",
    },
    [
      "/gericht-pruefen/intro/anwaltschaft",
      "/gericht-pruefen/intro/voraussetzungen-anwaltschaft",
      "/gericht-pruefen/intro/start",
      "/gericht-pruefen/forderung/was",
      "/gericht-pruefen/sachgebiet/info",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
