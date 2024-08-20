import { prozesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { abgabeContext } from "../shared/abgabe/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...abgabeContext,
} as const;
