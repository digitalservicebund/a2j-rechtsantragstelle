import type { PagesConfig } from "~/domains/types";

export const fluggastrechteIntroPages = {
  intro: {
    stepId: "intro/start",
  },
  redirectVorabcheckErgebnis: {
    stepId: "intro/redirect-vorabcheck-ergebnis",
  },
} satisfies PagesConfig;
