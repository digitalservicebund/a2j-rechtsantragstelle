import { loader as airlinesLoader } from "~/routes/api.airlines.list";

describe("Airlines API", () => {
  test("returns array of airline options", () => {
    const response = airlinesLoader();

    expect(response.length).toBeGreaterThan(0);
    expect(response[0]).toHaveProperty("label");
    expect(response[0]).toHaveProperty("value");
  });
});
