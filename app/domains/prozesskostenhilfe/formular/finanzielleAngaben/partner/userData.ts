import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import { type PageData } from "~/services/flow/pageData";

export type PartnerEinkuenfteUserData = InferredUserData<
  typeof pkhFormularFinanzielleAngabenPartnerPages
> & { pageData?: PageData };
