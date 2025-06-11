import { loader as airportsLoader } from "~/routes/api.airports.list";

describe("Airports API", () => {
  test("returns array of airport options", () => {
    const response = airportsLoader();

    expect(response.length).toBeGreaterThan(0);
    expect(response[0]).toHaveProperty("label");
    expect(response[0]).toHaveProperty("value");
    expect(response[0]).toHaveProperty("subDescription");
  });
});
