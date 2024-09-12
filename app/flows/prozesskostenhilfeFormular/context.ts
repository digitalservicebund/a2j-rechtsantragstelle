import { prozesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { finanzielleAngabenPartnerContext } from "~/flows/shared/finanzielleAngaben/partner/context";
import { prozesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { abgabeContext } from "../shared/abgabe/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...finanzielleAngabenPartnerContext,
  ...prozesskostenhilfeFinanzielleAngabenEinkuenfteContext,
  ...abgabeContext,
} as const;
