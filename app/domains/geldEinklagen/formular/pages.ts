import { type PagesConfig } from "~/services/flow/flowEngine/types";
import { geldEinklagenGerichtPruefenPages } from "./gericht-pruefen/pages";
import { geldEinklagenKlageErstellenPages } from "./klage-erstellen/pages";
import { geldEinklagenVersandVorbereitenPages } from "./versand-vorbereiten/pages";

export const geldEinklagenFormularPages = {
  ...geldEinklagenGerichtPruefenPages,
  ...geldEinklagenKlageErstellenPages,
  ...geldEinklagenVersandVorbereitenPages,
} as const satisfies PagesConfig;
