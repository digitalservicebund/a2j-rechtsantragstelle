import { z } from "zod/mini";
import { configureZod } from "../configureZod";

describe("configureZod", () => {
  afterEach(() => {
    z.config({ customError: undefined });
  });

  const schema = z.enum(["val1"]);

  it("configures zod to return 'required' error for enums receiving empty string input", () => {
    configureZod();
    const validationError = z.treeifyError(schema.safeParse("").error!);
    expect(validationError.errors.at(0)).toBe("required");
  });

  it("custom config doesn't change non-empty string errors", () => {
    configureZod();
    const validationError = z.treeifyError(schema.safeParse("notVal1").error!);
    expect(validationError.errors.at(0)).toBe('Invalid input: expected "val1"');
  });

  it("should produce default errors without configuration", () => {
    const validationError = z.treeifyError(schema.safeParse("").error!);
    expect(validationError.errors.at(0)).toBe('Invalid input: expected "val1"');
  });
});
