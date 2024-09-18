import {
  grundeigentumIsBewohnt,
  hasAusgabenYes,
  hasBankkontoYes,
  hasGeldanlageYes,
  hasGrundeigentumYes,
  hasKinderYes,
  hasKinderYesAndEmptyArray,
  hasKraftfahrzeugYes,
  hasPartnerschaftNoOrWidowed,
  hasPartnerschaftYesAndPartnerEinkommenYes,
  hasPartnerschaftYesAndZusammenlebenNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftYesAndZusammenlebenYes,
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
  isPartnerschaftZusammenlebenEinkommenNo,
  isPartnerschaftZusammenlebenEinkommenYes,
  isValidKinderArrayIndex,
  kindEigeneEinnahmenYes,
  kindUnterhaltNo,
  kindUnterhaltYes,
  kindWohnortBeiAntragstellerNo,
  kindWohnortBeiAntragstellerYes,
} from "~/flows/shared/finanzielleAngaben/guards";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import {
  prozesskostenhilfeFinanzielleAngabenContext,
  type ProzesskostenhilfeFinanzielleAngabenContext,
} from "./context";
import {
  ausgabenDone,
  hasRatenzahlungDone,
  hasSonstigeAusgabeDone,
  hasVersicherungDone,
} from "./doneFunctions";
import { eigentumDone } from "./eigentumDone";
import { yesNoGuards, type Guards } from "../../guards.server";

export const finanzielleAngabeGuards = {
  eigentumDone,
  hasPartnerschaftYes,
  hasPartnerschaftNoOrWidowed,
  hasPartnerschaftYesAndPartnerEinkommenYes,
  hasPartnerschaftYesAndZusammenlebenYes,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftYesAndZusammenlebenNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
  ...yesNoGuards("erwerbstaetig"),
  ...yesNoGuards("zusammenleben"),
  ...yesNoGuards("unterhalt"),
  ...yesNoGuards("partnerEinkommen"),
  hasBankkontoYes,
  hasKraftfahrzeugYes,
  hasGeldanlageYes,
  hasGrundeigentumYes,
  hasWertsacheYes,
  hasKinderYes,
  hasWeitereUnterhaltszahlungenYes,
  isPartnerschaftZusammenlebenEinkommenNo,
  isPartnerschaftZusammenlebenEinkommenYes,
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
  hasAusgabenEntriesYes: ({ context }) =>
    hasVersicherungDone({ context }) ||
    hasRatenzahlungDone({ context }) ||
    hasSonstigeAusgabeDone({ context }),

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
    return (
      sonstigeAusgaben?.at(arrayIndex)?.zahlungspflichtiger !==
      prozesskostenhilfeFinanzielleAngabenContext.sonstigeAusgaben.element.shape
        .zahlungspflichtiger.Enum.myself
    );
  },
  ratenzahlungAnteiligYes: ({ context: { pageData, ratenzahlungen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return (
      ratenzahlungen?.at(arrayIndex)?.zahlungspflichtiger !==
      prozesskostenhilfeFinanzielleAngabenContext.ratenzahlungen.element.shape
        .zahlungspflichtiger.Enum.myself
    );
  },
  ausgabenDone,
} satisfies Guards<ProzesskostenhilfeFinanzielleAngabenContext>;
