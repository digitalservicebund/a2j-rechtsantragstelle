import {
  grundeigentumIsBewohnt,
  hasAusgabenYes,
  hasBankkontoYes,
  hasGeldanlageYes,
  hasGrundeigentumYes,
  hasKinderYes,
  hasKinderYesAndEmptyArray,
  hasKraftfahrzeugYes,
  hasPartnerschaftYesAndZusammenlebenNo,
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
import {
  prozesskostenhilfeFinanzielleAngabenContext,
  type ProzesskostenhilfeFinanzielleAngabenContext,
} from "./context";
import { ausgabenDone } from "./doneFunctions";
import { eigentumDone } from "./eigentumDone";
import { yesNoGuards, type Guards } from "../../../guards.server";

export const finanzielleAngabeGuards = {
  eigentumDone,
  hasPartnerschaftYes,
  hasPartnerschaftNo: ({ context }) => context.partnerschaft !== "yes",
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftYesAndZusammenlebenNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
  ...yesNoGuards("erwerbstaetig"),
  ...yesNoGuards("zusammenleben"),
  ...yesNoGuards("unterhalt"),
  ...yesNoGuards("partnerEinkommen"),
  ...yesNoGuards("partnerHasBesondersAusgaben"),
  hasBankkontoYes,
  hasKraftfahrzeugYes,
  hasGeldanlageYes,
  hasGrundeigentumYes,
  hasWertsacheYes,
  hasKinderYes,
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
    (hasBankkontoYes({ context }) && !arrayIsNonEmpty(context.bankkonten)) ||
    (hasGeldanlageYes({ context }) && !arrayIsNonEmpty(context.geldanlagen)) ||
    (hasWertsacheYes({ context }) && !arrayIsNonEmpty(context.wertsachen)) ||
    (hasKraftfahrzeugYes({ context }) &&
      !arrayIsNonEmpty(context.kraftfahrzeuge)) ||
    (hasGrundeigentumYes({ context }) &&
      !arrayIsNonEmpty(context.grundeigentum)),

  hasKinderYesAndEmptyArray,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
  hasAusgabenYes,
  isSonstigeVersicherung: ({ context: { pageData, versicherungen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return (
      versicherungen?.at(arrayIndex)?.art ===
      prozesskostenhilfeFinanzielleAngabenContext.versicherungen.element.shape
        .art.Enum.sonstige
    );
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
} satisfies Guards<ProzesskostenhilfeFinanzielleAngabenContext>;
