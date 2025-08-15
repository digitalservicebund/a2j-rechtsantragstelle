import { type ProzesskostenhilfeGrundvoraussetzungenUserData } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";
import {
  abgabeInputSchema,
  type AbgabeUserData,
} from "~/domains/shared/formular/abgabe/userData";
import {
  prozesskostenhilfeDokumenteInputSchema,
  type ProzesskostenhilfeDokumenteUserData,
} from "./abgabe/dokumente/userData";
import { type ProzesskostenhilfeAntragstellendePersonUserData } from "./antragstellendePerson/userData";
import {
  prozesskostenhilfeFinanzielleAngabenInputSchema,
  type ProzesskostenhilfeFinanzielleAngabenUserData,
} from "./finanzielleAngaben/userData";
import { type ProzesskostenhilfeGesetzlicheVertretungUserData } from "./gesetzlicheVertretung/userData";
import {
  prozesskostenhilfePersoenlicheDatenInputSchema,
  type ProzesskostenhilfePersoenlicheDatenUserData,
} from "./persoenlicheDaten/userData";
import { type ProzesskostenhilfeRechtsschutzversicherungUserData } from "./rechtsschutzversicherung/userData";
import {
  type ProzesskostenhilfeWeitereAngabenUserData,
  prozesskostenhilfeWeitereAngabenInputSchema,
} from "./weitereAngaben/userData";

export const prozesskostenhilfeFormularUserData = {
  ...prozesskostenhilfeFinanzielleAngabenInputSchema,
  ...prozesskostenhilfePersoenlicheDatenInputSchema,
  ...prozesskostenhilfeWeitereAngabenInputSchema,
  ...prozesskostenhilfeDokumenteInputSchema,
  ...abgabeInputSchema,
} as const;

export type ProzesskostenhilfeFormularUserData =
  ProzesskostenhilfeGrundvoraussetzungenUserData &
    ProzesskostenhilfeAntragstellendePersonUserData &
    ProzesskostenhilfeRechtsschutzversicherungUserData &
    ProzesskostenhilfeFinanzielleAngabenUserData &
    ProzesskostenhilfeGesetzlicheVertretungUserData &
    ProzesskostenhilfePersoenlicheDatenUserData &
    ProzesskostenhilfeWeitereAngabenUserData &
    ProzesskostenhilfeDokumenteUserData &
    AbgabeUserData;
