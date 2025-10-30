import type { FinanzielleAngabenGuard } from "./guards";
import { bankkontenArraySchema } from "./userData";

export const bankKontoDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" &&
    bankkontenArraySchema.safeParse(context.bankkonten).success);
