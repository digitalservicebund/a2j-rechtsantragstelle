import { z } from "zod";
import {
  geburtsdatum,
  adresseSchema,
  vornameNachnameSchema,
  telefonnummer,
  beruf,
} from "~/flows/shared/persoenlicheDaten/context";

export const pkhPersoenlicheDaten = {
  ...vornameNachnameSchema,
  ...adresseSchema,
  geburtsdatum,
  telefonnummer,
  beruf,
};

const _contextObject = z.object(pkhPersoenlicheDaten).partial();
export type ProzesskostenhilfePersoenlicheDaten = z.infer<
  typeof _contextObject
>;
