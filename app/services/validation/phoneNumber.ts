import { z } from "zod";

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ]{3,25}$/, { message: "invalid" });
