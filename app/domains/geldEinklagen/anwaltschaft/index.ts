import type { Flow } from "~/domains/flows.server";
import { setPartyType } from "~/domains/geldEinklagen/anwaltschaft/services/setPartyType";
import { setProzessbevollmaechtigteType } from "./services/setProzessbevollmaechtigteType";
import {
  getBeklagteStrings,
  getKanzleiStrings,
  getKlagendeStrings,
  getAntraegeStrings,
} from "~/domains/geldEinklagen/anwaltschaft/stringReplacements";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getArrayIndexStrings } from "~/domains/shared/formular/stringReplacements";
import { geldEinklagenAnwaltschaftFlowConfig } from "./flowConfig";
import { geldEinklagenAnwaltschaftPdfFromUserdata } from "./services/pdf/geldEinklagenAnwaltschaftPdfFromUserData";

export const geldEinklagenAnwaltschaft = {
  flowType: "formFlow",
  stringReplacements: (context: GeldEinklagenAnwaltschaftUserData) => ({
    ...getArrayIndexStrings(context),
    ...getKlagendeStrings(context),
    ...getBeklagteStrings(context),
    ...getKanzleiStrings(context),
    ...getAntraegeStrings(context),
  }),
  posFlowActions: {
    "/klagende-partei/klagenden/#/natuerliche-person-daten": setPartyType(
      "klagende",
      "natuerliche-person",
    ),
    "/klagende-partei/klagenden/#/organisation-daten": setPartyType(
      "klagende",
      "organisation",
    ),
    "/klagende-partei/prozessbevollmaechtigte/#/einzelkanzlei-daten":
      setProzessbevollmaechtigteType("klagende", "einzelkanzlei"),
    "/klagende-partei/prozessbevollmaechtigte/#/berufsausuebungsgesellschaft-daten":
      setProzessbevollmaechtigteType(
        "klagende",
        "berufsausuebungsgesellschaft",
      ),
    "/beklagte-partei/beklagten/#/natuerliche-person-daten": setPartyType(
      "beklagte",
      "natuerliche-person",
    ),
    "/beklagte-partei/beklagten/#/organisation-daten": setPartyType(
      "beklagte",
      "organisation",
    ),
    "/beklagte-partei/prozessbevollmaechtigte/#/einzelkanzlei-daten":
      setProzessbevollmaechtigteType("beklagte", "einzelkanzlei"),
    "/beklagte-partei/prozessbevollmaechtigte/#/berufsausuebungsgesellschaft-daten":
      setProzessbevollmaechtigteType(
        "beklagte",
        "berufsausuebungsgesellschaft",
      ),
  },
  config: geldEinklagenAnwaltschaftFlowConfig,
  pdfConfig: {
    pdfFunction: async (userData: GeldEinklagenAnwaltschaftUserData) =>
      await geldEinklagenAnwaltschaftPdfFromUserdata(userData),
    name: `Geld_Einklagen_Klage`,
  },
} satisfies Flow<typeof geldEinklagenAnwaltschaftFlowConfig.pages>;
