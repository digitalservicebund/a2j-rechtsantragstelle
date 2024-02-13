import { type BeratungshilfeFinanzielleAngaben } from "./context";

type Guard = (context: BeratungshilfeFinanzielleAngaben) => boolean;

function yesNoGuards<Field extends keyof BeratungshilfeFinanzielleAngaben>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guard } & {
  [field in Field as `${field}No`]: Guard;
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ((context) => context[field] === "yes") as Guard,
    [`${field}No`]: ((context) => context[field] === "no") as Guard,
  };
}

export const finanzielleAngabeGuards = {
  staatlicheLeistungenIsGrundsicherung: (
    context: BeratungshilfeFinanzielleAngaben,
  ) => context.staatlicheLeistungen === "grundsicherung",
  staatlicheLeistungenIsAsylbewerberleistungen: (
    context: BeratungshilfeFinanzielleAngaben,
  ) => context.staatlicheLeistungen === "asylbewerberleistungen",
  staatlicheLeistungenIsBuergergeld: (
    context: BeratungshilfeFinanzielleAngaben,
  ) => context.staatlicheLeistungen === "buergergeld",
  hasStaatlicheLeistungen: (context: BeratungshilfeFinanzielleAngaben) =>
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "buergergeld" ||
    context.staatlicheLeistungen === "grundsicherung",
  ...yesNoGuards("erwerbstaetig"),
  ...yesNoGuards("partnerschaft"),
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
  isPartnerschaftZusammenlebenEinkommenNo: (
    context: BeratungshilfeFinanzielleAngaben,
  ) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "no",
  isPartnerschaftZusammenlebenEinkommenYes: (
    context: BeratungshilfeFinanzielleAngaben,
  ) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes",
  hasKinderYes: (context: BeratungshilfeFinanzielleAngaben) =>
    context.hasKinder === "yes",
  // TODO: replace with the correct guards
  kindWohnortBeiAntragstellerYes: (context: BeratungshilfeFinanzielleAngaben) =>
    context.kinder?.[0]?.wohnortBeiAntragsteller === "yes" ||
    context.kinder?.[0]?.wohnortBeiAntragsteller === "partially",
  kindEigeneEinnahmenYes: (context: BeratungshilfeFinanzielleAngaben) =>
    context.kinder?.[0]?.eigeneEinnahmen === "yes",
  kindUnterhaltYes: (context: BeratungshilfeFinanzielleAngaben) =>
    context.kinder?.[0]?.unterhalt === "yes",
};
