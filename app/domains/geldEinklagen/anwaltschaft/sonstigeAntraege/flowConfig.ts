import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const sonstigeAntraegeFlowConfig = {
  sonstigeAntraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "sonstigeAntraegeAntragDaten",
    },
    {
      target: "antraegeUebersicht",
    },
  ],
  sonstigeAntraegeAntragDaten: "sonstigeAntraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
