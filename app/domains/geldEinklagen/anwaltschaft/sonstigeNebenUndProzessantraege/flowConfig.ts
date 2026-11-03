import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const sonstigeNebenUndProzessantraegeFlowConfig = {
  sonstigeNebenUndProzessantraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "sonstigeNebenUndProzessantraegeAntrag",
    },
    {
      target: "antraegeUebersicht",
    },
  ],
  sonstigeNebenUndProzessantraegeAntrag:
    "sonstigeNebenUndProzessantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
