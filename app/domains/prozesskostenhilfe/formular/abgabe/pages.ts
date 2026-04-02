import { type PagesConfig } from "~/domains/pageSchemas";

export const pkhFormularAbgabePages = {
  abgabe: {
    stepId: "abgabe",
  },
  abgabeUeberpruefung: {
    stepId: "abgabe/ueberpruefung",
  },
  zusammenfassung: {
    stepId: "abgabe/zusammenfassung",
  },
  ende: {
    stepId: "abgabe/ende",
  },
} as const satisfies PagesConfig;
