import { TransitionConfigMap } from "~/services/flow/flowEngine/types";
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
  hauptantragDaten: "hauptantragUebersicht",
  hauptantragWarnung: "hauptantragUebersicht",
  nebenantragDaten: [
    {
      type: "addArrayItem",
      target: "nebenantragDaten",
    },
    {
      target: "hauptantragUebersicht",
    },
  ],
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
