import { z } from "zod";

export const phoneNumberZodDescription = "telephone";

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d ]{6,25}$/, { message: "invalid" })
  .describe(phoneNumberZodDescription);
