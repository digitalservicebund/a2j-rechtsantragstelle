import { z } from "zod";
import type { FunctionMultiFieldsValidation } from "~/domains/multiFieldsFlowValidation";
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

  describe("multi fields validation", () => {
    const schemas = {
      field1: z.number(),
      field2: z.number(),
    };

    const multiFieldsValidation: FunctionMultiFieldsValidation = (schemas) =>
      schemas.refine(
        ({ field1, field2 }) => {
          return field1 < field2;
        },
        {
          path: ["field1"],
          message: "invalid",
        },
      );

    const fieldNames = ["field1", "field2"];

    it("should return an error object given the field1 bigger than field2", async () => {
      const validator = buildStepValidator(
        schemas,
        fieldNames,
        multiFieldsValidation,
      );

      const actualValidation = await validator.validate({
        field1: 1,
        field2: 0,
      });

      expect(actualValidation).toEqual(
        expect.objectContaining({
          error: {
            fieldErrors: { field1: "invalid" },
          },
        }),
      );
    });

    it("should return data object given the field1 smaller than field2", async () => {
      const validator = buildStepValidator(
        schemas,
        fieldNames,
        multiFieldsValidation,
      );

      const actualValidation = await validator.validate({
        field1: 1,
        field2: 2,
      });

      expect(actualValidation).toEqual(
        expect.objectContaining({
          error: undefined,
          data: {
            field1: 1,
            field2: 2,
          },
        }),
      );
    });
  });
});
