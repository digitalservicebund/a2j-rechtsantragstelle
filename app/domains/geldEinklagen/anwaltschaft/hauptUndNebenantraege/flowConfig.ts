import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const hauptUndNebenantraegeFlowConfig = {
  allgemeineZahlungsUndNebenantraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "allgemeineZahlungsUndNebenantrag",
    },
    {
      target: "allgemeineZahlungsUndNebenantraegeWarnung",
    },
  ],
  allgemeineZahlungsUndNebenantrag:
    "allgemeineZahlungsUndNebenantraegeUebersicht",
  allgemeineZahlungsUndNebenantraegeWarnung:
    "allgemeineZahlungsUndNebenantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
