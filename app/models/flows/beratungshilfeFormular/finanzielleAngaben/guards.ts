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
};
