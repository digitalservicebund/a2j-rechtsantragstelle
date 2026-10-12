import { type pkhFormularVereinfachteErklaerungPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";

export type ProzesskostenhilfeVereinfachteErklaerungUserData = InferredUserData<
  typeof pkhFormularVereinfachteErklaerungPages
>;
