import { type UserDataFromPagesSchema } from "~/domains/types";
import { type pkhFormularAntragstellendePersonPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/pages";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";

export type ProzesskostenhilfeAntragstellendePersonUserData =
  UserDataFromPagesSchema<typeof pkhFormularAntragstellendePersonPages> &
    ProzesskostenhilfeVereinfachteErklaerungUserData;
