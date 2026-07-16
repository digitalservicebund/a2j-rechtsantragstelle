import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const angehoerigeFlowConfig = {
  angehoerigeOverview: null,
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
