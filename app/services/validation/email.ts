import { z } from "zod";
import isEmail from "validator/lib/isEmail";

export const emailSchema = z
  .string()
  .trim()
  .refine((email) => isEmail(email), { message: "invalid" });
