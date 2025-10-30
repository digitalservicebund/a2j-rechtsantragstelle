import {
  grundeigentumIsBewohnt,
  hasGrundeigentumYes,
  hasKraftfahrzeugYes,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftYes,
  hasWeitereUnterhaltszahlungenYes,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
  hasWertsacheYes,
  isGeldanlageBargeld,
  isGeldanlageBefristet,
  isGeldanlageForderung,
  isGeldanlageGiroTagesgeldSparkonto,
  isGeldanlageGuthabenkontoKrypto,
  isGeldanlageSonstiges,
  isGeldanlageWertpapiere,
  isKraftfahrzeugWertAbove10000OrUnsure,
  isValidKinderArrayIndex,
  kindEigeneEinnahmenYes,
  kindUnterhaltNo,
  kindUnterhaltYes,
  kindWohnortBeiAntragstellerNo,
  kindWohnortBeiAntragstellerYes,
} from "~/domains/shared/formular/finanzielleAngaben/guards";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { ausgabenDone } from "./doneFunctions";
import { type ProzesskostenhilfeFinanzielleAngabenUserData } from "./userData";
import { yesNoGuards, type Guards } from "../../../guards.server";
import { kinderArraySchema } from "./kinder/pages";
import { eigentumDone } from "./eigentum/doneFunctions";

export const finanzielleAngabeGuards = {
  eigentumDone,
  hasPartnerschaftYes,
  hasPartnerschaftNo: ({ context }) => context.partnerschaft !== "yes",
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
  ...yesNoGuards("erwerbstaetig"),
  ...yesNoGuards("zusammenleben"),
  ...yesNoGuards("unterhalt"),
  ...yesNoGuards("partnerEinkommen"),
  ...yesNoGuards("partnerHasBesondersAusgaben"),
  hasKraftfahrzeugYes,
  hasGrundeigentumYes,
  hasWertsacheYes,
  hasWeitereUnterhaltszahlungenYes,
  kindWohnortBeiAntragstellerYes,
  kindWohnortBeiAntragstellerNo,
  kindEigeneEinnahmenYes,
  kindUnterhaltYes,
  kindUnterhaltNo,
  isValidKinderArrayIndex,
  isGeldanlageBargeld,
  isGeldanlageWertpapiere,
  isGeldanlageGuthabenkontoKrypto,
  isGeldanlageGiroTagesgeldSparkonto,
  isGeldanlageBefristet,
  isGeldanlageForderung,
  isGeldanlageSonstiges,
  isKraftfahrzeugWertAbove10000OrUnsure,
  grundeigentumIsBewohnt,

  eigentumYesAndEmptyArray: ({ context }) =>
    (context.hasBankkonto === "yes" && !arrayIsNonEmpty(context.bankkonten)) ||
    (context.hasGeldanlage === "yes" &&
      !arrayIsNonEmpty(context.geldanlagen)) ||
    (hasWertsacheYes({ context }) && !arrayIsNonEmpty(context.wertsachen)) ||
    (hasKraftfahrzeugYes({ context }) &&
      !arrayIsNonEmpty(context.kraftfahrzeuge)) ||
    (hasGrundeigentumYes({ context }) &&
      !arrayIsNonEmpty(context.grundeigentum)),

  hasKinderYesAndEmptyArray: ({ context }) =>
    context.hasKinder === "yes" &&
    !kinderArraySchema.safeParse(context.kinder).success,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
  isSonstigeVersicherung: ({ context: { pageData, versicherungen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return versicherungen?.at(arrayIndex)?.art === "sonstige";
  },
  sonstigeAusgabeAnteiligYes: ({ context: { pageData, sonstigeAusgaben } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return sonstigeAusgaben?.at(arrayIndex)?.zahlungspflichtiger !== "myself";
  },
  ratenzahlungAnteiligYes: ({ context: { pageData, ratenzahlungen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return ratenzahlungen?.at(arrayIndex)?.zahlungspflichtiger !== "myself";
  },
  ausgabenDone,
} satisfies Guards<ProzesskostenhilfeFinanzielleAngabenUserData>;
