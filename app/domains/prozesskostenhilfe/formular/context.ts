import {
  type ProzesskostenhilfeAntragstellendePersonContext,
  prozesskostenhilfeAntragstellendePersonContext,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/context";
import {
  prozesskostenhilfeGrundvoraussetzungen,
  type ProzesskostenhilfeGrundvoraussetzungenContext,
} from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/context";
import {
  type ProzesskostenhilfeFinanzielleAngabenContext,
  prozesskostenhilfeFinanzielleAngabenContext,
} from "./finanzielleAngaben/context";
import {
  type ProzesskostenhilfeGesetzlicheVertretung,
  prozesskostenhilfeGesetzlicheVertretungContext,
} from "./gesetzlicheVertretung/context";
import {
  type ProzesskostenhilfePersoenlicheDaten,
  prozesskostenhilfePersoenlicheDatenContext,
} from "./persoenlicheDaten/context";
import {
  type ProzesskostenhilfeRechtsschutzversicherungContext,
  prozesskostenhilfeRsvContext,
} from "./rechtsschutzversicherung/context";
import {
  type ProzesskostenhilfeWeitereAngabenContext,
  prozesskostenhilfeWeitereAngabenContext,
} from "./weitereAngaben/context";

export const prozesskostenhilfeFormularContext = {
  ...prozesskostenhilfeGrundvoraussetzungen,
  ...prozesskostenhilfeAntragstellendePersonContext,
  ...prozesskostenhilfeRsvContext,
  ...prozesskostenhilfeFinanzielleAngabenContext,
  ...prozesskostenhilfeGesetzlicheVertretungContext,
  ...prozesskostenhilfePersoenlicheDatenContext,
  ...prozesskostenhilfeWeitereAngabenContext,
} as const;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeGrundvoraussetzungenContext &
    ProzesskostenhilfeAntragstellendePersonContext &
    ProzesskostenhilfeRechtsschutzversicherungContext &
    ProzesskostenhilfeFinanzielleAngabenContext &
    ProzesskostenhilfeGesetzlicheVertretung &
    ProzesskostenhilfePersoenlicheDaten &
    ProzesskostenhilfeWeitereAngabenContext;
