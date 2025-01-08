import type { SafeParseError } from "zod";
import { postcodeSchema } from "~/services/validation/postcode";

describe("serverside postcode validation", () => {
  it("succeeds on valid postcodes", () => {
    const actual = postcodeSchema.safeParse("10965");
    expect(actual).toEqual({ data: "10965", success: true });
  });

  it("fails on valid format but non-existing postcodes", () => {
    const actual = postcodeSchema.safeParse("12345");
    expect(actual.success).toBe(false);
    expect((actual as SafeParseError<unknown>).error.issues[0].message).toBe(
      "notFound",
    );
  });
});
