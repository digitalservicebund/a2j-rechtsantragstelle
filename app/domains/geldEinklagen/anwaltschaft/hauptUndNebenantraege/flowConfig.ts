import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const hauptUndNebenantraegeFlowConfig = {
  sonstigeNebenUndProzessantraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "sonstigeNebenUndProzessantraege",
    },
    {
      target: "downloadKlage"
    }
  ],
  sonstigeNebenUndProzessantraege: "sonstigeNebenUndProzessantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
