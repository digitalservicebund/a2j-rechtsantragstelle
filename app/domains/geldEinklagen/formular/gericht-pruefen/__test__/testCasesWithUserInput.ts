import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

export const testCasesWithUserInputIntroForderung: FlowTestCases<GeldEinklagenFormularUserData> =
  {
    noAnwaltschaftAndEtwasAnderes: [
      {
        stepId: "/gericht-pruefen/intro/anwaltschaft",
        userInput: { anwaltschaft: "no" },
      },
      {
        stepId: "/gericht-pruefen/intro/voraussetzungen",
      },
      {
        stepId: "/gericht-pruefen/intro/start",
      },
      {
        stepId: "/gericht-pruefen/forderung/was",
        userInput: { forderung: "etwasAnderes" },
      },
      {
        stepId: "/gericht-pruefen/forderung/ergebnis/forderung-etwas-anderes",
      },
    ],
    noAnwaltschaftAndMaximal10000: [
      {
        stepId: "/gericht-pruefen/intro/anwaltschaft",
        userInput: { anwaltschaft: "no" },
      },
      {
        stepId: "/gericht-pruefen/intro/voraussetzungen",
      },
      {
        stepId: "/gericht-pruefen/intro/start",
      },
      {
        stepId: "/gericht-pruefen/forderung/was",
        userInput: { forderung: "maximal10000" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
      },
    ],
    yesAnwaltschaftAndEtwasAnderes: [
      {
        stepId: "/gericht-pruefen/intro/anwaltschaft",
        userInput: { anwaltschaft: "yes" },
      },
      {
        stepId: "/gericht-pruefen/intro/voraussetzungen-anwaltschaft",
      },
      {
        stepId: "/gericht-pruefen/intro/start",
      },
      {
        stepId: "/gericht-pruefen/forderung/was",
        userInput: { forderung: "etwasAnderes" },
      },
      {
        stepId: "/gericht-pruefen/forderung/ergebnis/forderung-etwas-anderes",
      },
    ],
    yesAnwaltschaftAndMaximal10000: [
      {
        stepId: "/gericht-pruefen/intro/anwaltschaft",
        userInput: { anwaltschaft: "yes" },
      },
      {
        stepId: "/gericht-pruefen/intro/voraussetzungen-anwaltschaft",
      },
      {
        stepId: "/gericht-pruefen/intro/start",
      },
      {
        stepId: "/gericht-pruefen/forderung/was",
        userInput: { forderung: "maximal10000" },
      },
      {
        stepId: "/gericht-pruefen/sachgebiet/info",
      },
    ],
  };
