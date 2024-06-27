import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/services/validation/array";
import { type BeratungshilfeFinanzielleAngaben } from "./context";
import { yesNoGuards, type Guards } from "../../guards.server";

const hasStaatlicheLeistungen: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "buergergeld" ||
    context.staatlicheLeistungen === "grundsicherung";

const hasNoStaatlicheLeistungen: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) => {
    return (
      context.staatlicheLeistungen !== undefined &&
      !hasStaatlicheLeistungen({ context })
    );
  };

const staatlicheLeistungenIsBuergergeld: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) => context.staatlicheLeistungen === "buergergeld";

const hasPartnerschaftOrSeparated: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    context.partnerschaft === "yes" || context.partnerschaft === "separated";

const hasPartnerschaftOrSeparatedAndZusammenlebenNo: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) && context.zusammenleben == "no";

const hasAnyEigentumExceptBankaccount: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    context.hasGeldanlage == "yes" ||
    context.hasWertsache == "yes" ||
    context.hasGrundeigentum == "yes" ||
    context.hasKraftfahrzeug == "yes";

export const eigentumDone: Guards<BeratungshilfeFinanzielleAngaben>[string] = ({
  context,
}) =>
  context.hasBankkonto !== undefined &&
  context.hasKraftfahrzeug !== undefined &&
  context.hasGeldanlage !== undefined &&
  context.hasGrundeigentum !== undefined &&
  context.hasWertsache !== undefined &&
  (!hasAnyEigentumExceptBankaccount({ context }) ||
    context.eigentumTotalWorth !== undefined);

export const einkommenDone: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    (context.staatlicheLeistungen != undefined &&
      hasStaatlicheLeistungen({ context })) ||
    context.einkommen != undefined;

const { hasKinderYes } = yesNoGuards("hasKinder");
const { hasWeitereUnterhaltszahlungenYes } = yesNoGuards(
  "hasWeitereUnterhaltszahlungen",
);
const { hasAusgabenYes } = yesNoGuards("hasAusgaben");
const { hasBankkontoYes } = yesNoGuards("hasBankkonto");
const { hasKraftfahrzeugYes } = yesNoGuards("hasKraftfahrzeug");
const { hasGeldanlageYes } = yesNoGuards("hasGeldanlage");
const { hasGrundeigentumYes } = yesNoGuards("hasGrundeigentum");
const { hasWertsacheYes } = yesNoGuards("hasWertsache");

export const finanzielleAngabeGuards = {
  eigentumDone,
  staatlicheLeistungenIsKeine: ({ context }) =>
    context.staatlicheLeistungen === "keine",
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
  eigentumTotalWorthLessThan10000: ({ context }) =>
    context.eigentumTotalWorth === "less10000",
  hasPartnerschaftOrSeparated,
  hasPartnerschaftYes: ({ context }) => context.partnerschaft === "yes",
  hasPartnerschaftNoOrWidowed: ({ context }) =>
    context.partnerschaft === "no" || context.partnerschaft === "widowed",
  hasPartnerschaftOrSeparatedAndPartnerEinkommenYes: ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) &&
    context.partnerEinkommen == "yes",
  hasPartnerschaftOrSeparatedAndZusammenlebenYes: ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) && context.zusammenleben == "yes",
  hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltYes: ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) &&
    context.zusammenleben == "no" &&
    context.unterhalt === "yes",
  hasPartnerschaftOrSeparatedAndZusammenlebenNo,
  hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltNo: ({ context }) =>
    hasPartnerschaftOrSeparatedAndZusammenlebenNo({ context }) &&
    context.unterhalt == "no",
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
  isPartnerschaftZusammenlebenEinkommenNo: ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "no",
  isPartnerschaftZusammenlebenEinkommenYes: ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes",
  kindWohnortBeiAntragstellerYes: ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const kinderWohnortBeiAntragsteller =
      kinder?.at(arrayIndex)?.wohnortBeiAntragsteller;
    return (
      kinderWohnortBeiAntragsteller === "yes" ||
      kinderWohnortBeiAntragsteller === "partially"
    );
  },
  kindWohnortBeiAntragstellerNo: ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return kinder?.at(arrayIndex)?.wohnortBeiAntragsteller === "no";
  },
  kindEigeneEinnahmenYes: ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return kinder?.at(arrayIndex)?.eigeneEinnahmen === "yes";
  },
  kindUnterhaltYes: ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return kinder?.at(arrayIndex)?.unterhalt === "yes";
  },
  kindUnterhaltNo: ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return kinder?.at(arrayIndex)?.unterhalt === "no";
  },
  isValidKinderArrayIndex: ({ context: { pageData, kinder } }) =>
    isValidArrayIndex(kinder, pageData),
  isValidAusgabenArrayIndex: ({ context: { pageData, ausgaben } }) =>
    isValidArrayIndex(ausgaben, pageData),
  livesAlone: ({ context }) => context.livingSituation === "alone",
  livesNotAlone: ({ context }) =>
    context.livingSituation === "withRelatives" ||
    context.livingSituation === "withOthers",
  hasAnyEigentumExceptBankaccount,
  isGeldanlageBargeld: ({ context: { pageData, geldanlagen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "bargeld";
  },
  isGeldanlageWertpapiere: ({ context: { pageData, geldanlagen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "wertpapiere";
  },
  isGeldanlageGuthabenkontoKrypto: ({ context: { pageData, geldanlagen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "guthabenkontoKrypto";
  },
  isGeldanlageGiroTagesgeldSparkonto: ({
    context: { pageData, geldanlagen },
  }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "giroTagesgeldSparkonto";
  },
  isGeldanlageBefristet: ({ context: { pageData, geldanlagen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "befristet";
  },
  isGeldanlageForderung: ({ context: { pageData, geldanlagen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "forderung";
  },
  isGeldanlageSonstiges: ({ context: { pageData, geldanlagen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "sonstiges";
  },
  isKraftfahrzeugWertAbove10000OrUnsure: ({
    context: { pageData, kraftfahrzeuge },
  }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const wert = kraftfahrzeuge?.at(arrayIndex)?.wert;
    return wert === "over10000" || wert === "unsure";
  },
  grundeigentumIsBewohnt: ({ context: { pageData, grundeigentum } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return grundeigentum?.at(arrayIndex)?.isBewohnt === "yes";
  },
  einkommenDone,
  hasAusgabenYesAndEmptyArray: ({ context }) =>
    hasAusgabenYes({ context }) && !arrayIsNonEmpty(context.ausgaben),
  eigentumYesAndEmptyArray: ({ context }) =>
    (hasBankkontoYes({ context }) && !arrayIsNonEmpty(context.bankkonten)) ||
    (hasGeldanlageYes({ context }) && !arrayIsNonEmpty(context.geldanlagen)) ||
    (hasWertsacheYes({ context }) && !arrayIsNonEmpty(context.wertsachen)) ||
    (hasKraftfahrzeugYes({ context }) &&
      !arrayIsNonEmpty(context.kraftfahrzeuge)) ||
    (hasGrundeigentumYes({ context }) &&
      !arrayIsNonEmpty(context.grundeigentum)),
  hasKinderYesAndEmptyArray: ({ context }) =>
    hasKinderYes({ context }) && !arrayIsNonEmpty(context.kinder),
  hasWeitereUnterhaltszahlungenYesAndEmptyArray: ({ context }) =>
    hasWeitereUnterhaltszahlungenYes({ context }) &&
    !arrayIsNonEmpty(context.unterhaltszahlungen),
} satisfies Guards<BeratungshilfeFinanzielleAngaben>;
