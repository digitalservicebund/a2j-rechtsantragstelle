import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularDokumentePages } from "~/domains/prozesskostenhilfe/formular/abgabe/dokumente/pages";

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
  ...pkhFormularDokumentePages,
  ende: {
    stepId: "abgabe/ende",
  },
} as const satisfies PagesConfig;
