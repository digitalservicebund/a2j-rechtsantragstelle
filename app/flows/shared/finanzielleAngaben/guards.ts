import { BeratungshilfeFinanzielleAngaben } from "~/flows/beratungshilfeFormular/finanzielleAngaben/context";
import { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { yesNoGuards, type Guards } from "../../guards.server";

export const hasPartnerschaftOrSeparated: Guards<
  BeratungshilfeFinanzielleAngaben | ProzesskostenhilfeFormularContext
>[string] = ({ context }) =>
  context.partnerschaft === "yes" || context.partnerschaft === "separated";

export const hasPartnerschaftOrSeparatedAndZusammenlebenNo: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) && context.zusammenleben == "no";

export const hasAnyEigentumExceptBankaccount: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    context.hasGeldanlage == "yes" ||
    context.hasWertsache == "yes" ||
    context.hasGrundeigentum == "yes" ||
    context.hasKraftfahrzeug == "yes";

export const hasAnyEigentum: Guards<BeratungshilfeFinanzielleAngaben>[string] =
  ({ context }) =>
    hasAnyEigentumExceptBankaccount({ context }) ||
    context.hasBankkonto === "yes";

export const { hasKinderYes } = yesNoGuards("hasKinder");
export const { hasWeitereUnterhaltszahlungenYes } = yesNoGuards(
  "hasWeitereUnterhaltszahlungen",
);
export const { hasBankkontoYes } = yesNoGuards("hasBankkonto");
export const { hasKraftfahrzeugYes } = yesNoGuards("hasKraftfahrzeug");
export const { hasGeldanlageYes } = yesNoGuards("hasGeldanlage");
export const { hasGrundeigentumYes } = yesNoGuards("hasGrundeigentum");
export const { hasWertsacheYes } = yesNoGuards("hasWertsache");
