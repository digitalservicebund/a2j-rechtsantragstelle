import { type PagesConfig } from "~/domains/pageSchemas";
import { berHAntragGrundvoraussetzungenPages } from "./grundvoraussetzung/pages";
import { berHAntragRechtsproblemPages } from "./rechtsproblem/pages";

export const beratungshilfeAntragPages = {
  start: {
    stepId: "start",
  },
  ...berHAntragGrundvoraussetzungenPages,
  ...berHAntragRechtsproblemPages,
} as const satisfies PagesConfig;
