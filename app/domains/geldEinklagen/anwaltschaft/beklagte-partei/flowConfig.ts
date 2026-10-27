import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const beklagteParteiFlowConfig = {
  beklagteUebersicht: [
    { type: "addArrayItem", target: "beklagteNaturalPersonDaten" },
    { type: "addArrayItem", target: "beklagteOrganizationDaten" },
    { target: "allgemeineZahlungsUndNebenantraegeUebersicht" },
  ],
  beklagteNaturalPersonDaten: [
    {
      type: "addArrayItem",
      target: "beklagteNaturalPersonGesetzlicheVertretungDaten",
    },
    { target: "beklagteUebersicht" },
  ],
  beklagteNaturalPersonGesetzlicheVertretungDaten: "beklagteUebersicht",
  beklagteOrganizationDaten: [
    {
      type: "addArrayItem",
      target: "beklagteOrganizationGesetzlicheVertretungDaten",
    },
    { target: "beklagteUebersicht" },
  ],
  beklagteOrganizationGesetzlicheVertretungDaten: "beklagteUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
