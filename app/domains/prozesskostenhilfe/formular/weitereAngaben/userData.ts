import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type pkhFormularWeitereAngabenPages } from "~/domains/prozesskostenhilfe/formular/weitereAngaben/pages";

export type ProzesskostenhilfeWeitereAngabenUserData = InferredUserData<
  typeof pkhFormularWeitereAngabenPages
>;
