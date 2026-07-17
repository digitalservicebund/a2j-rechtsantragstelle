import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const ehepartnerFlowConfig = {
  spouseName: null,
  spouseHasDifferentAddress: null,
  spouseSterbedatumOrt: null,
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
