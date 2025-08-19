import { z } from "zod/mini";
import { configureZod, restoreZodDefaults } from "../configureZod";

describe("configureZod", () => {
  afterEach(() => {
    restoreZodDefaults();
  });

  it("sets customErrors", () => {
    const schema = z.enum(["val1"]);
    const preConfigError = z.treeifyError(schema.safeParse("").error!);
    configureZod();
    const postConfigError = z.treeifyError(schema.safeParse("").error!);

    expect(preConfigError.errors.at(0)).toBe('Invalid input: expected "val1"');
    expect(postConfigError.errors.at(0)).toBe("required");
  });
});
