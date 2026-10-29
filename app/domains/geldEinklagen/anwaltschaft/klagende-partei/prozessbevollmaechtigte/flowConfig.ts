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
    {
      type: "addArrayItem",
      target:
        "klagendeBerufsausuebungsgesellschaftProzessbevollmaechtigtePersonenDaten",
    },
    { target: "klagendeProzessbevollmaechtigteUebersicht" },
  ],
  signaturangabenDaten: "klagendeProzessbevollmaechtigteUebersicht",
  klagendeBerufsausuebungsgesellschaftProzessbevollmaechtigtePersonenDaten:
    "klagendeProzessbevollmaechtigteUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
