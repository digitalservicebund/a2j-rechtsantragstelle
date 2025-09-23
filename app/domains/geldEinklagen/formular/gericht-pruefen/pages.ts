import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const geldEinklagenGerichtPruefenPages = {
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
  sachgebietInfo: {
    stepId: "gericht-pruefen/sachgebiet/info",
  },
  sachgebietAusgeschlossen: {
    stepId: "gericht-pruefen/sachgebiet/ausgeschlossen",
    pageSchema: { sachgebietAusgeschlossen: YesNoAnswer },
  },
  sachgebietBesondere: {
    stepId: "gericht-pruefen/sachgebiet/besondere",
    pageSchema: {
      besondere: z.enum([
        "miete",
        "versicherung",
        "schaden",
        "reisen",
        "verkehrsunfall",
        "urheberrecht",
        "anderesRechtsproblem",
      ]),
    },
  },
} as const satisfies PagesConfig;
