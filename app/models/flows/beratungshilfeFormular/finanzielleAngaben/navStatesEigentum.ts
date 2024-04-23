import type { FinanzielleAngabenGuard } from "./navStates";
import { eigentumDone as eigentumDoneGuard } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/guards";

export const eigentumDone: FinanzielleAngabenGuard = ({ context }) =>
  eigentumDoneGuard({ context });

export const bankKontoDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" &&
    context.bankkonten !== undefined &&
    context.bankkonten.length > 0);

export const geldanlagenDone: FinanzielleAngabenGuard = ({ context }) =>
  context.eigentumTotalWorth === "less10000" ||
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" &&
    context.geldanlagen !== undefined &&
    context.geldanlagen.length > 0);

export const grundeigentumDone: FinanzielleAngabenGuard = ({ context }) =>
  context.eigentumTotalWorth === "less10000" ||
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    context.grundeigentum !== undefined &&
    context.grundeigentum.length > 0);

export const kraftfahrzeugeDone: FinanzielleAngabenGuard = ({ context }) =>
  context.eigentumTotalWorth === "less10000" ||
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    context.kraftfahrzeuge !== undefined &&
    context.kraftfahrzeuge.length > 0);

export const wertsachenDone: FinanzielleAngabenGuard = ({ context }) =>
  context.eigentumTotalWorth === "less10000" ||
  context.hasWertsache === "no" ||
  (context.hasWertsache === "yes" &&
    context.wertsachen !== undefined &&
    context.wertsachen.length > 0);

export const eigentumZusammenfassungDone: FinanzielleAngabenGuard = ({
  context,
}) =>
  bankKontoDone({ context }) &&
  geldanlagenDone({ context }) &&
  grundeigentumDone({ context }) &&
  wertsachenDone({ context }) &&
  kraftfahrzeugeDone({ context });
