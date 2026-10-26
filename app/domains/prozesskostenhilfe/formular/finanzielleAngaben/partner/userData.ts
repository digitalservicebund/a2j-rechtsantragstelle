import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";

export type PartnerEinkuenfteUserData = InferredUserData<
  typeof pkhFormularFinanzielleAngabenPartnerPages
>;
