import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";

export type ProzesskostenhilfeFinanzielleAngabenUserData = InferredUserData<
  typeof pkhFormularFinanzielleAngabenPages
>;
