import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const tatsachenvortragFlowConfig = {
  antraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "absaetzeUebersicht",
    },
    { target: "rechtlicheWuerdigung" },
  ],
  absaetzeUebersicht: [
    {
      type: "addArrayItem",
      target: "absatzDaten",
    },
    { target: "antraegeUebersicht" },
  ],
  absatzDaten: [{ target: "absaetzeUebersicht" }],
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
