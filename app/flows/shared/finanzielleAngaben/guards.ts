import type { BeratungshilfeFinanzielleAngaben } from "~/flows/beratungshilfeFormular/finanzielleAngaben/context";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/context";
import { type GenericGuard, yesNoGuards } from "../../guards.server";

export type FinanzielleAngabenGuard = GenericGuard<
  ProzesskostenhilfeFinanzielleAngabenContext | BeratungshilfeFinanzielleAngaben
>;

export const hasPartnerschaftOrSeparated: FinanzielleAngabenGuard = ({
  context,
}) => context.partnerschaft === "yes" || context.partnerschaft === "separated";

export const hasPartnerschaftOrSeparatedAndZusammenlebenNo: FinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) && context.zusammenleben == "no";

export const hasAnyEigentumExceptBankaccount: FinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGeldanlage == "yes" ||
  context.hasWertsache == "yes" ||
  context.hasGrundeigentum == "yes" ||
  context.hasKraftfahrzeug == "yes";

export const hasAnyEigentum: FinanzielleAngabenGuard = ({ context }) =>
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
