import type { PagesConfig } from "~/services/flow/flowEngine/types";

export const geldEinklagenVersandVorbereitenPages = {
  versandVorbereitenKlageHerunterladenStart: {
    stepId: "/versand-vorbereiten/klage-herunterladen/start",
  },
  versandVorbereitenKlageVersendenAnleitung: {
    stepId: "/versand-vorbereiten/klage-versenden/anleitung",
  },
  versandVorbereitenKlageVersendenAnleitungAnwaltschaft: {
    stepId: "/versand-vorbereiten/klage-versenden/anleitung-anwaltschaft",
  },
} as const satisfies PagesConfig;
