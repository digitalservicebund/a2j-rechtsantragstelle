import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const sonstigeNebenUndProzessantraegeFlowConfig = {
  sonstigeNebenUndProzessantraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "sonstigeNebenUndProzessantraegeAntrag",
    },
    {
      target: "rechtlicheWuerdigung",
    },
  ],
  sonstigeNebenUndProzessantraegeAntrag:
    "sonstigeNebenUndProzessantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
