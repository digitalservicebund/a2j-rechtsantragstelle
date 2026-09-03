import {
  migrationDataIsEmpty,
  hasMissingAddress,
  hasMissingDate,
  type SummaryPerson,
} from "../hasMissingData";

describe("dataIsEmpty", () => {
  it.each([
    [undefined, true],
    [null, true],
    ["", true],
    ["   ", true],
    ["\t", true],
    ["\n", true],
    ["value", false],
    [" value ", false],
    [0, false],
    [false, false],
    [[], false],
    [{}, false],
  ])("returns %s for %s", (value, expected) => {
    expect(migrationDataIsEmpty(value)).toBe(expected);
  });
});

describe("hasMissingDate", () => {
  it("returns true when date is undefined", () => {
    expect(hasMissingDate(undefined)).toBe(true);
  });

  it.each([
    ["day", { month: "5", year: "1990" }],
    ["month", { day: "10", year: "1990" }],
    ["year", { day: "10", month: "5" }],
  ])("returns true when %s is missing", (_, date) => {
    expect(hasMissingDate(date)).toBe(true);
  });

  it.each([
    { day: "", month: "5", year: "1990" },
    { day: "   ", month: "5", year: "1990" },
    { day: "10", month: "", year: "1990" },
    { day: "10", month: "   ", year: "1990" },
    { day: "10", month: "5", year: "" },
    { day: "10", month: "5", year: "   " },
  ])("returns true when a date field is empty", (date) => {
    expect(hasMissingDate(date)).toBe(true);
  });

  it("returns false when all date fields are present", () => {
    expect(
      hasMissingDate({
        day: "10",
        month: "5",
        year: "1990",
      }),
    ).toBe(false);
  });
});

describe("hasMissingAddress", () => {
  it("returns false when the item does not have an address", () => {
    const item = {
      vorname: "Max",
      nachname: "Mustermann",
    } as SummaryPerson;

    expect(hasMissingAddress(item)).toBe(false);
  });

  it("returns false when all address fields are present", () => {
    const item = {
      strasse: "Musterstraße",
      hausnummer: "10",
      plz: "10115",
      ort: "Berlin",
      land: "Deutschland",
    } as SummaryPerson;

    expect(hasMissingAddress(item)).toBe(false);
  });

  it.each([
    [
      "strasse",
      {
        strasse: undefined,
        hausnummer: "10",
        plz: "10115",
        ort: "Berlin",
        land: "Deutschland",
      },
    ],
    [
      "hausnummer",
      {
        strasse: "Musterstraße",
        plz: "10115",
        ort: "Berlin",
        land: "Deutschland",
      },
    ],
    [
      "plz",
      {
        strasse: "Musterstraße",
        hausnummer: "10",
        ort: "Berlin",
        land: "Deutschland",
      },
    ],
    [
      "ort",
      {
        strasse: "Musterstraße",
        hausnummer: "10",
        plz: "10115",
        land: "Deutschland",
      },
    ],
    [
      "land",
      {
        strasse: "Musterstraße",
        hausnummer: "10",
        plz: "10115",
        ort: "Berlin",
      },
    ],
  ])("returns true when %s is missing", (_, address) => {
    expect(hasMissingAddress(address as SummaryPerson)).toBe(true);
  });

  it.each([
    {
      strasse: "",
      hausnummer: "10",
      plz: "10115",
      ort: "Berlin",
      land: "Deutschland",
    },
    {
      strasse: "Musterstraße",
      hausnummer: "   ",
      plz: "10115",
      ort: "Berlin",
      land: "Deutschland",
    },
    {
      strasse: "Musterstraße",
      hausnummer: "10",
      plz: "   ",
      ort: "Berlin",
      land: "Deutschland",
    },
    {
      strasse: "Musterstraße",
      hausnummer: "10",
      plz: "10115",
      ort: "",
      land: "Deutschland",
    },
    {
      strasse: "Musterstraße",
      hausnummer: "10",
      plz: "10115",
      ort: "Berlin",
      land: "   ",
    },
  ])(
    "returns true when an address field contains only whitespace",
    (address) => {
      expect(hasMissingAddress(address as SummaryPerson)).toBe(true);
    },
  );
});
