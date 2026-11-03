import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";
import { klagendeProzessbevollmaechtigteFlowConfig } from "./prozessbevollmaechtigte/flowConfig";

export const klagendeParteiFlowConfig = {
  klagendeUebersicht: [
    { type: "addArrayItem", target: "klagendeNaturalPersonDaten" },
    { type: "addArrayItem", target: "klagendeOrganizationDaten" },
    { target: "klagendeProzessbevollmaechtigteUebersicht" },
  ],
  klagendeNaturalPersonDaten: [
    {
      type: "addArrayItem",
      target: "klagendeNaturalPersonGesetzlicheVertretungDaten",
    },
    { target: "klagendeUebersicht" },
  ],
  klagendeNaturalPersonGesetzlicheVertretungDaten: "klagendeUebersicht",
  klagendeOrganizationDaten: [
    {
      type: "addArrayItem",
      target: "klagendeOrganizationGesetzlicheVertretungDaten",
    },
    {
      target: "klagendeUebersicht",
    },
  ],
  klagendeOrganizationGesetzlicheVertretungDaten: "klagendeUebersicht",
  ...klagendeProzessbevollmaechtigteFlowConfig,
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
