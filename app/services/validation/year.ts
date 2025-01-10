import { z } from "zod";

// From https://fimportal.de/kataloge
const defaultEarliestYear = 1850;
const defaultLatestYear = 2080;

// Arguments may be used like this: { earliest: () => today().getFullYear() - 10 }
export const createYearSchema = (args?: {
  earliest?: () => number;
  latest?: () => number;
  optional?: boolean;
}) => {
  const isOptional = Boolean(args?.optional);
  const earliest = args?.earliest?.() ?? defaultEarliestYear;
  const latest = args?.latest?.() ?? defaultLatestYear;

  const schema = z
    .string()
    .min(1, { message: "required" })
    .transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed < earliest || parsed > latest) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "invalidYear",
        });
        return z.NEVER;
      }
      return parsed;
    });

  return isOptional
    ? schema.or(z.string().max(0, "invalidYear")).optional()
    : schema;
};
