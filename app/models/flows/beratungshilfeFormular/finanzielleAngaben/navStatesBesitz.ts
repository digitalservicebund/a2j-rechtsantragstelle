import type { FinanzielleAngabenGuard } from "./navStates";

export const besitzDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto !== undefined &&
  context.hasKraftfahrzeug !== undefined &&
  context.hasGeldanlage !== undefined &&
  context.hasGrundeigentum !== undefined &&
  context.hasWertsache !== undefined &&
  context.besitzTotalWorth !== undefined;

const bankKontoDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" &&
    context.bankkonten !== undefined &&
    context.bankkonten.length > 0);

const geldanlagenDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" &&
    context.geldanlagen !== undefined &&
    context.geldanlagen.length > 0);

const grundeigentumDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    context.grundeigentum !== undefined &&
    context.grundeigentum.length > 0);

const kraftfahrzeugeDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    context.kraftfahrzeuge !== undefined &&
    context.kraftfahrzeuge.length > 0);

const wertsachenDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasWertsache === "no" ||
  (context.hasWertsache === "yes" &&
    context.wertsachen !== undefined &&
    context.wertsachen.length > 0);

export const besitzZusammenfassungDone: FinanzielleAngabenGuard = ({
  context,
}) =>
  bankKontoDone({ context }) &&
  geldanlagenDone({ context }) &&
  grundeigentumDone({ context }) &&
  wertsachenDone({ context }) &&
  kraftfahrzeugeDone({ context });
