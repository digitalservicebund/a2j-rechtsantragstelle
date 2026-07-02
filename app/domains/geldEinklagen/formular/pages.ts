import { type PagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenGerichtPruefenPages } from "./gericht-pruefen/pages";
import { geldEinklagenKlageErstellenPages } from "./klage-erstellen/pages";
import { geldEinklagenKlageHerunterladenPages } from "./klage-herunterladen/pages";

export const geldEinklagenFormularPages = {
  ...geldEinklagenGerichtPruefenPages,
  ...geldEinklagenKlageErstellenPages,
  ...geldEinklagenKlageHerunterladenPages,
} as const satisfies PagesConfig;
