import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const sonstigeNebenUndProzessantraegeFlowConfig = {
  sonstigeNebenUndProzessantraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "sonstigeNebenUndProzessantraegeAntrag",
    },
    {
      target: "tatsachenvortragBeweiseUebersicht",
    },
  ],
  sonstigeNebenUndProzessantraegeAntrag:
    "sonstigeNebenUndProzessantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
