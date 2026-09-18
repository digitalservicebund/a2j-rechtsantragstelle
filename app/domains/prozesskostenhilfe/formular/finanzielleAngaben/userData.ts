import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";
import { type PageData } from "~/services/flow/pageData";

export type ProzesskostenhilfeFinanzielleAngabenUserData = InferredUserData<
  typeof pkhFormularFinanzielleAngabenPages
> & {
  pageData?: PageData;
};
