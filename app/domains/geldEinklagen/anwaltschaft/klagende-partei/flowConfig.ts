import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const klagendeParteiFlowConfig = {
  klagendeUebersicht: "prozessualeAusfuehrungen", // TODO: Wire up to Prozessbevollmächtigte
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
