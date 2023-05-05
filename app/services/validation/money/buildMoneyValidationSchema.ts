import { z } from "zod";

import preprocessMoney from "./preprocessMoney";
import validateMoney from "./validateMoney";
import moneyToCents from "./moneyToCents";
import formatCents from "./formatCents";

type BuildMoneyValidationSchemaOptions = {
  min?: number;
  max?: number;
};

export const buildMoneyValidationSchema = (
  opts?: BuildMoneyValidationSchemaOptions
) => {
  return z
    .string()
    .trim()
    .min(1, "required")
    .transform((v) => preprocessMoney(v))
    .refine((v) => validateMoney(v), { message: "wrong_format" })
    .transform((v) => moneyToCents(v))
    .refine(
      (v) =>
        v >=
        (typeof opts?.min === "undefined" ? Number.MIN_SAFE_INTEGER : opts.min),
      { message: "too_little" }
    )
    .refine(
      (v) =>
        v <=
        (typeof opts?.max === "undefined" ? Number.MAX_SAFE_INTEGER : opts.max),
      { message: "too_much" }
    )
    .transform((v) => formatCents(v));
};
