import { z } from "zod";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const prozesskostenhilfeWeitereAngabenContext = {
  weitereAngaben: stringOptionalSchema,
};

const _weitereAngabenContextObject = z
  .object(prozesskostenhilfeWeitereAngabenContext)
  .partial();
export type ProzesskostenhilfeWeitereAngabenContext = z.infer<
  typeof _weitereAngabenContextObject
>;
