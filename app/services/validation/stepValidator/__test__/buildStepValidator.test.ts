import { z } from "zod";
import { buildStepValidator } from "~/services/validation/stepValidator/buildStepValidator";

describe("buildStepValidator", () => {
  describe("nested fields", () => {
    it("should throw an error for an not existing field name", () => {
      const schemas = {
        step1: z.object({
          field1: z.string(),
        }),
      };
      const fieldNames = ["step2.field1"];
      expect(() => buildStepValidator(schemas, fieldNames)).toThrow();
    });

    it("should return a valid validation for a existing field", async () => {
      const schemas = {
        step1: z.object({
          field1: z.string(),
        }),
      };
      const fieldNames = ["step1.field1"];

      const validator = buildStepValidator(schemas, fieldNames);

      // Expect a positive validation
      expect(
        await validator.validate({
          step1: {
            field1: "value",
          },
        }),
      ).toEqual(
        expect.objectContaining({
          error: undefined,
          data: {
            step1: {
              field1: "value",
            },
          },
        }),
      );
      // Expect a negative validation after validation because of different fields
      expect(
        (
          await validator.validate({
            step1: {},
          })
        ).error,
      ).toBeDefined();
    });
  });

  describe("flat fields", () => {
    it("should throw an error for an not existing field name", () => {
      const schemas = {
        field1: z.string(),
      };
      const fieldNames = ["field2"];
      expect(() => buildStepValidator(schemas, fieldNames)).toThrow();
    });

    it("should return a valid validation for a existing field", async () => {
      const schemas = {
        field1: z.string(),
      };
      const fieldNames = ["field1"];

      const validator = buildStepValidator(schemas, fieldNames);

      // Expect a positive validation
      expect(
        await validator.validate({
          field1: "value",
        }),
      ).toEqual(
        expect.objectContaining({
          error: undefined,
          data: {
            field1: "value",
          },
        }),
      );
      // Expect a negative validation after validation because of different fields
      expect((await validator.validate({})).error).toBeDefined();
    });
  });
});
