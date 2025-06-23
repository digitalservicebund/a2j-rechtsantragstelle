import omit from "lodash/omit";
import { z } from "zod";
import {
  persoenlicheDaten,
  geburtsdatum,
} from "~/domains/shared/formular/persoenlicheDaten/userData";
import { emailSchema } from "~/services/validation/email";

export const beratungshilfePersoenlicheDatenInputSchema = {
  ...omit(persoenlicheDaten, ["title"]),
  geburtsdatum,
  nachbefragungEmail: emailSchema.optional().or(z.literal("")),
};

const _partialSchema = z
  .object(beratungshilfePersoenlicheDatenInputSchema)
  .partial();
export type BeratungshilfePersoenlicheDatenUserData = z.infer<
  typeof _partialSchema
>;
