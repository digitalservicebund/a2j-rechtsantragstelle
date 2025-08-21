import { type PagesConfig } from "~/domains/pageSchemas";
import { berHAntragAnwaltlicheVertretungPages } from "./anwaltlicheVertretung/pages";
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
  ...berHAntragWeitereAngabenPages,
} as const satisfies PagesConfig;
