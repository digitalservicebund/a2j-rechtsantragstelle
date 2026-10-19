import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const klagendeParteiFlowConfig = {
  klagendeUebersicht: [
    { type: "addArrayItem", target: "klagendeNaturalPersonDaten" },
    { type: "addArrayItem", target: "klagendeOrganizationDaten" },
    { target: "beklagteUebersicht" },
  ],
  klagendeNaturalPersonDaten: [
    {
      type: "addArrayItem",
      target: "klagendeNaturalPersonGesetzlicheVertretungDaten",
    },
    { target: "klagendeUebersicht" },
  ],
  klagendeNaturalPersonGesetzlicheVertretungDaten: "klagendeUebersicht",
  klagendeOrganizationDaten: "klagendeUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
