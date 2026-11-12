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
import { setBeweisIdentity } from "~/domains/geldEinklagen/anwaltschaft/services/setBeweisIdentity";
import { setGesetzlicheVertretungIdentity } from "~/domains/geldEinklagen/anwaltschaft/services/setGesetzlicheVertretungIdentity";
import { setNebenantragType } from "~/domains/geldEinklagen/anwaltschaft/services/setNebenantragType";

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
    "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/nebenantraege/#/daten":
      setNebenantragType("nebenantrag"),
    "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/annahmeverzug/#/daten":
      setNebenantragType("annahmeverzug"),
    "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/augenschein-daten":
      setBeweisIdentity("augenschein", true),
    "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/augenschein-daten":
      setBeweisIdentity("augenschein", false),
    "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/urkunde-daten":
      setBeweisIdentity("urkunde", true),
    "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/urkunde-daten":
      setBeweisIdentity("urkunde", false),
    "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/sachverstaendigengutachten-daten":
      setBeweisIdentity("sachverstaendigengutachten", true),
    "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/sachverstaendigengutachten-daten":
      setBeweisIdentity("sachverstaendigengutachten", false),
    "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/zeuge-daten":
      setBeweisIdentity("zeuge", true),
    "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/zeuge-daten":
      setBeweisIdentity("zeuge", false),
    "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/parteivernehmung-daten":
      setBeweisIdentity("parteivernehmung", true),
    "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/parteivernehmung-daten":
      setBeweisIdentity("parteivernehmung", false),
  },
  config: geldEinklagenAnwaltschaftFlowConfig,
  pdfConfig: {
    pdfFunction: async (userData: GeldEinklagenAnwaltschaftUserData) =>
      await geldEinklagenAnwaltschaftPdfFromUserdata(userData),
    name: `Geld_Einklagen_Klage`,
  },
} satisfies Flow<typeof geldEinklagenAnwaltschaftFlowConfig.pages>;
