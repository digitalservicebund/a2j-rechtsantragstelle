import { z } from "zod";
import {
  geburtsdatum,
  adresseSchema,
  vornameNachnameSchema,
  telefonnummer,
  beruf,
} from "~/domains/shared/persoenlicheDaten/context";

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
