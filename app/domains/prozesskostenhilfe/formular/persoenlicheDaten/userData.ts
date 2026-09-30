import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularPersoenlicheDatenPages } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/pages";

export type ProzesskostenhilfePersoenlicheDatenUserData = InferredUserData<
  typeof pkhFormularPersoenlicheDatenPages
>;
