import { type GeldEinklagenAnwaltschaftPages } from "../../pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const klagendeProzessbevollmaechtigteFlowConfig = {
  klagendeProzessbevollmaechtigteUebersicht: [
    {
      type: "addArrayItem",
      target: "klagendeProzessbevollmaechtigteEinzelkanzleiDaten",
    },
    {
      type: "addArrayItem",
      target:
        "klagendeProzessbevollmaechtigteBerufsausuebungsgesellschaftDaten",
    },
    { target: "beklagteUebersicht" },
  ],
  klagendeProzessbevollmaechtigteEinzelkanzleiDaten:
    "klagendeProzessbevollmaechtigteUebersicht",
  klagendeProzessbevollmaechtigteBerufsausuebungsgesellschaftDaten: [
    {
      type: "addArrayItem",
      target: "signaturangabenDaten",
    },
    { target: "klagendeProzessbevollmaechtigteUebersicht" },
  ],
  signaturangabenDaten: "klagendeProzessbevollmaechtigteUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
