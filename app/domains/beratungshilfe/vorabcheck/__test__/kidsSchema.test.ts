import { z } from "zod";
import { kidsSchema } from "../kidsSchema";

describe("kidsSchema validation", () => {
  it("fails when no fields given", () => {
    expect(z.validate(kidsSchema, {})).toBe(false);
  });

  it("fails when all values are zero", () => {
    expect(
      z.validate(kidsSchema, {
        kids6Below: "0",
        kids7To14: "0",
        kids15To18: "0",
        kids18Above: "0",
      }),
    ).toBe(false);
  });

  it("fails when all fields are empty or zero", () => {
    expect(
      z.validate(kidsSchema, {
        kids6Below: "0",
        kids7To14: "",
        kids15To18: "",
        kids18Above: "",
      }),
    ).toBe(false);
  });

  it("succeeds when one field is not zero and other fields are empty or zero", () => {
    expect(
      z.validate(kidsSchema, {
        kids6Below: "1",
        kids7To14: "",
        kids15To18: "",
        kids18Above: "0",
      }),
    ).toBe(true);
  });

  it("succeeds when two fields are not zero and other fields are empty or zero", () => {
    expect(
      z.validate(kidsSchema, {
        kids6Below: "1",
        kids7To14: "1",
        kids15To18: "",
        kids18Above: "0",
      }),
    ).toBe(true);
  });

  it("succeeds when all fields are not zero", () => {
    expect(
      z.validate(kidsSchema, {
        kids6Below: "1",
        kids7To14: "1",
        kids15To18: "1",
        kids18Above: "1",
      }),
    ).toBe(true);
  });

  it("fails when all fields are not zero but one field is in a wrong format", () => {
    expect(
      z.validate(kidsSchema, {
        kids6Below: "1",
        kids7To14: "1",
        kids15To18: "1",
        kids18Above: "1.1",
      }),
    ).toBe(false);
  });
});
