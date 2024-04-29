import { z } from "zod";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";

describe("optionalOrSchema", () => {
  const schema = optionalOrSchema(z.string().length(3));
  it("allows no input", () => {
    expect(schema.parse("")).toEqual("");
  });

  it("allows spaces as input", () => {
    expect(schema.parse("  ")).toEqual("");
  });

  it("saves correct space schema as input", () => {
    expect(schema.parse("   ")).toEqual("   ");
  });

  it("allows correct schema as input", () => {
    expect(schema.parse("123")).toEqual("123");
  });

  it("disallows wrong schema as input", () => {
    expect(() => schema.parse("12")).toThrow();
  });
});
