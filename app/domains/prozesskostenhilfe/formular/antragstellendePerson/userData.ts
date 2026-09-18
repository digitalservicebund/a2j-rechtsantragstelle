import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type pkhFormularAntragstellendePersonPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/pages";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";

export type ProzesskostenhilfeAntragstellendePersonUserData = InferredUserData<
  typeof pkhFormularAntragstellendePersonPages
> &
  ProzesskostenhilfeVereinfachteErklaerungUserData;
