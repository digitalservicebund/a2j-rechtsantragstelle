import type { PagesConfig } from "~/domains/pageSchemas";
export const fluggastrechteIntroPages = {
  intro: {
    stepId: "intro/start",
  },
  redirectVorabcheckErgebnis: {
    stepId: "intro/redirect-vorabcheck-ergebnis",
  },
} satisfies PagesConfig;
