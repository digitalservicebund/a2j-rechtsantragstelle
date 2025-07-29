import { type PagesConfig } from "~/domains/pageSchemas";
import { berHAntragGrundvoraussetzungenPages } from "./grundvoraussetzung/pages";

export const beratungshilfeAntragPages = {
  start: {
    stepId: "start",
  },
  ...berHAntragGrundvoraussetzungenPages,
} as const satisfies PagesConfig;
