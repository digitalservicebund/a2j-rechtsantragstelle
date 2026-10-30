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
      target: "prozessualeAusfuehrungen",
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
    { target: "hauptantragUebersicht" },
  ],
  hauptantragWarnung: "hauptantragUebersicht",
  nebenantragDaten: "hauptantragUebersicht",
  annahmeverzugDaten: "hauptantragUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
