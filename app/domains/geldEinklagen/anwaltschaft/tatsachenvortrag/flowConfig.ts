import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const tatsachenvortragFlowConfig = {
  antraegeUebersicht: [
    // Listed first so the overview stays the back target of absaetzeUebersicht.
    { type: "addArrayItem", target: "absaetzeUebersicht" },
    { type: "addArrayItem", target: "vortragZuordnung" },
    { target: "rechtlicheWuerdigung" },
  ],
  vortragZuordnung: [{ target: "antraegeUebersicht" }],
  absaetzeUebersicht: [
    { type: "addArrayItem", target: "absatzDaten" },
    { type: "addArrayItem", target: "augenscheinDaten" },
    { type: "addArrayItem", target: "urkundeDaten" },
    { type: "addArrayItem", target: "sachverstaendigengutachtenDaten" },
    { type: "addArrayItem", target: "zeugeDaten" },
    { type: "addArrayItem", target: "parteivernehmungDaten" },
    { target: "antraegeUebersicht" },
  ],
  absatzDaten: [{ target: "absaetzeUebersicht" }],
  augenscheinDaten: [{ target: "absaetzeUebersicht" }],
  urkundeDaten: [{ target: "absaetzeUebersicht" }],
  sachverstaendigengutachtenDaten: [{ target: "absaetzeUebersicht" }],
  zeugeDaten: [{ target: "absaetzeUebersicht" }],
  parteivernehmungDaten: [{ target: "absaetzeUebersicht" }],
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
