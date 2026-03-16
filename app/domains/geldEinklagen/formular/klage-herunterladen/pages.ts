import type { PagesConfig } from "~/domains/pageSchemas";

export const geldEinklagenKlageHerunterladenPages = {
  klageHerunterladenIntroStart: {
    stepId: "klage-herunterladen/intro/start",
  },
  klageHerunterladenIntroStartAnwaltschaft: {
    stepId: "klage-herunterladen/intro/start-anwaltschaft",
  },
} as const satisfies PagesConfig;
