import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularAntragstellendePersonPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/pages";
import { pkhFormularGrundvoraussetzungenPages } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/pages";

export const prozesskostenhilfeFormularPages = {
  start: {
    stepId: "start",
  },
  ...pkhFormularGrundvoraussetzungenPages,
  ...pkhFormularAntragstellendePersonPages,
} as const satisfies PagesConfig;
