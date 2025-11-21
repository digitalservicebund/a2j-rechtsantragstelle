import { type ZodType } from "zod";

export const hiddenInputZodDescription = "hidden_input";

export const hiddenInputSchema = <T extends ZodType>(schema: T) =>
  schema.meta({ description: hiddenInputZodDescription });
