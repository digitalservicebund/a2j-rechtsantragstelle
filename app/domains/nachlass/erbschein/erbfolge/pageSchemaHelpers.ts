import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { dynamicSelectZodDescription } from "~/services/validation/dynamicSelect";

// The 3-variant person node shared by Kind, ElternteilKind and Elternteil:
// alive / dead-without-kids / dead-with-kids. `childSchema` types the optional
// `kinder` array; `extra` adds fields present on every variant (e.g. the parent select).
export function personUnion<
  Child extends z.ZodTypeAny,
  Extra extends z.ZodRawShape = {},
>(childSchema: Child, extra: Extra = {} as Extra) {
  return z.union([
    z.object({ name: z.string(), isAlive: z.literal("yes"), ...extra }),
    z.object({
      name: z.string(),
      isAlive: z.literal("no"),
      hatteKinder: z.literal("no"),
      ...extra,
    }),
    z.object({
      name: z.string(),
      isAlive: z.literal("no"),
      hatteKinder: z.literal("yes"),
      kinder: z.array(childSchema).optional(),
      ...extra,
    }),
  ]);
}

// Dynamic parent select values: stringified index or absent. The placeholder's
// empty string is rejected so the user must pick a parent. The valid index
// range is runtime data, so consumers fall back to the physical parent.
export const parentKindIndexSchema = z
  .string()
  .regex(/^\d+$/, { message: "required" })
  .optional()
  .describe(dynamicSelectZodDescription);

// Elternteil variant also allows "both" (full sibling).
export const parentElternteilIndexSchema = z
  .string()
  .regex(/^(\d+|both)$/, { message: "required" })
  .optional()
  .describe(dynamicSelectZodDescription);

// Field-shape helpers. `prefix` is the array path in `#` notation, e.g. "kinder#"
// or "elternteile#kinder#", so keys resolve to the right nesting depth.
export const datenFields = (prefix: string) => ({
  [`${prefix}name`]: z.string(),
  [`${prefix}isAlive`]: YesNoAnswer,
});

export const hatteKinderField = (prefix: string) => ({
  [`${prefix}hatteKinder`]: YesNoAnswer,
});
