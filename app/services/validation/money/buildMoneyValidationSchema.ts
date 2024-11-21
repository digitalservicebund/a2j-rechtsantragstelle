import { z } from "zod";
import formatCents from "./formatCents";
import moneyToCents from "./moneyToCents";
import preprocessMoney from "./preprocessMoney";
import validateMoney from "./validateMoney";

type BuildMoneyValidationSchemaOptions = {
  min?: number;
  max?: number;
};

export const buildMoneyValidationSchema = (
  opts: BuildMoneyValidationSchemaOptions = { min: 0 },
) => {
  return z
    .string()
    .trim()
    .min(1, "required")
    .transform((v) => preprocessMoney(v))
    .refine((v) => validateMoney(v), { message: "wrong_format" })
    .transform((v) => moneyToCents(v)!)
    .refine((v) => v >= (opts.min ?? Number.MIN_SAFE_INTEGER), {
      message: "too_little",
    })
    .refine((v) => v <= (opts.max ?? Number.MAX_SAFE_INTEGER), {
      message: "too_much",
    })
    .transform((v) => formatCents(v));
};
