import { yesNoGuards, type Guards } from "../../guards.server";
import { type BeratungshilfeFinanzielleAngaben } from "./context";

const hasStaatlicheLeistungen: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "buergergeld" ||
    context.staatlicheLeistungen === "grundsicherung";

export const finanzielleAngabeGuards = {
  staatlicheLeistungenIsGrundsicherung: ({ context }) =>
    context.staatlicheLeistungen === "grundsicherung",
  staatlicheLeistungenIsAsylbewerberleistungen: ({ context }) =>
    context.staatlicheLeistungen === "asylbewerberleistungen",
  staatlicheLeistungenIsBuergergeld: ({ context }) =>
    context.staatlicheLeistungen === "buergergeld",
  hasStaatlicheLeistungen,
  hasPartnerschaftYesAndNoStaatlicheLeistungen: ({ context }) =>
    context.partnerschaft === "yes" && !hasStaatlicheLeistungen({ context }),
  besitzTotalWorthLessThan10000: ({ context }) =>
    context.besitzTotalWorth === "less10000",
  hasPartnerschaftOrSeparated: ({ context }) =>
    context.partnerschaft === "yes" || context.partnerschaft === "separated",
  hasPartnerschaftYes: ({ context }) => context.partnerschaft === "yes",
  hasPartnerschaftNoOrWidowed: ({ context }) =>
    context.partnerschaft === "no" || context.partnerschaft === "widowed",
  ...yesNoGuards("erwerbstaetig"),
  ...yesNoGuards("zusammenleben"),
  ...yesNoGuards("unterhalt"),
  ...yesNoGuards("partnerEinkommen"),
  ...yesNoGuards("hasBankkonto"),
  ...yesNoGuards("hasKraftfahrzeug"),
  ...yesNoGuards("hasGeldanlage"),
  ...yesNoGuards("hasGrundeigentum"),
  ...yesNoGuards("hasWertsache"),
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
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    const kinderWohnortBeiAntragsteller =
      kinder?.[pageData.arrayIndexes[0]]?.wohnortBeiAntragsteller;
    return (
      kinderWohnortBeiAntragsteller === "yes" ||
      kinderWohnortBeiAntragsteller === "partially"
    );
  },
  kindEigeneEinnahmenYes: ({ context: { pageData, kinder } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return kinder?.[pageData.arrayIndexes[0]]?.eigeneEinnahmen === "yes";
  },
  kindUnterhaltYes: ({ context: { pageData, kinder } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return kinder?.[pageData.arrayIndexes[0]]?.unterhalt === "yes";
  },
  isValidKinderArrayIndex: ({ context: { pageData, kinder } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    const arrayIndex = pageData.arrayIndexes[0];
    if ((kinder?.length === 0 && arrayIndex > 0) || arrayIndex < 0)
      return false;

    return !(arrayIndex > (kinder?.length ?? 0));
  },
  livesAlone: ({ context }) => context.livingSituation === "alone",
  isGrundeigentumBewohntYes: ({ context: { pageData, grundeigentum } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return (
      grundeigentum?.[pageData.arrayIndexes[0]]?.istBewohnt === "yes" ||
      grundeigentum?.[pageData.arrayIndexes[0]]?.istBewohnt === "family"
    );
  },
  isGeldanlageBargeld: ({ context: { pageData, geldanlagen } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;

    return geldanlagen?.[pageData.arrayIndexes[0]]?.art === "bargeld";
  },
  isGeldanlageWertpapiere: ({ context: { pageData, geldanlagen } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return geldanlagen?.[pageData.arrayIndexes[0]]?.art === "wertpapiere";
  },
  isGeldanlageGuthabenkontoKrypto: ({ context: { pageData, geldanlagen } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return (
      geldanlagen?.[pageData.arrayIndexes[0]]?.art === "guthabenkontoKrypto"
    );
  },
  isGeldanlageGiroTagesgeldSparkonto: ({
    context: { pageData, geldanlagen },
  }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return (
      geldanlagen?.[pageData.arrayIndexes[0]]?.art === "giroTagesgeldSparkonto"
    );
  },
  isGeldanlageBefristet: ({ context: { pageData, geldanlagen } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return geldanlagen?.[pageData.arrayIndexes[0]]?.art === "befristet";
  },
  isGeldanlageForderung: ({ context: { pageData, geldanlagen } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return geldanlagen?.[pageData.arrayIndexes[0]]?.art === "forderung";
  },
  isGeldanlageSonstiges: ({ context: { pageData, geldanlagen } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return geldanlagen?.[pageData.arrayIndexes[0]]?.art === "sonstiges";
  },
  isKraftfahrzeugWertAbove10000OrUnsure: ({
    context: { pageData, kraftfahrzeuge },
  }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;

    return (
      kraftfahrzeuge?.[pageData.arrayIndexes[0]]?.wert === "over10000" ||
      kraftfahrzeuge?.[pageData.arrayIndexes[0]]?.wert === "unsure"
    );
  },
  grundeigentumIsBewohnt: ({ context: { pageData, grundeigentum } }) => {
    if (!pageData?.arrayIndexes || pageData.arrayIndexes.length === 0)
      return false;
    return (
      grundeigentum?.[pageData.arrayIndexes[0]]?.istBewohnt === "yes" ||
      grundeigentum?.[pageData.arrayIndexes[0]]?.istBewohnt === "family"
    );
  },
} satisfies Guards<BeratungshilfeFinanzielleAngaben>;
