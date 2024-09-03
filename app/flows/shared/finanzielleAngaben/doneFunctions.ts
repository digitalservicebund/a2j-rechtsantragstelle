import { arrayIsNonEmpty } from "~/util/array";
import type { FinanzielleAngabenGuard } from "./guards";

export const bankKontoDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" && arrayIsNonEmpty(context.bankkonten));
