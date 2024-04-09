import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { yesNoGuards, type Guards } from "../../guards.server";
import { type BeratungshilfeFinanzielleAngaben } from "./context";
import { einkommenDone } from "./navStates";
import { besitzDone } from "./navStatesBesitz";

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

export const finanzielleAngabeGuards = {
  besitzDone,
  staatlicheLeistungenIsKeineOrAndere: ({ context }) =>
    context.staatlicheLeistungen === "andereLeistung" ||
    context.staatlicheLeistungen === "keine",
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsBuergergeldAndBesitzDone: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) && besitzDone({ context }),
  hasStaatlicheLeistungen,
  hasNoStaatlicheLeistungen,
  hasPartnerschaftYesAndNoStaatlicheLeistungen: ({ context }) =>
    context.partnerschaft === "yes" && !hasStaatlicheLeistungen({ context }),
  besitzTotalWorthLessThan10000: ({ context }) =>
    context.besitzTotalWorth === "less10000",
  hasPartnerschaftOrSeparated,
  hasPartnerschaftYes: ({ context }) => context.partnerschaft === "yes",
  hasPartnerschaftNoOrWidowed: ({ context }) =>
    context.partnerschaft === "no" || context.partnerschaft === "widowed",
  hasPartnerschaftOrSeparatedAndPartnerEinkommenYes: ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) &&
    context.partnerEinkommen == "yes",
  hasPartnerschaftOrSeparatedAndZusammenlebenYes: ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) && context.zusammenleben == "yes",
  hasPartnerschaftOrSeparatedAndZusammenlebenNo,
  hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltNo: ({ context }) =>
    hasPartnerschaftOrSeparatedAndZusammenlebenNo({ context }) &&
    context.unterhalt == "no",
  ...yesNoGuards("erwerbstaetig"),
  ...yesNoGuards("zusammenleben"),
  ...yesNoGuards("unterhalt"),
  ...yesNoGuards("partnerEinkommen"),
  ...yesNoGuards("hasBankkonto"),
  ...yesNoGuards("hasKraftfahrzeug"),
  ...yesNoGuards("hasGeldanlage"),
  ...yesNoGuards("hasGrundeigentum"),
  ...yesNoGuards("hasWertsache"),
  ...yesNoGuards("hasAusgaben"),
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
  hasKinderYes: ({ context }) => context.hasKinder === "yes",
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
  hasWeitereUnterhaltszahlungenYes: ({ context }) =>
    context.hasWeitereUnterhaltszahlungen === "yes",
} satisfies Guards<BeratungshilfeFinanzielleAngaben>;
