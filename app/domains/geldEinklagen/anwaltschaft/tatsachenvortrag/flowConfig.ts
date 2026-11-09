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
      target: "urkundeDaten",
    },
    {
      type: "addArrayItem",
      target: "sachverstaendigengutachtenDaten",
    },
    { target: "antraegeUebersicht" },
  ],
  absatzDaten: [{ target: "absaetzeUebersicht" }],
  augenscheinDaten: [{ target: "absaetzeUebersicht" }],
  urkundeDaten: [{ target: "absaetzeUebersicht" }],
  sachverstaendigengutachtenDaten: [{ target: "absaetzeUebersicht" }],
  nebenantragAbsatzUebersicht: [
    {
      type: "addArrayItem",
      target: "nebenantragAbsatzDaten",
    },
    {
      type: "addArrayItem",
      target: "nebenantragAugenscheinDaten",
    },
    {
      type: "addArrayItem",
      target: "nebenantragUrkundeDaten",
    },
    {
      type: "addArrayItem",
      target: "nebenantragSachverstaendigengutachtenDaten",
    },
    { target: "antraegeUebersicht" },
  ],
  nebenantragAbsatzDaten: [{ target: "nebenantragAbsatzUebersicht" }],
  nebenantragAugenscheinDaten: [{ target: "nebenantragAbsatzUebersicht" }],
  nebenantragUrkundeDaten: [{ target: "nebenantragAbsatzUebersicht" }],
  nebenantragSachverstaendigengutachtenDaten: [
    { target: "nebenantragAbsatzUebersicht" },
  ],
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
