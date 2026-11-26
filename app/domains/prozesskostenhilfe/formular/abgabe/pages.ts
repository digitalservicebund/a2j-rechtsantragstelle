import { type PagesConfig } from "~/services/flow/flowEngine/types";

export const pkhFormularAbgabePages = {
  abgabe: {
    stepId: "/abgabe",
  },
  abgabeUeberpruefung: {
    stepId: "/abgabe/ueberpruefung",
  },
  zusammenfassung: {
    stepId: "/abgabe/zusammenfassung",
  },
  ende: {
    stepId: "/abgabe/ende",
  },
} as const satisfies PagesConfig;
