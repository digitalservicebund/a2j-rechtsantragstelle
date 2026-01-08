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
    .transform((v) => {
      if (v === "") return { type: "empty" as const, value: "" };

      const result = baseSchema.safeParse(v);
      if (!result.success) {
        return { type: "error" as const, error: result.error };
      }
      return { type: "success" as const, value: result.data };
    })
    .superRefine((parsed, ctx) => {
      if (parsed.type === "error") {
        parsed.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: "custom",
            message: issue.message,
            path: issue.path,
          });
        });
      }
    })
    .transform((parsed) => {
      return parsed.type === "empty" ? "" : parsed.value;
    });
};
