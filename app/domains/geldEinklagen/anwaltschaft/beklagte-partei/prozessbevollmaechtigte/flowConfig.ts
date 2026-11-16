import { type GeldEinklagenAnwaltschaftPages } from "../../pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const beklagteProzessbevollmaechtigteFlowConfig = {
  beklagteProzessbevollmaechtigteUebersicht: [
    {
      type: "addArrayItem",
      target: "beklagteProzessbevollmaechtigteEinzelkanzleiDaten",
    },
    {
      type: "addArrayItem",
      target:
        "beklagteProzessbevollmaechtigteBerufsausuebungsgesellschaftDaten",
    },
    { target: "hauptantragUebersicht" },
  ],
  beklagteProzessbevollmaechtigteEinzelkanzleiDaten:
    "beklagteProzessbevollmaechtigteUebersicht",
  beklagteProzessbevollmaechtigteBerufsausuebungsgesellschaftDaten:
    "beklagteProzessbevollmaechtigteUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
