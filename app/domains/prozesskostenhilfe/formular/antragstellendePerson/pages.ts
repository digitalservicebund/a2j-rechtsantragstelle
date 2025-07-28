import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularVereinfachteErklaerungPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/pages";

export const pkhFormularAntragstellendePersonPages = {
  ...pkhFormularVereinfachteErklaerungPages,
} as const satisfies PagesConfig;
