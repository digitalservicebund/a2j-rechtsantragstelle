import { z } from "zod";
import { dynamicSelectZodDescription } from "~/services/validation/dynamicSelect";

// Dynamic parent select values: stringified index or absent. The placeholder's
// empty string is rejected so the user must pick a parent. The valid index
// range is runtime data, so consumers fall back to the physical parent.
export const parentKindIndexSchema = z
  .string()
  .regex(/^\d+$/, { message: "required" })
  .optional()
  .describe(dynamicSelectZodDescription);

export const parentElternteilIndexSchema = z
  .string()
  .regex(/^(\d+|both)$/, { message: "required" })
  .optional()
  .describe(dynamicSelectZodDescription);
