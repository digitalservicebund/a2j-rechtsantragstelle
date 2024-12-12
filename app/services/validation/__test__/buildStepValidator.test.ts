import { z } from "zod";
import { flowIds } from "~/domains/flowIds";
import { buildStepValidator } from "~/services/validation/buildStepValidator";

describe("buildStepValidator", () => {
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * flowIds.length);

  describe("nested fields", () => {
    it("should throw an error for an not existing field name", () => {
      const schemas = {
        step1: z.object({
          field1: z.string(),
        }),
      };
      const fieldNames = ["step2.field1"];
      expect(() =>
        buildStepValidator(schemas, fieldNames, flowIds[randomIndex]),
      ).toThrow();
    });

    it("should return a valid validation for a existing field", async () => {
      const schemas = {
        step1: z.object({
          field1: z.string(),
        }),
      };
      const fieldNames = ["step1.field1"];

      const validator = buildStepValidator(
        schemas,
        fieldNames,
        flowIds[randomIndex],
      );

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
      expect(() =>
        buildStepValidator(schemas, fieldNames, flowIds[randomIndex]),
      ).toThrow();
    });

    it("should return a valid validation for a existing field", async () => {
      const schemas = {
        field1: z.string(),
      };
      const fieldNames = ["field1"];

      const validator = buildStepValidator(
        schemas,
        fieldNames,
        flowIds[randomIndex],
      );

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

  describe("specialFieldValidators", () => {
    it("should return a validator for arrival time delay", () => {
      const schemas = {
        tatsaechlicherAnkunftsDatum: z.string(),
        tatsaechlicherAnkunftsZeit: z.string(),
        direktAbflugsDatum: z.string(),
        direktAbflugsZeit: z.string(),
      };
      const fieldNames = ["tatsaechlicherAnkunftsDatum"];

      const validator = buildStepValidator(
        schemas,
        fieldNames,
        "/fluggastrechte/formular",
      );

      expect(validator).toBeDefined();
    });
  });
});
