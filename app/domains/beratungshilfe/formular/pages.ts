import { type PagesConfig } from "~/domains/pageSchemas";
import { berHAntragAnwaltlicheVertretungPages } from "./anwaltlicheVertretung/pages";
import { berhAntragFinanzielleAngabenPages } from "./finanzielleAngaben/pages";
import { berHAntragGrundvoraussetzungenPages } from "./grundvoraussetzung/pages";
import { berHAntragRechtsproblemPages } from "./rechtsproblem/pages";

export const beratungshilfeAntragPages = {
  start: {
    stepId: "start",
  },
  ...berHAntragGrundvoraussetzungenPages,
  ...berHAntragRechtsproblemPages,
  ...berHAntragAnwaltlicheVertretungPages,
  ...berhAntragFinanzielleAngabenPages,
} as const satisfies PagesConfig;
