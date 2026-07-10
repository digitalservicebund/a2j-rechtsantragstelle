import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type NachlassErbscheinAnfragePages } from "../pages";

export const antragstellendePersonFlowConfig = {
  antragstellendePersonName: null,
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
