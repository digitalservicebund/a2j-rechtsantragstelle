import isEmail from "validator/lib/isEmail";
import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .refine((email) => isEmail(email), { message: "invalid" });
