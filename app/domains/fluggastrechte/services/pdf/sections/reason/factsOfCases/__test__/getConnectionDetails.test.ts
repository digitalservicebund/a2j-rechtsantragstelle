import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getConnectionDetails } from "../table/getConnectionDetails";

describe("getConnectionDetails", () => {
  it("should return actual flight details when 'tatsaechlicherFlug' is 'yes'", () => {
    const userData: FluggastrechtContext = {
      tatsaechlicherFlug: "yes",
      direktAnkunftsDatum: "10.11.2024",
      direktAnkunftsZeit: "12:00",
      tatsaechlicherAnkunftsDatum: "10.11.2024",
      tatsaechlicherAnkunftsZeit: "15:30",
    };
    const result = getConnectionDetails(userData);
    expect(result).toEqual({
      info: "3 Stunden and 30 Minuten",
      timeTable: ["--", "--", "10.11.2024, 15:30"],
    });
  });

  it("should return flight replacement details when 'ersatzverbindungArt' is 'flug'", () => {
    const userData: FluggastrechtContext = {
      ersatzverbindungArt: "flug",
      direktAnkunftsDatum: "10.11.2024",
      direktAnkunftsZeit: "12:00",
      ersatzFlugAnkunftsDatum: "10.11.2024",
      ersatzFlugAnkunftsZeit: "15:30",
      ersatzFlugnummer: "AB123",
    };
    const result = getConnectionDetails(userData);
    expect(result).toEqual({
      info: "Mit einem anderen Flug, 3 Stunden and 30 Minuten",
      timeTable: ["AB123", "--", "10.11.2024, 15:30"],
    });
  });

  it("should return alternative transportation details when 'ersatzverbindungArt' is 'etwasAnderes'", () => {
    const userData: FluggastrechtContext = {
      ersatzverbindungArt: "etwasAnderes",
      direktAnkunftsDatum: "10.11.2024",
      direktAnkunftsZeit: "12:00",
      andereErsatzverbindungAnkunftsDatum: "10.11.2024",
      andereErsatzverbindungAnkunftsZeit: "14:30",
    };
    const result = getConnectionDetails(userData);
    expect(result).toEqual({
      info: "Mit Bahn, Bus oder anderen Verkehrsmitteln, 2 Stunden and 30 Minuten",
      timeTable: ["--", "--", "10.11.2024, 14:30"],
    });
  });

  it("should return '--' for 'keineAnkunft' ersatzverbindungArt", () => {
    const userData: FluggastrechtContext = {
      ersatzverbindungArt: "keineAnkunft",
    };
    const result = getConnectionDetails(userData);
    expect(result).toEqual({
      info: "--",
      timeTable: ["--", "--", "--"],
    });
  });

  it("should return error if no valid ersatzverbindungArt or tatsaechlicherFlug is provided", () => {
    const userData: FluggastrechtContext = {};
    const result = getConnectionDetails(userData);
    expect(result).toEqual({
      info: "error",
      timeTable: ["error", "error", "error"],
    });
  });

  it("should handle missing or invalid dates", () => {
    const userData: FluggastrechtContext = {
      tatsaechlicherFlug: "yes",
      direktAnkunftsDatum: "10.11.2024",
      direktAnkunftsZeit: "15:00",
      tatsaechlicherAnkunftsDatum: "10.11.2024",
      tatsaechlicherAnkunftsZeit: "12:00", // end time before start time
    };
    const result = getConnectionDetails(userData);
    expect(result).toEqual({
      info: "",
      timeTable: ["--", "--", "10.11.2024, 12:00"],
    });
  });
});
