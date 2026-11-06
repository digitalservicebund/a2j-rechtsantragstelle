import { beweismittelSchema } from "../tatsachenvortragSchemas";

describe("beweismittelSchema", () => {
  const beweismittel = [
    "augenschein",
    "urkunde",
    "zeuge",
    "sachverstaendigengutachten",
    "parteivernehmung",
  ];

  it("exposes all evidence types for dropdown options", () => {
    expect(beweismittelSchema.shape.beweismittel.options).toEqual(beweismittel);
  });

  it.each(beweismittel)("accepts a form selecting %s", (value) => {
    expect(beweismittelSchema.parse({ beweismittel: value })).toEqual({
      beweismittel: value,
    });
  });

  it.each(["", "unknown", undefined, null, 1])(
    "rejects an invalid selection: %s",
    (value) => {
      expect(
        beweismittelSchema.safeParse({ beweismittel: value }).success,
      ).toBe(false);
    },
  );
});
