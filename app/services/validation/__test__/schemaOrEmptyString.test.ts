import { z } from "zod";
import {
  schemaOrEmptyString,
  schemaOrEmptyStringOptional,
} from "~/services/validation/schemaOrEmptyString";

describe("schemaOrEmptyString", () => {
  const schema = schemaOrEmptyString(z.string().length(3));
  const validCases = ["", "   ", "123"] as const;
  const invalidCases = ["12", "  "] as const;

  validCases.forEach((validCase) => {
    it(`allows '${validCase}' as input`, () => {
      expect(schema.parse(validCase)).toEqual(validCase);
    });
  });

  invalidCases.forEach((invalidCase) => {
    it(`throws with '${invalidCase}' as input`, () => {
      expect(() => schema.parse(invalidCase)).toThrow(expect.anything());
    });
  });
});

describe("schemaOrEmptyStringOptional", () => {
  const schema = schemaOrEmptyStringOptional(z.string().length(3));
  const validCases = ["", "   ", "123", undefined] as const;
  const invalidCases = ["12", "  "] as const;

  validCases.forEach((validCase) => {
    it(`allows '${validCase}' as input`, () => {
      expect(schema.parse(validCase)).toEqual(validCase);
    });
  });

  invalidCases.forEach((invalidCase) => {
    it(`throws with '${invalidCase}' as input`, () => {
      expect(() => schema.parse(invalidCase)).toThrow(expect.anything());
    });
  });
});
