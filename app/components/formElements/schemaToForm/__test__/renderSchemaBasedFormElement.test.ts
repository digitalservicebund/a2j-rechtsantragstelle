import z from "zod";
import { extractZodDescription } from "../renderSchemaBasedFormElement";

describe("extractZodDescription", () => {
  it("returns undefined without description", () => {
    expect(extractZodDescription(z.string())).toBeUndefined();
  });

  it("returns first-level description", () => {
    expect(extractZodDescription(z.string().describe("test"))).toBe("test");
  });

  it("returns piped description at output", () => {
    const pipedSchema = z.string().pipe(z.string().describe("test"));
    expect(extractZodDescription(pipedSchema)).toBe("test");
  });

  it("returns piped description at input", () => {
    const pipedSchema = z.string().describe("test").pipe(z.string());
    expect(extractZodDescription(pipedSchema)).toBe("test");
  });

  it("returns union description at first position", () => {
    const unionSchema = z.string().describe("test").or(z.literal(""));
    expect(extractZodDescription(unionSchema)).toBe("test");
  });

  it("returns union description at second position", () => {
    const unionSchema = z.literal("").or(z.string().describe("test"));
    expect(extractZodDescription(unionSchema)).toBe("test");
  });

  it("returns first-level description for unions", () => {
    const unionSchema = z
      .literal("")
      .or(z.string().describe("test"))
      .describe("test1");
    expect(extractZodDescription(unionSchema)).toBe("test1");
  });

  it("returns first-level description for pipes", () => {
    const pipedSchema = z
      .string()
      .describe("test")
      .pipe(z.string())
      .describe("test1");
    expect(extractZodDescription(pipedSchema)).toBe("test1");
  });
});
