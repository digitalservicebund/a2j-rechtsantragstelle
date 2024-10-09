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
} from "~/flows/shared/finanzielleAngaben/guards";
import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import type { BeratungshilfeFinanzielleAngabenGuard } from "./BeratungshilfeFinanzielleAngabenGuardType";
import { type BeratungshilfeFinanzielleAngaben } from "./context";
import {
  eigentumDone,
  hasNoStaatlicheLeistungen,
  hasStaatlicheLeistungen,
} from "./doneFunctions";
import { yesNoGuards } from "../../guards.server";
import type { Guards } from "../../guards.server";

export const eigentumTotalWorthLessThan10000: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) => context.eigentumTotalWorth === "less10000";

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
  eigentumTotalWorthLessThan10000,
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

  eigentumYesAndEmptyArray: ({ context }) =>
    (hasBankkontoYes({ context }) && !arrayIsNonEmpty(context.bankkonten)) ||
    // entries other than bank accounts are only revelant above 10k
    (context.eigentumTotalWorth === "more10000" &&
      ((hasGeldanlageYes({ context }) &&
        !arrayIsNonEmpty(context.geldanlagen)) ||
        (hasWertsacheYes({ context }) &&
          !arrayIsNonEmpty(context.wertsachen)) ||
        (hasKraftfahrzeugYes({ context }) &&
          !arrayIsNonEmpty(context.kraftfahrzeuge)) ||
        (hasGrundeigentumYes({ context }) &&
          !arrayIsNonEmpty(context.grundeigentum)))),

  hasKinderYesAndEmptyArray,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
} satisfies Guards<BeratungshilfeFinanzielleAngaben>;
