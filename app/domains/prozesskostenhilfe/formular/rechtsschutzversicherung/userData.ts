import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularRechtsschutzversicherungPages } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/pages";

export type ProzesskostenhilfeRechtsschutzversicherungUserData =
  InferredUserData<typeof pkhFormularRechtsschutzversicherungPages>;
