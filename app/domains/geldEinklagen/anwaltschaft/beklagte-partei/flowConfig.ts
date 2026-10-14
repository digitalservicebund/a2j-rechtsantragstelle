import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const beklagteParteiFlowConfig = {
  beklagteUebersicht: "downloadKlage", // TODO: Wire up to Prozessbevollmächtigte
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
