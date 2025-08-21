import {
  grundeigentumIsBewohnt,
  hasAnyEigentumExceptBankaccount,
  hasAusgabenYes,
  hasBankkontoYes,
  hasGeldanlageYes,
  hasGrundeigentumYes,
  hasKinderYes,
  hasKinderYesAndEmptyArray,
  hasKraftfahrzeugYes,
  hasPartnerschaftNoOrWidowed,
  hasPartnerschaftYes,
  hasPartnerschaftYesAndPartnerEinkommenYes,
  hasPartnerschaftYesAndZusammenlebenNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftYesAndZusammenlebenYes,
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
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
} from "~/domains/shared/formular/finanzielleAngaben/guards";
import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { eigentumDone } from "./doneFunctions";
import {
  hasStaatlicheLeistungen,
  hasNoStaatlicheLeistungen,
} from "./einkommen/doneFunctions";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./einkommen/userData";
import { type BeratungshilfeFinanzielleAngabenUserData } from "./userData";
import { yesNoGuards } from "../../../guards.server";
import type { Guards } from "../../../guards.server";

export const finanzielleAngabeGuards = {
  eigentumDone,
  staatlicheLeistungenIsKeine,
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsBuergergeldAndEigentumDone: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) && eigentumDone({ context }),
  staatlicheLeistungenIsBuergergeldAndHasEigentum: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) &&
    hasAnyEigentumExceptBankaccount({ context }),
  hasStaatlicheLeistungen,
  hasNoStaatlicheLeistungen,
  hasPartnerschaftYesAndNoStaatlicheLeistungen: ({ context }) =>
    context.partnerschaft === "yes" && !hasStaatlicheLeistungen({ context }),
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
  hasAusgabenYes,
  hasBankkontoYes,
  hasKraftfahrzeugYes,
  hasGeldanlageYes,
  hasGrundeigentumYes,
  hasWertsacheYes,
  hasKinderYes,
  hasWeitereUnterhaltszahlungenYes,
  hasZahlungsfristYes: ({ context: { pageData, ausgaben } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return ausgaben?.at(arrayIndex)?.hasZahlungsfrist === "yes";
  },
  kindWohnortBeiAntragstellerYes,
  kindWohnortBeiAntragstellerNo,
  kindEigeneEinnahmenYes,
  kindUnterhaltYes,
  kindUnterhaltNo,
  isValidKinderArrayIndex,
  isValidAusgabenArrayIndex: ({ context: { pageData, ausgaben } }) =>
    isValidArrayIndex(ausgaben, pageData),
  livesAlone: ({ context }) => context.livingSituation === "alone",
  livesNotAlone: ({ context }) =>
    context.livingSituation === "withRelatives" ||
    context.livingSituation === "withOthers",
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
  hasAusgabenYesAndEmptyArray: ({ context }) =>
    hasAusgabenYes({ context }) && !arrayIsNonEmpty(context.ausgaben),
  hasKinderYesAndEmptyArray,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
} satisfies Guards<
  BeratungshilfeFinanzielleAngabenUserData &
    BeratungshilfeFinanzielleAngabenEinkommenUserData
>;
