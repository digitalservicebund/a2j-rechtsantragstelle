import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularAntragstellendePersonPages } from "./antragstellendePerson/pages";
import { pkhFormularGrundvoraussetzungenPages } from "./grundvoraussetzungen/pages";
import { pkhFormularRechtsschutzversicherungPages } from "./rechtsschutzversicherung/pages";

export const prozesskostenhilfeFormularPages = {
  start: {
    stepId: "start",
  },
  ...pkhFormularGrundvoraussetzungenPages,
  ...pkhFormularAntragstellendePersonPages,
  ...pkhFormularRechtsschutzversicherungPages,
} as const satisfies PagesConfig;
