import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";
import { beklagteProzessbevollmaechtigteFlowConfig } from "./prozessbevollmaechtigte/flowConfig";

export const beklagteParteiFlowConfig = {
  beklagteUebersicht: [
    { type: "addArrayItem", target: "beklagteNaturalPersonDaten" },
    { type: "addArrayItem", target: "beklagteOrganizationDaten" },
    { target: "hauptantragUebersicht" },
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
  ...beklagteProzessbevollmaechtigteFlowConfig,
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
