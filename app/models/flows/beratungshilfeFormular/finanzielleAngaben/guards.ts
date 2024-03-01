import type { Guards } from "../../guards.server";
import { type BeratungshilfeFinanzielleAngaben } from "./context";

function yesNoGuards<Field extends keyof BeratungshilfeFinanzielleAngaben>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guards[string] } & {
  [field in Field as `${field}No`]: Guards[string];
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ({ context }) => context[field] === "yes",
    [`${field}No`]: ({ context }) => context[field] === "no",
  } satisfies Guards;
}

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
  isPartnerschaftZusammenlebenEinkommenNo: ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "no",
  isPartnerschaftZusammenlebenEinkommenYes: ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes",
} satisfies Guards<BeratungshilfeFinanzielleAngaben>;
