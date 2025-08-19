import { z } from "zod";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { getNestedSchema } from "../getNestedSchema";

describe("getNestedSchema", () => {
  const innerSchema = z.string();
  const outerSchemas = [
    innerSchema,
    z.optional(innerSchema),
    z.nullable(innerSchema),
    innerSchema.transform((val) => val),
    z.nullable(z.optional(innerSchema)).transform((val) => val),
    innerSchema.or(z.number()),
    z.union([innerSchema, z.number(), z.boolean()]),
    schemaOrEmptyString(innerSchema),
  ];
  outerSchemas.forEach((outerSchema) => {
    it(`should unwrap ${outerSchema.def.type}`, () => {
      expect(getNestedSchema(outerSchema)).toEqual(innerSchema);
    });
  });
});
