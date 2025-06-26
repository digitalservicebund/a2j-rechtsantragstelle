import { StrapiErrorRelationSchema } from "../StrapiErrorRelationSchema";

describe("StrapiErrorRelationSchema", () => {
  it("transform error arrays", () => {
    const parsed = StrapiErrorRelationSchema.safeParse([
      {
        id: 1,
        name: "error1",
        errorCodes: [{ code: "code1", text: "text1" }],
      },
      {
        id: 2,
        name: "error2",
        errorCodes: [{ code: "code2", text: "text2" }],
      },
    ]);
    expect(parsed.success).toBe(true);
    expect(parsed.data).toEqual([
      { code: "code1", text: "text1" },
      { code: "code2", text: "text2" },
    ]);
  });

  it("transforms null to undefined", () => {
    const parsed = StrapiErrorRelationSchema.safeParse(null);
    expect(parsed.success).toBe(true);
    expect(parsed.data).toBeUndefined();
  });
});
