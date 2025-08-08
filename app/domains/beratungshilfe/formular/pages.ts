import { type PagesConfig } from "~/domains/pageSchemas";
import { persoenlicheDatenPages } from "~/domains/shared/formular/persoenlicheDaten/pages";
import { berHAntragAnwaltlicheVertretungPages } from "./anwaltlicheVertretung/pages";
import { berHAntragGrundvoraussetzungenPages } from "./grundvoraussetzung/pages";
import { berHAntragRechtsproblemPages } from "./rechtsproblem/pages";

export const beratungshilfeAntragPages = {
  start: {
    stepId: "start",
  },
  ...berHAntragGrundvoraussetzungenPages,
  ...berHAntragRechtsproblemPages,
  ...berHAntragAnwaltlicheVertretungPages,
  ...persoenlicheDatenPages,
} as const satisfies PagesConfig;
