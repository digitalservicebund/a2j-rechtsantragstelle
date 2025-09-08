import { getAirlineAddress } from "../getAirlineAddress";

describe("getAirlineAddress", () => {
  it("should return the airline address from the DB", () => {
    const actual = getAirlineAddress({
      fluggesellschaft: "LH",
      fluggesellschaftAuswahlAdresse: "fromAirlineDB",
    });

    expect(actual).toEqual({
      addressSource: "database",
      streetAndNumber: "Venloer Straße 151 - 153",
      zipCode: "50672",
      city: "Köln",
      country: "Deutschland",
    });
  });

  it("should return the airline address given from the user", () => {
    const actual = getAirlineAddress({
      fluggesellschaft: "LH",
      fluggesellschaftAuswahlAdresse: "filledByUser",
      fluggesellschaftLand: "Country",
      fluggesellschaftOrt: "City",
      fluggesellschaftPostleitzahl: "12345",
      fluggesellschaftStrasseHausnummer: "Street 1",
    });

    expect(actual).toEqual({
      addressSource: "manualInput",
      streetAndNumber: "Street 1",
      zipCode: "12345",
      city: "City",
      country: "Country",
    });
  });

  it("should return the airline address given from the user when the address is not selected", () => {
    const actual = getAirlineAddress({
      fluggesellschaft: "LH",
      fluggesellschaftLand: "Country",
      fluggesellschaftOrt: "City",
      fluggesellschaftPostleitzahl: "12345",
      fluggesellschaftStrasseHausnummer: "Street 1",
    });

    expect(actual).toEqual({
      addressSource: "manualInput",
      streetAndNumber: "Street 1",
      zipCode: "12345",
      city: "City",
      country: "Country",
    });
  });

  it("should return the airline address with empty string given no data", () => {
    const actual = getAirlineAddress({});

    expect(actual).toEqual({
      addressSource: "manualInput",
      streetAndNumber: "",
      zipCode: "",
      city: "",
      country: "",
    });
  });
});
