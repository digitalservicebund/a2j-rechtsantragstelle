import { type ProzesskostenhilfeAbgabeUserData } from "~/domains/prozesskostenhilfe/formular/abgabe/userData";
import { type ProzesskostenhilfeGrundvoraussetzungenUserData } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";
import { type ProzesskostenhilfeAntragstellendePersonUserData } from "./antragstellendePerson/userData";
import {
  prozesskostenhilfeFinanzielleAngabenInputSchema,
  type ProzesskostenhilfeFinanzielleAngabenUserData,
} from "./finanzielleAngaben/userData";
import { type ProzesskostenhilfeGesetzlicheVertretungUserData } from "./gesetzlicheVertretung/userData";
import { type ProzesskostenhilfePersoenlicheDatenUserData } from "./persoenlicheDaten/userData";
import { type ProzesskostenhilfeRechtsschutzversicherungUserData } from "./rechtsschutzversicherung/userData";
import { type ProzesskostenhilfeWeitereAngabenUserData } from "./weitereAngaben/userData";

export const prozesskostenhilfeFormularUserData = {
  ...prozesskostenhilfeFinanzielleAngabenInputSchema,
} as const;

export type ProzesskostenhilfeFormularUserData =
  ProzesskostenhilfeGrundvoraussetzungenUserData &
    ProzesskostenhilfeAntragstellendePersonUserData &
    ProzesskostenhilfeRechtsschutzversicherungUserData &
    ProzesskostenhilfeFinanzielleAngabenUserData &
    ProzesskostenhilfeGesetzlicheVertretungUserData &
    ProzesskostenhilfePersoenlicheDatenUserData &
    ProzesskostenhilfeWeitereAngabenUserData &
    ProzesskostenhilfeAbgabeUserData;
