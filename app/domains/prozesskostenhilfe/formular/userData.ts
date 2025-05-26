import {
  prozesskostenhilfeGrundvoraussetzungenInputSchema,
  type ProzesskostenhilfeGrundvoraussetzungenUserData,
} from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";
import {
  abgabeInputSchema,
  type AbgabeUserData,
} from "~/domains/shared/formular/abgabe/userData";
import {
  prozesskostenhilfeDokumenteInputSchema,
  type ProzesskostenhilfeDokumenteUserData,
} from "./abgabe/dokumente/userData";
import {
  prozesskostenhilfeAntragstellendePersonInputSchema,
  type ProzesskostenhilfeAntragstellendePersonUserData,
} from "./antragstellendePerson/userData";
import {
  prozesskostenhilfeFinanzielleAngabenInputSchema,
  type ProzesskostenhilfeFinanzielleAngabenUserData,
} from "./finanzielleAngaben/userData";
import {
  type ProzesskostenhilfeGesetzlicheVertretungUserData,
  prozesskostenhilfeGesetzlicheVertretungInputSchema,
} from "./gesetzlicheVertretung/userData";
import {
  prozesskostenhilfePersoenlicheDatenInputSchema,
  type ProzesskostenhilfePersoenlicheDatenUserData,
} from "./persoenlicheDaten/userData";
import {
  type ProzesskostenhilfeRechtsschutzversicherungUserData,
  prozesskostenhilfeRsvInputSchema,
} from "./rechtsschutzversicherung/userData";
import {
  type ProzesskostenhilfeWeitereAngabenUserData,
  prozesskostenhilfeWeitereAngabenInputSchema,
} from "./weitereAngaben/userData";

export const prozesskostenhilfeFormularUserData = {
  ...prozesskostenhilfeGrundvoraussetzungenInputSchema,
  ...prozesskostenhilfeAntragstellendePersonInputSchema,
  ...prozesskostenhilfeRsvInputSchema,
  ...prozesskostenhilfeFinanzielleAngabenInputSchema,
  ...prozesskostenhilfeGesetzlicheVertretungInputSchema,
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
