import { z } from "zod";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const weitereAngabenSchema = {
  weitereAngaben: stringOptionalSchema,
};

const _partialSchema = z.object(weitereAngabenSchema).partial();
export type WeitereAngabenUserData = z.infer<typeof _partialSchema>;
