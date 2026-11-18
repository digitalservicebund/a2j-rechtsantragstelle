import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";
import { type GeldEinklagenAnwaltschaftPages } from "../pages";

export const hauptUndNebenantraegeFlowConfig = {
  hauptantragUebersicht: [
    {
      type: "addArrayItem",
      target: "hauptantragDaten",
    },
    {
      target: "schmerzengeldantraegeUebersicht",
    },
  ],
  hauptantragDaten: [
    {
      type: "addArrayItem",
      target: "nebenantragDaten",
    },
    {
      type: "addArrayItem",
      target: "annahmeverzugDaten",
    },
    {
      target: "hauptantragUebersicht",
    },
  ],
  nebenantragDaten: "hauptantragUebersicht",
  annahmeverzugDaten: "hauptantragUebersicht",
  schmerzengeldantraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "schmerzengeldantragDaten",
    },
    {
      target: "prozessualeAusfuehrungen",
    },
  ],
  schmerzengeldantragDaten: [
    {
      type: "addArrayItem",
      target: "schmerzengeldNebenantragDaten",
    },
    {
      target: "schmerzengeldantraegeUebersicht",
    },
  ],
  schmerzengeldNebenantragDaten: "schmerzengeldantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
