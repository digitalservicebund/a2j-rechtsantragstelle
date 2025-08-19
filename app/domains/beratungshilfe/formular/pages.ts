import { type PagesConfig } from "~/domains/pageSchemas";
import { berHAntragAnwaltlicheVertretungPages } from "./anwaltlicheVertretung/pages";
import { berHAntragGrundvoraussetzungenPages } from "./grundvoraussetzung/pages";
import { berHAntragPersoenlicheDatenPages } from "./persoenlicheDaten/pages";
import { berHAntragRechtsproblemPages } from "./rechtsproblem/pages";

export const beratungshilfeAntragPages = {
  start: {
    stepId: "start",
  },
  ...berHAntragGrundvoraussetzungenPages,
  ...berHAntragRechtsproblemPages,
  ...berHAntragAnwaltlicheVertretungPages,
  ...berHAntragPersoenlicheDatenPages,
} as const satisfies PagesConfig;
