import { z } from "zod";

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d ]{3,25}$/, { message: "invalid" });
