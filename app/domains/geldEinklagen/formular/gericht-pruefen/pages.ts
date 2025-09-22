import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";

export const geldEinklagenGerichtPruefenPages = {
  introIntro: {
    stepId: "gericht-pruefen/intro/intro",
  },
  introStart: {
    stepId: "gericht-pruefen/intro/start",
  },
  forderungFragen: {
    stepId: "gericht-pruefen/forderung/fragen",
    pageSchema: { forderung: z.enum(["maximal5000", "etwasAnderes"]) },
  },
  forderungErrorEtwasAnderes: {
    stepId: "gericht-pruefen/ergebnis/forderung/etwas-anderes",
  },
} as const satisfies PagesConfig;
