import { type UserDataFromPagesSchema } from "~/domains/types";
import { type pkhFormularVereinfachteErklaerungPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/pages";

export type ProzesskostenhilfeVereinfachteErklaerungUserData =
  UserDataFromPagesSchema<typeof pkhFormularVereinfachteErklaerungPages>;
