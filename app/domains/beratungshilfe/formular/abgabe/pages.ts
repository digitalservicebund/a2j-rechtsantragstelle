import { z } from "zod";
import { type PagesConfig } from "~/services/flow/flowEngine/types";

export const berHAntragAbgabePages = {
  ueberpruefung: {
    stepId: "/abgabe/ueberpruefung",
  },
  art: {
    stepId: "/abgabe/art",
    pageSchema: {
      abgabeArt: z.enum(["online", "ausdrucken"]),
    },
  },
  zusammenfassung: {
    stepId: "/abgabe/zusammenfassung",
  },
  ausdrucken: {
    stepId: "/abgabe/ausdrucken",
  },
  online: {
    stepId: "/abgabe/online",
  },
} as const satisfies PagesConfig;
