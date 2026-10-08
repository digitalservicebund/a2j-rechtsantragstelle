import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularGesetzlicheVertretungPages } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/pages";

export type ProzesskostenhilfeGesetzlicheVertretungUserData = InferredUserData<
  typeof pkhFormularGesetzlicheVertretungPages
>;
