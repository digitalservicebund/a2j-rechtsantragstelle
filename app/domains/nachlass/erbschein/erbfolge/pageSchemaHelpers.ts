import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

// The 3-variant person node shared by Kind, ElternteilKind and Elternteil:
// alive / dead-without-kids / dead-with-kids. `childSchema` types the optional
// `kinder` array; `extra` adds fields present on every variant (e.g. the parent select).
export function personUnion<
  Child extends z.ZodTypeAny,
  Extra extends z.ZodRawShape = {},
>(childSchema: Child, extra: Extra = {} as Extra) {
  return z.union([
    z.object({
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      isAlive: z.literal("yes"),
      ...extra,
    }),
    z.object({
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      isAlive: z.literal("no"),
      hatteKinder: z.literal("no"),
      ...extra,
    }),
    z.object({
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      isAlive: z.literal("no"),
      hatteKinder: z.literal("yes"),
      kinder: z.array(childSchema).optional(),
      ...extra,
    }),
  ]);
}

// Field-shape helpers. `prefix` is the array path in `#` notation, e.g. "kinder#"
// or "elternteile#kinder#", so keys resolve to the right nesting depth.
export const datenFields = (prefix: string) => ({
  [`${prefix}vorname`]: stringRequiredSchema,
  [`${prefix}nachname`]: stringRequiredSchema,
  [`${prefix}isAlive`]: YesNoAnswer,
});

export const hatteKinderField = (prefix: string) => ({
  [`${prefix}hatteKinder`]: YesNoAnswer,
});
