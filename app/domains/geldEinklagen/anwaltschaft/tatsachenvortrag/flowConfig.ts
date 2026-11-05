import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const tatsachenvortragFlowConfig = {
  antraegeUebersicht: [
    {
      type: "addArrayItem",
      target: "absaetzeUebersicht",
    },
    {
      type: "addArrayItem",
      target: "nebenantragAbsatzUebersicht",
    },
    { target: "rechtlicheWuerdigung" },
  ],
  absaetzeUebersicht: [
    {
      type: "addArrayItem",
      target: "absatzDaten",
    },
    { target: "antraegeUebersicht" },
  ],
  absatzDaten: [{ target: "absaetzeUebersicht" }],
  nebenantragAbsatzUebersicht: [
    {
      type: "addArrayItem",
      target: "nebenantragAbsatzDaten",
    },
    { target: "antraegeUebersicht" },
  ],
  nebenantragAbsatzDaten: [{ target: "nebenantragAbsatzUebersicht" }],
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
