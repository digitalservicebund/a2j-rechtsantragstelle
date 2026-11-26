import { type PagesConfig } from "~/services/flow/flowEngine/types";

export const fluggastrechteIntroPages = {
  intro: {
    stepId: "/intro/start",
  },
  redirectVorabcheckErgebnis: {
    stepId: "/intro/redirect-vorabcheck-ergebnis",
  },
} satisfies PagesConfig;
