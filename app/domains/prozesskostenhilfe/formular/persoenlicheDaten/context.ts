import { z } from "zod";
import {
  geburtsdatum,
  adresseSchema,
  vornameNachnameSchema,
  telefonnummer,
  beruf,
} from "~/domains/shared/formular/persoenlicheDaten/userData";

export const prozesskostenhilfePersoenlicheDatenContext = {
  ...vornameNachnameSchema,
  ...adresseSchema,
  geburtsdatum,
  telefonnummer,
  beruf,
};

const _contextObject = z
  .object(prozesskostenhilfePersoenlicheDatenContext)
  .partial();
export type ProzesskostenhilfePersoenlicheDaten = z.infer<
  typeof _contextObject
>;
