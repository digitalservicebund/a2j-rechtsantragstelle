import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../../pages";

export const wohnungFlowConfig = {
  wohnsituation: "wohnungGroesse",
  wohnungGroesse: [
    {
      guard: (context) => context.livingSituation === "alone",
      target: "wohnkostenAllein",
    },
    {
      guard: (context) =>
        context.livingSituation === "withRelatives" ||
        context.livingSituation === "withOthers",
      target: "personenAnzahl",
    },
  ],
  wohnkostenAllein: "eigentumInfo",
  personenAnzahl: "wohnkostenGeteilt",
  wohnkostenGeteilt: "eigentumInfo",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
