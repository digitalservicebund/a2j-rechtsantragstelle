import { z } from "zod";
import type { FunctionMultiFieldsValidation } from "~/domains/types";
import { buildStepSchema } from "../buildStepSchema";

describe("buildStepSchema", () => {
  describe("nested fields", () => {
    it("should throw an error for an not existing field name", () => {
      const schemas = {
        step1: z.object({
          field1: z.string(),
        }),
      };
      const fieldNames = ["step2.field1"];
      expect(() => buildStepSchema(schemas, fieldNames)).toThrow();
    });

    it("should return a valid validation for positive entry", () => {
      const schemas = {
        step1: z.object({
          field1: z.string(),
        }),
      };
      const fieldNames = ["step1.field1"];

      const stepSchema = buildStepSchema(schemas, fieldNames);
      const actual = stepSchema.safeParse({
        step1: {
          field1: "value",
        },
      });

      expect(actual).toEqual(
        expect.objectContaining({
          success: true,
          data: {
            step1: {
              field1: "value",
            },
          },
        }),
      );
    });

    it("should return an error because of different fields", () => {
      const schemas = {
        step1: z.object({
          field1: z.string(),
        }),
      };
      const fieldNames = ["step1.field1"];

      const stepSchema = buildStepSchema(schemas, fieldNames);

      const actual = stepSchema.safeParse({
        step1: {},
      });

      expect(actual.error).toBeDefined();
    });
  });

  describe("flat fields", () => {
    it("should throw an error for an not existing field name", () => {
      const schemas = {
        field1: z.string(),
      };
      const fieldNames = ["field2"];
      expect(() => buildStepSchema(schemas, fieldNames)).toThrow();
    });

    it("should return a valid validation for positive entry", () => {
      const schemas = {
        field1: z.string(),
      };
      const fieldNames = ["field1"];

      const stepSchema = buildStepSchema(schemas, fieldNames);

      const actual = stepSchema.safeParse({
        field1: "value",
      });

      expect(actual).toEqual(
        expect.objectContaining({
          success: true,
          data: {
            field1: "value",
          },
        }),
      );
    });

    it("should return an error because of different fields", () => {
      const schemas = {
        field1: z.string(),
      };
      const fieldNames = ["field1"];
      const stepSchema = buildStepSchema(schemas, fieldNames);
      const actual = stepSchema.safeParse({});

      expect(actual.error).toBeDefined();
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
      const stepSchema = buildStepSchema(
        schemas,
        fieldNames,
        multiFieldsValidation,
      );

      const actualValidation = stepSchema.safeParse({
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
      const stepSchema = buildStepSchema(
        schemas,
        fieldNames,
        multiFieldsValidation,
      );

      const actualValidation = stepSchema.safeParse({
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
