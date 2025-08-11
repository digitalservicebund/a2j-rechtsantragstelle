import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenPages } from "./finanzielleAngaben/pages";
import { pkhFormularGrundvoraussetzungenPages } from "./grundvoraussetzungen/pages";
import { pkhFormularRechtsschutzversicherungPages } from "./rechtsschutzversicherung/pages";
import { pkhFormularAntragstellendePersonPages } from "./antragstellendePerson/pages";

export const prozesskostenhilfeFormularPages = {
  start: {
    stepId: "start",
  },
  ...pkhFormularGrundvoraussetzungenPages,
  ...pkhFormularRechtsschutzversicherungPages,
  ...pkhFormularFinanzielleAngabenPages,
  ...pkhFormularAntragstellendePersonPages,
} as const satisfies PagesConfig;
