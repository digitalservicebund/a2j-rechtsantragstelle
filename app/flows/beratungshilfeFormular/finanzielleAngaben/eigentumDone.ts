import {
  type BeratungshilfeFinanzielleAngabenGuard,
  hasAnyEigentumExceptBankaccount,
} from "./guards";

export const eigentumDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.staatlicheLeistungen == "grundsicherung" ||
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  (context.hasBankkonto !== undefined &&
    context.hasKraftfahrzeug !== undefined &&
    context.hasGeldanlage !== undefined &&
    context.hasGrundeigentum !== undefined &&
    context.hasWertsache !== undefined &&
    (!hasAnyEigentumExceptBankaccount({ context }) ||
      context.eigentumTotalWorth !== undefined));
