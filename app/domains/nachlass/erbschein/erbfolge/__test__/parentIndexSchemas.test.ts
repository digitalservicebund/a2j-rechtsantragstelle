import { describe, expect, it } from "vitest";
import { z } from "zod";
import { dynamicSelectZodDescription } from "~/services/validation/dynamicSelect";
import { nachlassErbfolgePages } from "../pages";

const parentKindIndexSchema =
  nachlassErbfolgePages.kind2Daten.pageSchema["kinder#kinder#parentKindIndex"];
const parentElternteilIndexSchema =
  nachlassErbfolgePages.elternteilKind1Daten.pageSchema[
    "elternteile#kinder#parentElternteilIndex"
  ];

describe("parentKindIndex schema", () => {
  it("accepts numeric string indexes and absence", () => {
    expect(z.validate(parentKindIndexSchema, "0")).toBe(true);
    expect(z.validate(parentKindIndexSchema, "12")).toBe(true);
    expect(z.validate(parentKindIndexSchema, undefined)).toBe(true);
  });

  it("rejects the placeholder empty option with the required code", () => {
    const result = parentKindIndexSchema.safeParse("");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("required");
  });

  it("rejects values that are not an index", () => {
    expect(z.validate(parentKindIndexSchema, "abc")).toBe(false);
    expect(z.validate(parentKindIndexSchema, "both")).toBe(false);
    expect(z.validate(parentKindIndexSchema, "-1")).toBe(false);
    expect(z.validate(parentKindIndexSchema, "1.5")).toBe(false);
  });

  it("keeps the dynamic_select description readable on the outer schema", () => {
    expect(parentKindIndexSchema.description).toBe(dynamicSelectZodDescription);
  });
});

describe("parentElternteilIndex schema", () => {
  it("accepts numeric string indexes, 'both', and absence", () => {
    expect(z.validate(parentElternteilIndexSchema, "0")).toBe(true);
    expect(z.validate(parentElternteilIndexSchema, "both")).toBe(true);
    expect(z.validate(parentElternteilIndexSchema, undefined)).toBe(true);
  });

  it("rejects the placeholder empty option with the required code", () => {
    const result = parentElternteilIndexSchema.safeParse("");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("required");
  });

  it("rejects values that are not an index or 'both'", () => {
    expect(z.validate(parentElternteilIndexSchema, "abc")).toBe(false);
    expect(z.validate(parentElternteilIndexSchema, "-1")).toBe(false);
  });

  it("keeps the dynamic_select description readable on the outer schema", () => {
    expect(parentElternteilIndexSchema.description).toBe(
      dynamicSelectZodDescription,
    );
  });
});
