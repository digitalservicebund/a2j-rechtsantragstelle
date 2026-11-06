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
    {
      type: "addArrayItem",
      target: "augenscheinDaten",
    },
    {
      type: "addArrayItem",
      target: "nebenantragAugenscheinDaten",
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
  augenscheinDaten: [{ target: "absaetzeUebersicht" }],
  nebenantragAugenscheinDaten: [{ target: "absaetzeUebersicht" }],
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
