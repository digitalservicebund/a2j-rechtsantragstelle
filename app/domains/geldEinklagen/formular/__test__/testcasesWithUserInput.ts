import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../userData";
import { geldEinklagenFlowConfig } from "../flowConfig";
import { geldEinklagenFormular } from "..";

export const geldEinklagenFormularTestCases = {
  xstateConfig: geldEinklagenFormular.config,
  newEngineConfig: geldEinklagenFlowConfig,
  testcases: {
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
  },
} satisfies FlowTestConfig<
  GeldEinklagenFormularUserData,
  typeof geldEinklagenFlowConfig.pages
>;
