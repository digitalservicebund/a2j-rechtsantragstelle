import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";
import { type GeldEinklagenAnwaltschaftPages } from "../pages";
import { arrayIsNonEmpty } from "~/util/array";

export const hauptUndNebenantraegeFlowConfig = {
  hauptantragUebersicht: [
    {
      type: "addArrayItem",
      target: "hauptantragDaten",
    },
    {
      guard: (context) => !arrayIsNonEmpty(context.hauptantrag),
      target: "hauptantragWarnung",
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
  hauptantragWarnung: "hauptantragUebersicht",
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
  schmerzengeldantragWarnung: "schmerzengeldantraegeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
