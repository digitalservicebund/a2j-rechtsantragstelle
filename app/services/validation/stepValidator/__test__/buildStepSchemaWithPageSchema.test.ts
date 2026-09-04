import z from "zod";
import { buildStepSchemaWithPageSchema } from "../buildStepSchemaWithPageSchema";
import { type FunctionMultiFieldsValidation } from "~/domains/types";
import { getMultiFieldsByStepIdValidation } from "../getMultiFieldsByStepIdValidation";
import { type SchemaObject } from "~/domains/userData";

const mockPathname = "/fluggastrechte/vorabcheck/bereich";
vi.mock("../getMultiFieldsByStepIdValidation");

const multiFieldsValidation: FunctionMultiFieldsValidation<
  typeof mockPageSchema
> = (schemas) =>
  schemas.refine(
    ({ field1, field2 }) => {
      if (field1 === undefined || field2 === undefined) {
        // if either field is missing, skip this multi-field validation
        return true;
      }
      return field1 < field2;
    },
    {
      path: ["field1"],
      message: "invalid",
    },
  );

const mockPageSchema = {
  field1: z.number(),
  field2: z.number(),
} as SchemaObject;

describe("buildStepSchemaWithPageSchema", () => {
  it("should build schema correctly", () => {
    const schema = buildStepSchemaWithPageSchema(mockPathname, mockPageSchema);

    expect(z.validate(schema, { field1: 42, field2: 42 })).toBe(true);
  });

  it("should apply multi-fields validation if available", () => {
    vi.mocked(getMultiFieldsByStepIdValidation).mockReturnValue(
      multiFieldsValidation,
    );

    const schema = buildStepSchemaWithPageSchema(mockPathname, mockPageSchema);

    expect(z.validate(schema, { field1: 1, field2: 0 })).toBe(false);
  });
});
