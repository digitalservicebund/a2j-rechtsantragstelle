import { type PagesConfig } from "~/domains/pageSchemas";
import { berHAntragAbgabePages } from "./abgabe/pages";
import { berHAntragAnwaltlicheVertretungPages } from "./anwaltlicheVertretung/pages";
import { berhAntragFinanzielleAngabenPages } from "./finanzielleAngaben/pages";
import { berHAntragGrundvoraussetzungenPages } from "./grundvoraussetzung/pages";
import { berHAntragPersoenlicheDatenPages } from "./persoenlicheDaten/pages";
import { berHAntragRechtsproblemPages } from "./rechtsproblem/pages";
import { berHAntragWeitereAngabenPages } from "./weitereAngaben/pages";

export const beratungshilfeAntragPages = {
  start: {
    // The old XState config wrapped this in a compound "start" state, so the
    // page's real (CMS) URL is /start/start. Kept as-is to match existing content.
    stepId: "start/start",
  },
  ...berHAntragGrundvoraussetzungenPages,
  ...berHAntragAnwaltlicheVertretungPages,
  ...berHAntragRechtsproblemPages,
  ...berhAntragFinanzielleAngabenPages,
  ...berHAntragPersoenlicheDatenPages,
  ...berHAntragWeitereAngabenPages,
  ...berHAntragAbgabePages,
} as const satisfies PagesConfig;

export type BeratungshilfeFormularPages = typeof beratungshilfeAntragPages;
