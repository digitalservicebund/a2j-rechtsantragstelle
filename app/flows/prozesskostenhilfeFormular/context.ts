import { prozesskostenhilfeAntragstellendePersonContext } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";
import { prozesskostenhilfeGrundvoraussetzungen } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import { prozesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { prozesskostenhilfePersoenlicheDatenContext } from "./persoenlicheDaten/context";
import { prozesskostenhilfeRsvContext } from "./rechtsschutzversicherung/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeGrundvoraussetzungen,
  ...prozesskostenhilfeAntragstellendePersonContext,
  ...prozesskostenhilfeRsvContext,
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...prozesskostenhilfePersoenlicheDatenContext,
} as const;
