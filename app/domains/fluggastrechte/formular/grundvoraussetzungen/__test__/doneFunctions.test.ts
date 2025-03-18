import { CheckboxValue } from "~/components/inputs/Checkbox";
import { grundvoraussetzungenDone } from "../doneFunctions";

describe("doneFunctions", () => {
  it("should return true, if all the data were migrated given when streitbeilegung is yes", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
        datenverarbeitungZustimmung: CheckboxValue.on,
        streitbeilegung: "yes",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return true, if all the data were migrated given when streitbeilegung is noSpecification", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
        datenverarbeitungZustimmung: CheckboxValue.on,
        streitbeilegung: "noSpecification",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return true, if all the data were migrated given when streitbeilegung is no", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
        datenverarbeitungZustimmung: CheckboxValue.on,
        streitbeilegung: "no",
        streitbeilegungGruende: "yes",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return false, if start airport is missing", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
        streitbeilegung: "yes",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if bereich is missing", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
        streitbeilegung: "yes",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if all context is missing", () => {
    const actual = grundvoraussetzungenDone({ context: {} });

    expect(actual).toBe(false);
  });

  it("should return false, if streitbeilegung is no and missing streitbeilegungGruende", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
        datenverarbeitungZustimmung: CheckboxValue.on,
        streitbeilegung: "no",
      },
    });

    expect(actual).toBe(false);
  });
});
