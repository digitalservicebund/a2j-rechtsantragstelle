import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularGesetzlicheVertretungPages } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/pages";
import { pkhFormularAntragstellendePersonPages } from "./antragstellendePerson/pages";
import { pkhFormularFinanzielleAngabenPages } from "./finanzielleAngaben/pages";
import { pkhFormularGrundvoraussetzungenPages } from "./grundvoraussetzungen/pages";
import { pkhFormularRechtsschutzversicherungPages } from "./rechtsschutzversicherung/pages";

export const prozesskostenhilfeFormularPages = {
  start: {
    stepId: "start",
  },
  ...pkhFormularGrundvoraussetzungenPages,
  ...pkhFormularRechtsschutzversicherungPages,
  ...pkhFormularFinanzielleAngabenPages,
  ...pkhFormularGesetzlicheVertretungPages,
  ...pkhFormularAntragstellendePersonPages,
} as const satisfies PagesConfig;
