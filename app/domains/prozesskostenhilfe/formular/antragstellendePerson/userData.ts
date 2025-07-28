import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularAntragstellendePersonPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/pages";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";

export type ProzesskostenhilfeAntragstellendePersonUserData =
  UserDataFromPagesSchema<typeof pkhFormularAntragstellendePersonPages> &
    ProzesskostenhilfeVereinfachteErklaerungUserData;
