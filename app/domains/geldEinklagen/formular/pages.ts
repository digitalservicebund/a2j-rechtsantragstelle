import { type PagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenGerichtPruefenPages } from "./gericht-pruefen/pages";
import { geldEinklagenKlageErstellenPages } from "./klage-erstellen/pages";

export const geldEinklagenFormularPages = {
  ...geldEinklagenGerichtPruefenPages,
  ...geldEinklagenKlageErstellenPages,
} as const satisfies PagesConfig;
