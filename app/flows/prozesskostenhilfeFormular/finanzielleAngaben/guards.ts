import {
  eigentumTotalWorthLessThan10000,
  eigentumYesAndEmptyArray,
  grundeigentumIsBewohnt,
  hasAnyEigentum,
  hasAnyEigentumExceptBankaccount,
  hasAusgabenYes,
  hasBankkontoYes,
  hasGeldanlageYes,
  hasGrundeigentumYes,
  hasKinderYes,
  hasKinderYesAndEmptyArray,
  hasKraftfahrzeugYes,
  hasPartnerschaftNoOrWidowed,
  hasPartnerschaftOrSeparated,
  hasPartnerschaftOrSeparatedAndPartnerEinkommenYes,
  hasPartnerschaftOrSeparatedAndZusammenlebenNo,
  hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltNo,
  hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftOrSeparatedAndZusammenlebenYes,
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
import {
  prozesskostenhilfeFinanzielleAngabenContext,
  type ProzesskostenhilfeFinanzielleAngabenContext,
} from "./context";
import { ausgabenDone, eigentumDone } from "./doneFunctions";
import { yesNoGuards, type Guards } from "../../guards.server";

export const finanzielleAngabeGuards = {
  eigentumDone,
  hasAnyEigentum,
  eigentumTotalWorthLessThan10000,
  hasPartnerschaftOrSeparated,
  hasPartnerschaftYes,
  hasPartnerschaftNoOrWidowed,
  hasPartnerschaftOrSeparatedAndPartnerEinkommenYes,
  hasPartnerschaftOrSeparatedAndZusammenlebenYes,
  hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftOrSeparatedAndZusammenlebenNo,
  hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltNo,
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
  hasAnyEigentumExceptBankaccount,
  isGeldanlageBargeld,
  isGeldanlageWertpapiere,
  isGeldanlageGuthabenkontoKrypto,
  isGeldanlageGiroTagesgeldSparkonto,
  isGeldanlageBefristet,
  isGeldanlageForderung,
  isGeldanlageSonstiges,
  isKraftfahrzeugWertAbove10000OrUnsure,
  grundeigentumIsBewohnt,
  eigentumYesAndEmptyArray,
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
