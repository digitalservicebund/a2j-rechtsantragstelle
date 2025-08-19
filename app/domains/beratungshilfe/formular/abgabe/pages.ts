import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { berHAntragDokumentePages } from "./dokumente/pages";

export const berHAntragAbgabePages = {
  abgabe: {
    stepId: "abgabe",
  },
  ueberpruefung: {
    stepId: "abgabe/ueberpruefung",
  },
  zusammenfassung: {
    stepId: "abgabe/zusammenfassung",
  },
  art: {
    stepId: "abgabe/art",
    pageSchema: {
      abgabeArt: z.enum(["online", "ausdrucken"], customRequiredErrorMessage),
    },
  },
  ...berHAntragDokumentePages,
  ausdrucken: {
    stepId: "abgabe/ausdrucken",
  },
  online: {
    stepId: "abgabe/online",
  },
} as const satisfies PagesConfig;
