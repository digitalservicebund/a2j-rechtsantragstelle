import omit from "lodash/omit";
import { z } from "zod";
import {
  geburtsdatum,
  adresseSchema,
  vornameNachnameSchema,
  telefonnummer,
  beruf,
} from "~/domains/shared/formular/persoenlicheDaten/userData";

export const prozesskostenhilfePersoenlicheDatenInputSchema = {
  ...vornameNachnameSchema,
  ...omit(adresseSchema, "strasseHausnummer"),
  geburtsdatum,
  telefonnummer,
  beruf,
};

const _partialSchema = z
  .object(prozesskostenhilfePersoenlicheDatenInputSchema)
  .partial();
export type ProzesskostenhilfePersoenlicheDatenUserData = z.infer<
  typeof _partialSchema
>;
