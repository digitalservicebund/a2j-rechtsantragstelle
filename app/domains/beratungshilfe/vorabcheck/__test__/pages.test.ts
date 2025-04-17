import { kidsSchema } from "~/domains/beratungshilfe/vorabcheck/context";

describe("kidsSchema validation", () => {
  it("fails when no fields given", () => {
    const validationResult = kidsSchema.safeParse({});
    expect(validationResult.error).toBeDefined();
  });

  it("fails when all values are zero", () => {
    const validationResult = kidsSchema.safeParse({
      kids6Below: "0",
      kids7To14: "0",
      kids15To18: "0",
      kids18Above: "0",
    });
    expect(validationResult.error).toBeDefined();
  });

  it("fails when all fields are empty or zero", () => {
    const validationResult = kidsSchema.safeParse({
      kids6Below: "0",
      kids7To14: "",
      kids15To18: "",
      kids18Above: "",
    });
    expect(validationResult.error).toBeDefined();
  });

  it("succeeds when one field is not zero and other fields are empty or zero", () => {
    const validationResult = kidsSchema.safeParse({
      kids6Below: "1",
      kids7To14: "",
      kids15To18: "",
      kids18Above: "0",
    });
    expect(validationResult.error).toBeUndefined();
  });

  it("succeeds when two fields are not zero and other fields are empty or zero", () => {
    const validationResult = kidsSchema.safeParse({
      kids6Below: "1",
      kids7To14: "1",
      kids15To18: "",
      kids18Above: "0",
    });
    expect(validationResult.error).toBeUndefined();
  });

  it("succeeds when all fields are not zero", () => {
    const validationResult = kidsSchema.safeParse({
      kids6Below: "1",
      kids7To14: "1",
      kids15To18: "1",
      kids18Above: "1",
    });
    expect(validationResult.error).toBeUndefined();
  });

  it("fails when all fields are not zero but one field is in a wrong format", () => {
    const validationResult = kidsSchema.safeParse({
      kids6Below: "1",
      kids7To14: "1",
      kids15To18: "1",
      kids18Above: "1.1",
    });
    expect(validationResult.error).toBeDefined();
  });
});
