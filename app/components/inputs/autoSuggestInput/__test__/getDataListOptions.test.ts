import { getDataListOptions } from "../getDataListOptions";

describe("getDataListOptions", () => {
  it("it should return data options for airports and find the BER airport", () => {
    const actual = getDataListOptions("airports");

    expect(actual.length).greaterThan(0);
    expect(actual.find((airport) => airport.value === "BER")).toBeTruthy();
  });

  it("it should return data options for airlines and find the LH airline", () => {
    const actual = getDataListOptions("airlines");

    expect(actual.length).greaterThan(0);
    expect(actual.find((airline) => airline.value === "LH")).toBeTruthy();
  });

  it("it should return no data options when the given argument is undefined", () => {
    const actual = getDataListOptions();

    expect(actual.length).toBe(0);
  });
});
