import { beweismittelSchema } from "../tatsachenvortragSchemas";

describe("beweismittelSchema", () => {
  const type = [
    "augenschein",
    "urkunde",
    "zeuge",
    "sachverstaendigengutachten",
    "parteivernehmung",
  ];

  it("exposes all evidence types for dropdown options", () => {
    expect(beweismittelSchema.shape.type.options).toEqual(type);
  });

  it.each(type)("accepts a form selecting %s", (value) => {
    expect(beweismittelSchema.parse({ type: value })).toEqual({
      type: value,
    });
  });

  it.each(["", "unknown", undefined, null, 1])(
    "rejects an invalid selection: %s",
    (value) => {
      expect(beweismittelSchema.safeParse({ type: value }).success).toBe(false);
    },
  );
});
