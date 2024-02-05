import { type BeratungshilfeFinanzielleAngabenContext } from "./context";

type Guard = (context: BeratungshilfeFinanzielleAngabenContext) => boolean;

function yesNoGuards<
  Field extends keyof BeratungshilfeFinanzielleAngabenContext,
>(
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
    context: BeratungshilfeFinanzielleAngabenContext,
  ) => context.staatlicheLeistungen === "grundsicherung",
  staatlicheLeistungenIsAsylbewerberleistungen: (
    context: BeratungshilfeFinanzielleAngabenContext,
  ) => context.staatlicheLeistungen === "asylbewerberleistungen",
  staatlicheLeistungenIsBuergergeld: (
    context: BeratungshilfeFinanzielleAngabenContext,
  ) => context.staatlicheLeistungen === "buergergeld",
  hasStaatlicheLeistungen: (context: BeratungshilfeFinanzielleAngabenContext) =>
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
    context: BeratungshilfeFinanzielleAngabenContext,
  ) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "no",
  isPartnerschaftZusammenlebenEinkommenYes: (
    context: BeratungshilfeFinanzielleAngabenContext,
  ) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes",
};
