import { z } from "zod";
import { getNestedSchema } from "../getNestedSchema";

describe("getNestedSchema", () => {
  const innerSchema = z.string();
  const outerSchemas = [
    innerSchema,
    z.optional(innerSchema),
    z.nullable(innerSchema),
    innerSchema.transform((val) => val),
    z.nullable(z.optional(innerSchema)).transform((val) => val),
  ];
  outerSchemas.forEach((outerSchema) => {
    it(`should unwrap ${outerSchema.def.type}`, () => {
      expect(getNestedSchema(outerSchema)).toEqual(innerSchema);
    });
  });
});
