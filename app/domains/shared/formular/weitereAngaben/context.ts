import { z } from "zod";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const weitereAngabenContext = {
  weitereAngaben: stringOptionalSchema,
};

const _weitereAngabenContextObject = z.object(weitereAngabenContext).partial();
export type WeitereAngabenContext = z.infer<
  typeof _weitereAngabenContextObject
>;
