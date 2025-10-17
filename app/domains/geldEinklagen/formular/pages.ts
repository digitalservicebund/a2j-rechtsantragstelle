import { type PagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenGerichtPruefenPages } from "./gericht-pruefen/pages";

export const geldEinklagenFormularPages = {
  ...geldEinklagenGerichtPruefenPages,
} as const satisfies PagesConfig;
