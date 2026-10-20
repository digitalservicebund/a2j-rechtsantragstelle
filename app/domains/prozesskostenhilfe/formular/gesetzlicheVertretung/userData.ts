import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type pkhFormularGesetzlicheVertretungPages } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/pages";

export type ProzesskostenhilfeGesetzlicheVertretungUserData = InferredUserData<
  typeof pkhFormularGesetzlicheVertretungPages
>;
