import { describe, expect, it } from "vitest";
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
    expect(parentKindIndexSchema.safeParse("0").success).toBe(true);
    expect(parentKindIndexSchema.safeParse("12").success).toBe(true);
    expect(parentKindIndexSchema.safeParse(undefined).success).toBe(true);
  });

  it("rejects the placeholder empty option with the required code", () => {
    const result = parentKindIndexSchema.safeParse("");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("required");
  });

  it("rejects values that are not an index", () => {
    expect(parentKindIndexSchema.safeParse("abc").success).toBe(false);
    expect(parentKindIndexSchema.safeParse("both").success).toBe(false);
    expect(parentKindIndexSchema.safeParse("-1").success).toBe(false);
    expect(parentKindIndexSchema.safeParse("1.5").success).toBe(false);
  });

  it("keeps the dynamic_select description readable on the outer schema", () => {
    expect(parentKindIndexSchema.description).toBe(dynamicSelectZodDescription);
  });
});

describe("parentElternteilIndex schema", () => {
  it("accepts numeric string indexes, 'both', and absence", () => {
    expect(parentElternteilIndexSchema.safeParse("0").success).toBe(true);
    expect(parentElternteilIndexSchema.safeParse("both").success).toBe(true);
    expect(parentElternteilIndexSchema.safeParse(undefined).success).toBe(true);
  });

  it("rejects the placeholder empty option with the required code", () => {
    const result = parentElternteilIndexSchema.safeParse("");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("required");
  });

  it("rejects values that are not an index or 'both'", () => {
    expect(parentElternteilIndexSchema.safeParse("abc").success).toBe(false);
    expect(parentElternteilIndexSchema.safeParse("-1").success).toBe(false);
  });

  it("keeps the dynamic_select description readable on the outer schema", () => {
    expect(parentElternteilIndexSchema.description).toBe(
      dynamicSelectZodDescription,
    );
  });
});
