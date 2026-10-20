import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";
import { type BeratungshilfeFormularPages } from "../../pages";

export const wohnungFlowConfig = {
  wohnsituation: "wohnungGroesse",
  wohnungGroesse: [
    {
      guard: (context) => context.livingSituation === "alone",
      target: "wohnkostenAllein",
    },
    { target: "personenAnzahl" },
  ],
  wohnkostenAllein: "eigentumInfo",
  personenAnzahl: "wohnkostenGeteilt",
  wohnkostenGeteilt: "eigentumInfo",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
