import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";

export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData =
  InferredUserData<typeof pkhFormularFinanzielleAngabenEinkuenftePages>;
