import { type PagesConfig } from "~/domains/types";
import { geldEinklagenGerichtPruefenPages } from "./gericht-pruefen/pages";
import { geldEinklagenKlageErstellenPages } from "./klage-erstellen/pages";

export const geldEinklagenFormularPages = {
  ...geldEinklagenGerichtPruefenPages,
  ...geldEinklagenKlageErstellenPages,
} as const satisfies PagesConfig;
