import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const tatsachenvortragFlowConfig = {
  tatsachenvortragBeweiseUebersicht: "rechtlicheWuerdigung",
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
