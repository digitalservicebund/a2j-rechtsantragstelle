import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularAntragstellendePersonPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/pages";
import { pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";
import { pkhFormularGrundvoraussetzungenPages } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/pages";
import { pkhFormularRechtsschutzversicherungPages } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/pages";

export const prozesskostenhilfeFormularPages = {
  start: {
    stepId: "start",
  },
  ...pkhFormularGrundvoraussetzungenPages,
  ...pkhFormularAntragstellendePersonPages,
  ...pkhFormularRechtsschutzversicherungPages,
  ...pkhFormularFinanzielleAngabenPages,
} as const satisfies PagesConfig;
