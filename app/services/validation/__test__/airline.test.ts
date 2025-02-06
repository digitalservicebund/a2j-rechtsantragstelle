import { airlineSchema } from "../airline";

vi.mock("data/airlines/data.json", () => ({
  default: [{ iata: "LH" }, { iata: "BA" }, { iata: "AF" }],
}));

describe("airlineSchema", () => {
  it("should fail when airline code is empty", () => {
    const result = airlineSchema.safeParse("");
    expect(result.success).toBe(false);

    const errorMessage = result.error?.issues.map((i) => i.message);
    expect(errorMessage).toContain("invalid_airline_code");
  });

  it("should fail when airline code is invalid", () => {
    const result = airlineSchema.safeParse("XX");
    expect(result.success).toBe(false);

    const errorMessage = result.error?.issues.map((i) => i.message);
    expect(errorMessage).toContain("invalid_airline_code");
  });

  it("should pass when airline code is valid", () => {
    const result = airlineSchema.safeParse("LH");
    expect(result.success).toBe(true);
  });
});
