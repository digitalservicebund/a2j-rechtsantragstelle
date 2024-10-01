import { prozesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { prozesskostenhilfePersoenlicheDatenContext } from "./persoenlicheDaten/context";
import { abgabeContext } from "../shared/abgabe/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...prozesskostenhilfePersoenlicheDatenContext,
  ...abgabeContext,
} as const;
