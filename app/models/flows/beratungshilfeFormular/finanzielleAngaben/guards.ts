import { yesNoGuards, type Guards } from "../../guards.server";
import { type BeratungshilfeFinanzielleAngaben } from "./context";

export const finanzielleAngabeGuards = {
  staatlicheLeistungenIsGrundsicherung: ({ context }) =>
    context.staatlicheLeistungen === "grundsicherung",
  staatlicheLeistungenIsAsylbewerberleistungen: ({ context }) =>
    context.staatlicheLeistungen === "asylbewerberleistungen",
  staatlicheLeistungenIsBuergergeld: ({ context }) =>
    context.staatlicheLeistungen === "buergergeld",
  hasStaatlicheLeistungen: ({ context }) =>
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "buergergeld" ||
    context.staatlicheLeistungen === "grundsicherung",
  hasPartnerschaftYes: ({ context }) => context.partnerschaft === "yes",
  besitzTotalWorthLessThan10000: ({ context }) =>
    context.besitzTotalWorth === "less10000",
  hasPartnerschaftOrSeparated: ({ context }) =>
    context.partnerschaft === "yes" || context.partnerschaft === "separated",
  hasPartnerschaftNoOrWidowed: ({ context }) =>
    context.partnerschaft === "no" || context.partnerschaft === "widowed",
  ...yesNoGuards("erwerbstaetig"),
  ...yesNoGuards("zusammenleben"),
  ...yesNoGuards("unterhalt"),
  ...yesNoGuards("partnerEinkommen"),
  ...yesNoGuards("hasBankkonto"),
  ...yesNoGuards("hasAdditionalBankkonto"),
  ...yesNoGuards("hasKraftfahrzeug"),
  ...yesNoGuards("hasAdditionalKraftfahrzeug"),
  ...yesNoGuards("hasGeldanlage"),
  ...yesNoGuards("hasAdditionalGeldanlage"),
  ...yesNoGuards("hasGrundeigentum"),
  ...yesNoGuards("hasAdditionalGrundeigentum"),
  ...yesNoGuards("hasWertsache"),
  ...yesNoGuards("hasAdditionalWertsache"),
  isPartnerschaftZusammenlebenEinkommenNo: ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "no",
  isPartnerschaftZusammenlebenEinkommenYes: ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes",
  hasKinderYes: ({ context }) => context.hasKinder === "yes",
  // TODO: replace with the correct guards
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
} satisfies Guards<BeratungshilfeFinanzielleAngaben>;
