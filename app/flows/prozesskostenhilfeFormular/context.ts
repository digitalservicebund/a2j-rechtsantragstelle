import { prozesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { prozesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { abgabeContext } from "../shared/abgabe/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...prozesskostenhilfeFinanzielleAngabenEinkuenfteContext,
  ...abgabeContext,
} as const;
