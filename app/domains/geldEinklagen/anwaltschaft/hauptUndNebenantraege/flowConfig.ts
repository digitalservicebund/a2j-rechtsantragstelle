import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const hauptUndNebenantraegeFlowConfig = {
  allgemeineZahlungsUndNebenantraegeUebersicht: "allgemeineZahlungsUndNebenantraegeUebersicht",
  allgemeineZahlungsUndNebenantraegeWarnung: "allgemeineZahlungsUndNebenantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
