import { prozesskostenhilfeGrundvoraussetzungen } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import { prozesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { prozesskostenhilfePersoenlicheDatenContext } from "./persoenlicheDaten/context";
import { prozesskostenhilfeRsvContext } from "./rechtsschutzversicherung/context";
import { abgabeContext } from "../shared/abgabe/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeGrundvoraussetzungen,
  ...prozesskostenhilfeRsvContext,
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...prozesskostenhilfePersoenlicheDatenContext,
  ...abgabeContext,
} as const;
