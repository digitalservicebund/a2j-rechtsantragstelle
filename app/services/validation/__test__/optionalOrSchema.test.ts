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

  it("fallbacks to the optional schema when it is defined", () => {
    const schemaWithOptional = optionalOrSchema(
      z.string().length(3),
      z.string().length(1),
    );
    expect(schemaWithOptional.parse("1")).toEqual("1");
  });

  it("disallows input that does not match the optional schema", () => {
    const schemaWithOptional = optionalOrSchema(
      z.string().length(3),
      z.string().length(1),
    );
    expect(() => schemaWithOptional.parse("12")).toThrow();
    expect(() => schemaWithOptional.parse("1234")).toThrow();
  });
});
