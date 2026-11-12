import type { Flow } from "~/domains/flows.server";
import { setPartyType } from "~/domains/geldEinklagen/anwaltschaft/services/setPartyType";
import { setProzessbevollmaechtigteType } from "./services/setProzessbevollmaechtigteType";
import {
  getBeklagteStrings,
  getKanzleiStrings,
  getKlagendeStrings,
} from "~/domains/geldEinklagen/anwaltschaft/stringReplacements";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getArrayIndexStrings } from "~/domains/shared/formular/stringReplacements";
import { geldEinklagenAnwaltschaftFlowConfig } from "./flowConfig";
import { geldEinklagenAnwaltschaftPdfFromUserdata } from "./services/pdf/geldEinklagenAnwaltschaftPdfFromUserData";
import { setBeweisIdentity } from "~/domains/geldEinklagen/anwaltschaft/services/setBeweisIdentity";
import { setGesetzlicheVertretungIdentity } from "~/domains/geldEinklagen/anwaltschaft/services/setGesetzlicheVertretungIdentity";
import { setNebenantragIdentity } from "~/domains/geldEinklagen/anwaltschaft/services/setNebenantragIdentity";
import { setAntragId } from "~/domains/geldEinklagen/anwaltschaft/services/setAntragId";

export const geldEinklagenAnwaltschaft = {
  flowType: "formFlow",
  stringReplacements: (context: GeldEinklagenAnwaltschaftUserData) => ({
    ...getArrayIndexStrings(context),
    ...getKlagendeStrings(context),
    ...getBeklagteStrings(context),
    ...getKanzleiStrings(context),
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
    "/klagende-partei/klagenden/#/gesetzliche-vertretung/#/daten":
      setGesetzlicheVertretungIdentity("klagende"),
    "/klagende-partei/klagenden/#/gesetzliche-vertretung/#/daten-organisation":
      setGesetzlicheVertretungIdentity("klagende"),
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
    "/beklagte-partei/beklagten/#/gesetzliche-vertretung/#/daten":
      setGesetzlicheVertretungIdentity("beklagte"),
    "/beklagte-partei/beklagten/#/gesetzliche-vertretung/#/daten-organisation":
      setGesetzlicheVertretungIdentity("beklagte"),
    "/beklagte-partei/prozessbevollmaechtigte/#/einzelkanzlei-daten":
      setProzessbevollmaechtigteType("beklagte", "einzelkanzlei"),
    "/beklagte-partei/prozessbevollmaechtigte/#/berufsausuebungsgesellschaft-daten":
      setProzessbevollmaechtigteType(
        "beklagte",
        "berufsausuebungsgesellschaft",
      ),
    "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/hauptantrag/#/daten":
      setAntragId("hauptantrag"),
    "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege/#/daten":
      setAntragId("schmerzengeldantrag"),
    "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/#/nebenantraege/#/daten":
      setAntragId("schmerzengeldantrag#nebenantraege"),
    "/sonstige-antraege/antrag/#/daten": setAntragId("sonstigeAntraege"),
    "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/nebenantraege/#/daten":
      setNebenantragIdentity("nebenantrag"),
    "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/annahmeverzug/#/daten":
      setNebenantragIdentity("annahmeverzug"),
    "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/augenschein-daten":
      setBeweisIdentity("augenschein"),
    "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/urkunde-daten":
      setBeweisIdentity("urkunde"),
    "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/sachverstaendigengutachten-daten":
      setBeweisIdentity("sachverstaendigengutachten"),
    "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/zeuge-daten":
      setBeweisIdentity("zeuge"),
    "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/parteivernehmung-daten":
      setBeweisIdentity("parteivernehmung"),
  },
  config: geldEinklagenAnwaltschaftFlowConfig,
  pdfConfig: {
    pdfFunction: async (userData: GeldEinklagenAnwaltschaftUserData) =>
      await geldEinklagenAnwaltschaftPdfFromUserdata(userData),
    name: `Geld_Einklagen_Klage`,
  },
} satisfies Flow<typeof geldEinklagenAnwaltschaftFlowConfig.pages>;
