import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularAbgabePages } from "~/domains/prozesskostenhilfe/formular/abgabe/pages";
import { pkhFormularGesetzlicheVertretungPages } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/pages";
import { pkhFormularWeitereAngabenPages } from "~/domains/prozesskostenhilfe/formular/weitereAngaben/pages";
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
  ...pkhFormularWeitereAngabenPages,
  ...pkhFormularAbgabePages,
} as const satisfies PagesConfig;
