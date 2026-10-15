import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const hauptUndNebenantraegeFlowConfig = {
  sonstigeNebenUndProzessantraegeUebersicht: "downloadKlage",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
