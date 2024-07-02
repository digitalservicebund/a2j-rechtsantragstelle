import validator from "validator";
import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .refine((email) => validator.isEmail(email), { message: "invalid" });
