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
import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { type BeratungshilfeFinanzielleAngaben } from "./context";
import { eigentumDone } from "./doneFunctions";
import { yesNoGuards } from "../../guards.server";
import type { GenericGuard, Guards } from "../../guards.server";

export type BeratungshilfeFinanzielleAngabenGuard =
  GenericGuard<BeratungshilfeFinanzielleAngaben>;

const hasStaatlicheLeistungen: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.staatlicheLeistungen === "asylbewerberleistungen" ||
  context.staatlicheLeistungen === "buergergeld" ||
  context.staatlicheLeistungen === "grundsicherung";

const hasNoStaatlicheLeistungen: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) => {
  return (
    context.staatlicheLeistungen !== undefined &&
    !hasStaatlicheLeistungen({ context })
  );
};

const staatlicheLeistungenIsBuergergeld: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) => context.staatlicheLeistungen === "buergergeld";

export const finanzielleAngabeGuards = {
  eigentumDone,
  staatlicheLeistungenIsKeine: ({ context }) =>
    context.staatlicheLeistungen === "keine",
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsBuergergeldAndHasAnyEigentum: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) &&
    hasAnyEigentum({ context }),
  hasAnyEigentum,
  staatlicheLeistungenIsBuergergeldAndHasEigentum: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) &&
    hasAnyEigentumExceptBankaccount({ context }),
  hasStaatlicheLeistungen,
  hasNoStaatlicheLeistungen,
  hasPartnerschaftYesAndNoStaatlicheLeistungen: ({ context }) =>
    context.partnerschaft === "yes" && !hasStaatlicheLeistungen({ context }),
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
  isPartnerschaftZusammenlebenEinkommenNo,
  isPartnerschaftZusammenlebenEinkommenYes,
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
  eigentumYesAndEmptyArray,
  hasKinderYesAndEmptyArray,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
} satisfies Guards<BeratungshilfeFinanzielleAngaben>;
