import { type pkhFormularFinanzielleAngabenAbzuegePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type PageData } from "~/services/flow/pageData";

export type ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData =
  InferredUserData<typeof pkhFormularFinanzielleAngabenAbzuegePages> & {
    pageData?: PageData;
  };
