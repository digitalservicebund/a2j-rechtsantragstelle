import { type PagesConfig } from "~/domains/pageSchemas";
import { berHAntragAbgabePages } from "./abgabe/pages";
import { berHAntragAnwaltlicheVertretungPages } from "./anwaltlicheVertretung/pages";
import { berhAntragFinanzielleAngabenPages } from "./finanzielleAngaben/pages";
import { berHAntragGrundvoraussetzungenPages } from "./grundvoraussetzung/pages";
import { berHAntragRechtsproblemPages } from "./rechtsproblem/pages";
import { berHAntragWeitereAngabenPages } from "./weitereAngaben/pages";

export const beratungshilfeAntragPages = {
  start: {
    stepId: "start",
  },
  ...berHAntragGrundvoraussetzungenPages,
  ...berHAntragRechtsproblemPages,
  ...berHAntragAnwaltlicheVertretungPages,
  ...berhAntragFinanzielleAngabenPages,
  ...berHAntragWeitereAngabenPages,
  ...berHAntragAbgabePages,
} as const satisfies PagesConfig;
