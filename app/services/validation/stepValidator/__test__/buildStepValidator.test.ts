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

    it("should return a valid validation for a existing field", () => {
      const schemas = {
        step1: z.object({
          field1: z.string(),
        }),
      };
      const fieldNames = ["step1.field1"];

      const validator = buildStepValidator(schemas, fieldNames);
      const actual1 = validator.safeParse({
        step1: {
          field1: "value",
        },
      });

      // Expect a positive validation
      expect(actual1).toEqual(
        expect.objectContaining({
          success: true,
          data: {
            step1: {
              field1: "value",
            },
          },
        }),
      );

      // Expect a negative validation after validation because of different fields
      const actual2 = validator.safeParse({
        step1: {},
      });

      expect(actual2.error).toBeDefined();
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

    it("should return a valid validation for a existing field", () => {
      const schemas = {
        field1: z.string(),
      };
      const fieldNames = ["field1"];

      const validator = buildStepValidator(schemas, fieldNames);

      const actual1 = validator.safeParse({
        field1: "value",
      });

      // Expect a positive validation
      expect(actual1).toEqual(
        expect.objectContaining({
          success: true,
          data: {
            field1: "value",
          },
        }),
      );
      // Expect a negative validation after validation because of different fields
      const actual2 = validator.safeParse({});

      expect(actual2.error).toBeDefined();
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

    it("should return an error object given the field1 bigger than field2", () => {
      const validator = buildStepValidator(
        schemas,
        fieldNames,
        multiFieldsValidation,
      );

      const actualValidation = validator.safeParse({
        field1: 1,
        field2: 0,
      });

      expect(actualValidation).toEqual(
        expect.objectContaining({
          success: false,
        }),
      );
    });

    it("should return data object given the field1 smaller than field2", () => {
      const validator = buildStepValidator(
        schemas,
        fieldNames,
        multiFieldsValidation,
      );

      const actualValidation = validator.safeParse({
        field1: 1,
        field2: 2,
      });

      expect(actualValidation).toEqual(
        expect.objectContaining({
          success: true,
          data: {
            field1: 1,
            field2: 2,
          },
        }),
      );
    });
  });
});
