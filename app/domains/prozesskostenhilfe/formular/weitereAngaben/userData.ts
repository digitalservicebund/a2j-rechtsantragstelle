import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularWeitereAngabenPages } from "~/domains/prozesskostenhilfe/formular/weitereAngaben/pages";

export type ProzesskostenhilfeWeitereAngabenUserData = InferredUserData<
  typeof pkhFormularWeitereAngabenPages
>;
