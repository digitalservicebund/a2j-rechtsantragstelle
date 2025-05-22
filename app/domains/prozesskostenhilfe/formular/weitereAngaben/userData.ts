import { z } from "zod";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const prozesskostenhilfeWeitereAngabenInputSchema = {
  weitereAngaben: stringOptionalSchema,
};

const _partialSchema = z
  .object(prozesskostenhilfeWeitereAngabenInputSchema)
  .partial();
export type ProzesskostenhilfeWeitereAngabenUserData = z.infer<
  typeof _partialSchema
>;
