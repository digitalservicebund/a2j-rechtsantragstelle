import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const sonstigeNebenUndProzessantraegeFlowConfig = {
  sonstigeNebenUndProzessantraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "sonstigeNebenUndProzessantraegeAntrag",
    },
    {
      target: "downloadKlage",
    },
  ],
  sonstigeNebenUndProzessantraegeAntrag:
    "sonstigeNebenUndProzessantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
