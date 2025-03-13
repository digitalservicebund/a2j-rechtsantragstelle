import { prozesskostenhilfeAntragstellendePersonContext } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/context";
import { prozesskostenhilfeGrundvoraussetzungen } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/context";
import { belegeContext } from "~/domains/shared/formular/abgabe/context";
import { prozesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import { prozesskostenhilfeGesetzlicheVertretungContext } from "./gesetzlicheVertretung/context";
import { prozesskostenhilfePersoenlicheDatenContext } from "./persoenlicheDaten/context";
import { prozesskostenhilfeRsvContext } from "./rechtsschutzversicherung/context";
import { prozesskostenhilfeWeitereAngabenContext } from "./weitereAngaben/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeGrundvoraussetzungen,
  ...prozesskostenhilfeAntragstellendePersonContext,
  ...prozesskostenhilfeRsvContext,
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...prozesskostenhilfeGesetzlicheVertretungContext,
  ...prozesskostenhilfePersoenlicheDatenContext,
  ...belegeContext,
  ...prozesskostenhilfeWeitereAngabenContext,
} as const;
