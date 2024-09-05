import type { BeratungshilfeFinanzielleAngabenGuard } from "./BeratungshilfeFinanzielleAngabenGuardType";

export const hasAnyEigentumExceptBankaccount: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.hasGeldanlage == "yes" ||
    context.hasWertsache == "yes" ||
    context.hasGrundeigentum == "yes" ||
    context.hasKraftfahrzeug == "yes";
