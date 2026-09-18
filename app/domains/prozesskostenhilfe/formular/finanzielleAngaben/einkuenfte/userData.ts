import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";
import { type PageData } from "~/services/flow/pageData";

export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData =
  InferredUserData<typeof pkhFormularFinanzielleAngabenEinkuenftePages> & {
    pageData?: PageData;
  };
