import { TransitionConfigMap } from "~/services/flow/flowEngine/types";
import { type GeldEinklagenAnwaltschaftPages } from "../pages";

export const hauptUndNebenantraegeFlowConfig = {
  allgemeineZahlungsUndNebenantraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "allgemeineZahlungsUndNebenantrag",
    },
    {
      target: "prozessualeAusfuehrungen",
    },
  ],
  allgemeineZahlungsUndNebenantrag:
    "allgemeineZahlungsUndNebenantraegeUebersicht",
  allgemeineZahlungsUndNebenantraegeWarnung:
    "allgemeineZahlungsUndNebenantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
