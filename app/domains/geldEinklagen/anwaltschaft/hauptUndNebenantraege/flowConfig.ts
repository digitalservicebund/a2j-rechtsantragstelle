import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";
import { type GeldEinklagenAnwaltschaftPages } from "../pages";

export const hauptUndNebenantraegeFlowConfig = {
  hauptantragUebersicht: [
    {
      type: "addArrayItem",
      target: "hauptantragDaten",
    },
    {
      target: "hauptantragWarnung",
    },
  ],
  hauptantragDaten: [
    {
      type: "addArrayItem",
      target: "nebenantragDaten",
    },
    { target: "hauptantragUebersicht" },
  ],
  hauptantragWarnung: "hauptantragUebersicht",
  nebenantragDaten: "hauptantragUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
