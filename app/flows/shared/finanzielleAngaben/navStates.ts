import { arrayIsNonEmpty } from "~/util/array";
import { FinanzielleAngabenGuard } from "./guards";

export const bankKontoDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" && arrayIsNonEmpty(context.bankkonten));

export const geldanlagenDone: FinanzielleAngabenGuard = ({ context }) =>
  context.eigentumTotalWorth === "less10000" ||
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" && arrayIsNonEmpty(context.geldanlagen));

export const grundeigentumDone: FinanzielleAngabenGuard = ({ context }) =>
  context.eigentumTotalWorth === "less10000" ||
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    arrayIsNonEmpty(context.grundeigentum));

export const kraftfahrzeugeDone: FinanzielleAngabenGuard = ({ context }) =>
  context.eigentumTotalWorth === "less10000" ||
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    arrayIsNonEmpty(context.kraftfahrzeuge));

export const wertsachenDone: FinanzielleAngabenGuard = ({ context }) =>
  context.eigentumTotalWorth === "less10000" ||
  context.hasWertsache === "no" ||
  (context.hasWertsache === "yes" && arrayIsNonEmpty(context.wertsachen));
