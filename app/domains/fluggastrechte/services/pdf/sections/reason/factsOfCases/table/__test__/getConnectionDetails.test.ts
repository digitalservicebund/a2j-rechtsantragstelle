import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import {
  EARLIER_STARTED,
  getConnectionDetails,
  LATER_ARRIVED,
  LESS_THAN,
  MORE_THAN,
  NO_OFFER_REPLACEMENT_RECEIVED_TEXT,
  NOT_MEASURE_DID_NOT_ARRIVE_TEXT,
  OFFERED_REPLACEMENT_FLIGHT,
} from "../getConnectionDetails";

describe("getConnectionDetails", () => {
  describe("verspaetet", () => {
    it("should return actual flight details when 'tatsaechlicherFlug' is 'yes'", () => {
      const userData: FluggastrechtContext = {
        bereich: "verspaetet",
        tatsaechlicherFlug: "yes",
        direktAnkunftsDatum: "10.11.2024",
        direktAnkunftsZeit: "12:00",
        tatsaechlicherAnkunftsDatum: "10.11.2024",
        tatsaechlicherAnkunftsZeit: "15:30",
      };
      const result = getConnectionDetails(userData);
      expect(result).toEqual({
        info: "3 Stunden\n30 Minuten  ",
        timeTable: ["--", "--", "10.11.2024, 15:30"],
      });
    });

    it("should return flight replacement details when 'ersatzverbindungArt' is 'flug'", () => {
      const userData: FluggastrechtContext = {
        bereich: "verspaetet",
        ersatzverbindungArt: "flug",
        direktAnkunftsDatum: "10.11.2024",
        direktAnkunftsZeit: "12:00",
        ersatzFlugAnkunftsDatum: "10.11.2024",
        ersatzFlugAnkunftsZeit: "15:30",
        ersatzFlugnummer: "AB123",
      };
      const result = getConnectionDetails(userData);
      expect(result).toEqual({
        info: "3 Stunden\n30 Minuten  ",
        timeTable: ["AB123", "--", "10.11.2024, 15:30"],
      });
    });

    it("should return alternative transportation details when 'ersatzverbindungArt' is 'etwasAnderes'", () => {
      const userData: FluggastrechtContext = {
        bereich: "verspaetet",
        ersatzverbindungArt: "etwasAnderes",
        direktAnkunftsDatum: "10.11.2024",
        direktAnkunftsZeit: "12:00",
        andereErsatzverbindungAnkunftsDatum: "10.11.2024",
        andereErsatzverbindungAnkunftsZeit: "14:30",
      };
      const result = getConnectionDetails(userData);
      expect(result).toEqual({
        info: "2 Stunden\n30 Minuten  ",
        timeTable: ["--", "--", "10.11.2024, 14:30"],
      });
    });

    it("should return not measure and did not arrive text for 'keineAnkunft' ersatzverbindungArt", () => {
      const userData: FluggastrechtContext = {
        ersatzverbindungArt: "keineAnkunft",
        bereich: "verspaetet",
      };
      const result = getConnectionDetails(userData);
      expect(result).toEqual({
        info: NOT_MEASURE_DID_NOT_ARRIVE_TEXT,
        timeTable: ["--", "--", "--"],
      });
    });

    it("should return error if no valid ersatzverbindungArt or tatsaechlicherFlug is provided", () => {
      const userData: FluggastrechtContext = { bereich: "verspaetet" };
      const result = getConnectionDetails(userData);
      expect(result).toEqual({
        info: "error",
        timeTable: ["error", "error", "error"],
      });
    });

    it("should handle missing or invalid dates", () => {
      const userData: FluggastrechtContext = {
        bereich: "verspaetet",
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

  describe("annullierung", () => {
    describe("ankuendigung no", () => {
      it("should return the text of no offer replacement received given ersatzflug no", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "no",
          ersatzflug: "no",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `Gar nicht vor Abflug mitgeteilt.\n${NO_OFFER_REPLACEMENT_RECEIVED_TEXT}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given yes for ersatzflugStartenEinStunde and ersatzflugLandenZweiStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "no",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "yes",
          ersatzflugLandenZweiStunden: "yes",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `Gar nicht vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${MORE_THAN} 1 Stunde ${EARLIER_STARTED} und ${MORE_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenEinStunde and ersatzflugLandenZweiStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "no",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "no",
          ersatzflugLandenZweiStunden: "no",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `Gar nicht vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 1 Stunde ${EARLIER_STARTED} und ${LESS_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given yes for ersatzflugStartenEinStunde and no ersatzflugLandenZweiStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "no",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "yes",
          ersatzflugLandenZweiStunden: "no",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `Gar nicht vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${MORE_THAN} 1 Stunde ${EARLIER_STARTED} und ${LESS_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenEinStunde and yes ersatzflugLandenZweiStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "no",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "no",
          ersatzflugLandenZweiStunden: "yes",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `Gar nicht vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 1 Stunde ${EARLIER_STARTED} und ${MORE_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenEinStunde, yes ersatzflugLandenZweiStunden and empty replacement flights info", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "no",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "no",
          ersatzflugLandenZweiStunden: "yes",
          annullierungErsatzverbindungAbflugsDatum: "",
          annullierungErsatzverbindungAbflugsZeit: "",
          annullierungErsatzverbindungAnkunftsDatum: "",
          annullierungErsatzverbindungAnkunftsZeit: "",
          annullierungErsatzverbindungFlugnummer: "",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `Gar nicht vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 1 Stunde ${EARLIER_STARTED} und ${MORE_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the text of no offer replacement received and date and time, given ersatzflug no and replacement flights info", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "no",
          ersatzflug: "no",
          annullierungErsatzverbindungAbflugsDatum: "10.10.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:20",
          annullierungErsatzverbindungAnkunftsDatum: "10.10.2024",
          annullierungErsatzverbindungAnkunftsZeit: "11:40",
          annullierungErsatzverbindungFlugnummer: "ABCD1",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `Gar nicht vor Abflug mitgeteilt.\n${NO_OFFER_REPLACEMENT_RECEIVED_TEXT}`,
          timeTable: ["ABCD1", "10.10.2024, 10:20", "10.10.2024, 11:40"],
        });
      });
    });

    describe("ankuendigung until6Days", () => {
      it("should return the correct given yes for ersatzflugStartenEinStunde and ersatzflugLandenZweiStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "until6Days",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "yes",
          ersatzflugLandenZweiStunden: "yes",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `0 bis 6 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${MORE_THAN} 1 Stunde ${EARLIER_STARTED} und ${MORE_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenEinStunde and ersatzflugLandenZweiStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "until6Days",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "no",
          ersatzflugLandenZweiStunden: "no",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `0 bis 6 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 1 Stunde ${EARLIER_STARTED} und ${LESS_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given yes for ersatzflugStartenEinStunde and no ersatzflugLandenZweiStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "until6Days",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "yes",
          ersatzflugLandenZweiStunden: "no",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `0 bis 6 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${MORE_THAN} 1 Stunde ${EARLIER_STARTED} und ${LESS_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenEinStunde and yes ersatzflugLandenZweiStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "until6Days",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "no",
          ersatzflugLandenZweiStunden: "yes",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `0 bis 6 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 1 Stunde ${EARLIER_STARTED} und ${MORE_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenEinStunde, yes ersatzflugLandenZweiStunden and empty replacement flights info", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "until6Days",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "no",
          ersatzflugLandenZweiStunden: "yes",
          annullierungErsatzverbindungAbflugsDatum: "",
          annullierungErsatzverbindungAbflugsZeit: "",
          annullierungErsatzverbindungAnkunftsDatum: "",
          annullierungErsatzverbindungAnkunftsZeit: "",
          annullierungErsatzverbindungFlugnummer: "",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `0 bis 6 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 1 Stunde ${EARLIER_STARTED} und ${MORE_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenEinStunde, yes ersatzflugLandenZweiStunden and flight info replacement", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "until6Days",
          ersatzflug: "yes",
          ersatzflugStartenEinStunde: "no",
          ersatzflugLandenZweiStunden: "yes",
          annullierungErsatzverbindungAbflugsDatum: "10.10.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:20",
          annullierungErsatzverbindungAnkunftsDatum: "10.10.2024",
          annullierungErsatzverbindungAnkunftsZeit: "11:40",
          annullierungErsatzverbindungFlugnummer: "ABCD1",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `0 bis 6 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 1 Stunde ${EARLIER_STARTED} und ${MORE_THAN} 2 Stunden ${LATER_ARRIVED}`,
          timeTable: ["ABCD1", "10.10.2024, 10:20", "10.10.2024, 11:40"],
        });
      });
    });

    describe("ankuendigung between7And13Days", () => {
      it("should return the correct given yes for ersatzflugStartenZweiStunden and ersatzflugLandenVierStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "between7And13Days",
          ersatzflug: "yes",
          ersatzflugStartenZweiStunden: "yes",
          ersatzflugLandenVierStunden: "yes",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `7-13 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${MORE_THAN} 2 Stunden ${EARLIER_STARTED} und ${MORE_THAN} 4 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenZweiStunden and ersatzflugLandenVierStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "between7And13Days",
          ersatzflug: "yes",
          ersatzflugStartenZweiStunden: "no",
          ersatzflugLandenVierStunden: "no",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `7-13 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 2 Stunden ${EARLIER_STARTED} und ${LESS_THAN} 4 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given yes for ersatzflugStartenZweiStunden and no ersatzflugLandenVierStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "between7And13Days",
          ersatzflug: "yes",
          ersatzflugStartenZweiStunden: "yes",
          ersatzflugLandenVierStunden: "no",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `7-13 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${MORE_THAN} 2 Stunden ${EARLIER_STARTED} und ${LESS_THAN} 4 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenZweiStunden and yes ersatzflugLandenVierStunden", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "between7And13Days",
          ersatzflug: "yes",
          ersatzflugStartenZweiStunden: "no",
          ersatzflugLandenVierStunden: "yes",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `7-13 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 2 Stunden ${EARLIER_STARTED} und ${MORE_THAN} 4 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenZweiStunden, yes ersatzflugLandenVierStunden and empty replacement flights info", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "between7And13Days",
          ersatzflug: "yes",
          ersatzflugStartenZweiStunden: "no",
          ersatzflugLandenVierStunden: "yes",
          annullierungErsatzverbindungAbflugsDatum: "",
          annullierungErsatzverbindungAbflugsZeit: "",
          annullierungErsatzverbindungAnkunftsDatum: "",
          annullierungErsatzverbindungAnkunftsZeit: "",
          annullierungErsatzverbindungFlugnummer: "",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `7-13 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 2 Stunden ${EARLIER_STARTED} und ${MORE_THAN} 4 Stunden ${LATER_ARRIVED}`,
          timeTable: ["--", "--", "--"],
        });
      });

      it("should return the correct given no for ersatzflugStartenZweiStunden, yes ersatzflugLandenVierStunden and flight info replacement", () => {
        const userData: FluggastrechtContext = {
          bereich: "annullierung",
          ankuendigung: "between7And13Days",
          ersatzflug: "yes",
          ersatzflugStartenZweiStunden: "no",
          ersatzflugLandenVierStunden: "yes",
          annullierungErsatzverbindungAbflugsDatum: "10.10.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:20",
          annullierungErsatzverbindungAnkunftsDatum: "10.10.2024",
          annullierungErsatzverbindungAnkunftsZeit: "11:40",
          annullierungErsatzverbindungFlugnummer: "ABCD1",
        };
        const result = getConnectionDetails(userData);

        expect(result).toEqual({
          info: `7-13 Tage vor Abflug mitgeteilt.\n${OFFERED_REPLACEMENT_FLIGHT} ${LESS_THAN} 2 Stunden ${EARLIER_STARTED} und ${MORE_THAN} 4 Stunden ${LATER_ARRIVED}`,
          timeTable: ["ABCD1", "10.10.2024, 10:20", "10.10.2024, 11:40"],
        });
      });
    });
  });
});
