import { z } from "zod";
import formatCents from "./formatCents";
import moneyToCents from "./moneyToCents";
import preprocessMoney from "./preprocessMoney";
import validateMoney from "./validateMoney";

type BuildMoneyValidationSchemaOptions = {
  min?: number;
  max?: number;
};

const DEFAULT_MONEY_VALIDATION_OPTIONS: BuildMoneyValidationSchemaOptions = {
  min: 0,
};

export const buildMoneyValidationSchema = (
  opts: BuildMoneyValidationSchemaOptions = DEFAULT_MONEY_VALIDATION_OPTIONS,
) => {
  return z
    .string()
    .trim()
    .min(1, "required")
    .transform((v) => preprocessMoney(v))
    .refine((v) => validateMoney(v), { error: "wrong_format", abort: true })
    .transform((v) => moneyToCents(v)!)
    .refine((v) => v >= (opts.min ?? Number.MIN_SAFE_INTEGER), {
      message: "too_little",
    })
    .refine((v) => v <= (opts.max ?? Number.MAX_SAFE_INTEGER), {
      message: "too_much",
    })
    .transform((v) => formatCents(v));
};

export const buildOptionalMoneyValidationSchema = (
  opts: BuildMoneyValidationSchemaOptions = DEFAULT_MONEY_VALIDATION_OPTIONS,
) => {
  const baseSchema = buildMoneyValidationSchema(opts);

  return z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (val === "") return;

      const result = baseSchema.safeParse(val);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: "custom",
            message: issue.message,
            path: issue.path,
          });
        });
      }
    })
    .transform((val) => (val === "" ? "" : baseSchema.parse(val)));
};
