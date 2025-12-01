import { fluggastrechteAbgabePages } from "~/domains/fluggastrechte/formular/abgabe/pages";
import { fluggastrechteIntroPages } from "~/domains/fluggastrechte/formular/intro/pages";
import { fluggastrechtePersoenlicheDatenPages } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";
import { fluggastrechteProzessfuehrungPages } from "~/domains/fluggastrechte/formular/prozessfuehrung/pages";
import { fluggastrechteStreitwertKostenPages } from "~/domains/fluggastrechte/formular/streitwertKosten/pages";
import { fluggastrechteZusammenfassungPages } from "~/domains/fluggastrechte/formular/zusammenfassung/pages";
import { type PagesConfig } from "~/domains/pageSchemas";

export const fluggastrechteFormularPages = {
  ...fluggastrechteIntroPages,
  ...fluggastrechteStreitwertKostenPages,
  ...fluggastrechtePersoenlicheDatenPages,
  ...fluggastrechteProzessfuehrungPages,
  ...fluggastrechteZusammenfassungPages,
  ...fluggastrechteAbgabePages,
} as const satisfies PagesConfig;
