import { getAirlineAddress } from "../getAirlineAddress";

describe("getAirlineAddress", () => {
  it("should return the airline address from the DB", () => {
    const actual = getAirlineAddress({
      fluggesellschaft: "LH",
      fluggesellschaftAuswahlAddress: "fromAirlineDB",
    });

    expect(actual).toEqual({
      address: "Venloer Straße 151 - 153",
      zipCode: "50672",
      city: "Köln",
      country: "Deutschland",
    });
  });

  it("should return the airline address given from the user", () => {
    const actual = getAirlineAddress({
      fluggesellschaft: "LH",
      fluggesellschaftAuswahlAddress: "filledByUser",
      fluggesellschaftLand: "Country",
      fluggesellschaftOrt: "City",
      fluggesellschaftPostleitzahl: "12345",
      fluggesellschaftStrasseHausnummer: "Street 1",
    });

    expect(actual).toEqual({
      address: "Street 1",
      zipCode: "12345",
      city: "City",
      country: "Country",
    });
  });

  it("should return the airline address given from the user when is address is not selected", () => {
    const actual = getAirlineAddress({
      fluggesellschaft: "LH",
      fluggesellschaftLand: "Country",
      fluggesellschaftOrt: "City",
      fluggesellschaftPostleitzahl: "12345",
      fluggesellschaftStrasseHausnummer: "Street 1",
    });

    expect(actual).toEqual({
      address: "Street 1",
      zipCode: "12345",
      city: "City",
      country: "Country",
    });
  });

  it("should return the airline address with empty string given no data", () => {
    const actual = getAirlineAddress({});

    expect(actual).toEqual({
      address: "",
      zipCode: "",
      city: "",
      country: "",
    });
  });
});
