import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const beklagteParteiFlowConfig = {
  beklagteUebersicht: "prozessualeAusfuehrungen", // TODO: Wire up to Prozessbevollmächtigte
  beklagteNatuerlichePerson: null,
  beklagteOrganisation: null,
} satisfies Partial<TransitionConfigMap<GeldEinklagenAnwaltschaftPages>>;
