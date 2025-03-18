import { FluggastrechtContext } from "../../context";
import { flugdatenDone } from "../doneFunctions";
import { fluggesellschaftAddresse } from "./flugdatenMock";

const baseContext: FluggastrechtContext = {
  ...fluggesellschaftAddresse,
  direktFlugnummer: "AB6303",
  buchungsNummer: "X36Q9C",
  direktAbflugsDatum: "10.03.2024",
  direktAbflugsZeit: "09:09",
  direktAnkunftsDatum: "10.03.2024",
  direktAnkunftsZeit: "09:09",
  zusaetzlicheAngaben: "nice",
};

describe("flugdatenDone", () => {
  describe("verspaetet", () => {
    test("returns true when all required fields are present for 'verspaetet' with complete 'ersatzverbindung' complete data", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "etwasAnderes",
        andereErsatzverbindungAnkunftsDatum: "11.03.2024",
        andereErsatzverbindungAnkunftsZeit: "11:00",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });

    test("returns true when all required fields are present for 'verspaetet' with 'keineAnkunft'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "keineAnkunft",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });

    test("returns false when required fields are missing for 'verspaetet' with 'flug'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "flug",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'verspaetet' with 'etwasAnderes'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "etwasAnderes",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'verspaetet' with tatsaechlicherFlug", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "verspaetet",
        tatsaechlicherFlug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'verspaetet' without tatsaechlicherFlug", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'verspaetet' without the zwischenstopps", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "oneStop",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "keineAnkunft",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'verspaetet' without the second zwischenstopp airport", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        ersterZwischenstopp: "BER",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "keineAnkunft",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'verspaetet' without the verspaeteterFlug for the zwischenstopp", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        ersterZwischenstopp: "BER",
        zweiterZwischenstopp: "BER",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "keineAnkunft",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns true when required fields are present for 'verspaetet' and zwischenstopp", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "threeStop",
        ersterZwischenstopp: "BER",
        zweiterZwischenstopp: "BER",
        dritterZwischenstopp: "BER",
        verspaeteterFlug: "secondAirportThirdZwischenstopp",
        bereich: "verspaetet",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "keineAnkunft",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });
  });

  describe("annullierung", () => {
    test("returns true when all required fields are present for 'annullierung'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        annullierungErsatzverbindungFlugnummer: "XY1234",
        annullierungErsatzverbindungAbflugsDatum: "11.03.2024",
        annullierungErsatzverbindungAbflugsZeit: "10:10",
        annullierungErsatzverbindungAnkunftsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsZeit: "10:10",
        ersatzflug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });

    test("returns false when field annullierungErsatzverbindungFlugnummer is missing'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        annullierungErsatzverbindungAbflugsDatum: "11.03.2024",
        annullierungErsatzverbindungAbflugsZeit: "10:10",
        annullierungErsatzverbindungAnkunftsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsZeit: "10:10",
        ersatzflug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when field annullierungErsatzverbindungAbflugsDatum is missing'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        annullierungErsatzverbindungFlugnummer: "XY1234",
        annullierungErsatzverbindungAbflugsZeit: "10:10",
        annullierungErsatzverbindungAnkunftsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsZeit: "10:10",
        ersatzflug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when field annullierungErsatzverbindungAbflugsZeit is missing'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        annullierungErsatzverbindungFlugnummer: "XY1234",
        annullierungErsatzverbindungAbflugsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsZeit: "10:10",
        ersatzflug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when field zwischenstopps is airport is missing ", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "oneStop",
        bereich: "annullierung",
        annullierungErsatzverbindungFlugnummer: "XY1234",
        annullierungErsatzverbindungAbflugsDatum: "11.03.2024",
        annullierungErsatzverbindungAbflugsZeit: "10:10",
        annullierungErsatzverbindungAnkunftsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsZeit: "10:10",
        ersatzflug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when field second zwischenstopp airport is missing", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        ersterZwischenstopp: "BER",
        bereich: "annullierung",
        annullierungErsatzverbindungFlugnummer: "XY1234",
        annullierungErsatzverbindungAbflugsDatum: "11.03.2024",
        annullierungErsatzverbindungAbflugsZeit: "10:10",
        annullierungErsatzverbindungAnkunftsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsZeit: "10:10",
        ersatzflug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when field third zwischenstopp airport is missing", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        ersterZwischenstopp: "BER",
        zweiterZwischenstopp: "BER",
        bereich: "annullierung",
        annullierungErsatzverbindungFlugnummer: "XY1234",
        annullierungErsatzverbindungAbflugsDatum: "11.03.2024",
        annullierungErsatzverbindungAbflugsZeit: "10:10",
        annullierungErsatzverbindungAnkunftsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsZeit: "10:10",
        ersatzflug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns true when required fields are present zwischenstopp", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "threeStop",
        ersterZwischenstopp: "BER",
        zweiterZwischenstopp: "BER",
        dritterZwischenstopp: "BER",
        verspaeteterFlug: "secondAirportThirdZwischenstopp",
        bereich: "annullierung",
        annullierungErsatzverbindungFlugnummer: "XY1234",
        annullierungErsatzverbindungAbflugsDatum: "11.03.2024",
        annullierungErsatzverbindungAbflugsZeit: "10:10",
        annullierungErsatzverbindungAnkunftsDatum: "11.03.2024",
        annullierungErsatzverbindungAnkunftsZeit: "10:10",
        ersatzflug: "yes",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });

    test("returns true when all required fields are present for 'annullierung' and ersatzflug is no", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        ersatzflug: "no",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });
  });

  describe("nichtbefoerderung", () => {
    test("returns true when all required fields are present for 'nichtbefoerderung' with 'flug' complete data", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "nichtbefoerderung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });

    test("returns false when required fields are missing for 'nichtbefoerderung' with 'flug'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "nichtbefoerderung",
        ersatzverbindungArt: "flug",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'nichtbefoerderung' with 'etwasAnderes'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "nichtbefoerderung",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'nichtbefoerderung' with 'flug' and without tatsaechlicherFlug", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "nichtbefoerderung",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "flug",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'nichtbefoerderung' without the zwischenstopps", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "oneStop",
        bereich: "nichtbefoerderung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'nichtbefoerderung' without the second zwischenstopp airport", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        ersterZwischenstopp: "BER",
        bereich: "nichtbefoerderung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'nichtbefoerderung' without the verspaeteterFlug for the zwischenstopp", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        ersterZwischenstopp: "BER",
        zweiterZwischenstopp: "BER",
        bereich: "nichtbefoerderung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns true when required fields are present for 'nichtbefoerderung' and zwischenstopp", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "threeStop",
        ersterZwischenstopp: "BER",
        zweiterZwischenstopp: "BER",
        dritterZwischenstopp: "BER",
        verspaeteterFlug: "secondAirportThirdZwischenstopp",
        bereich: "nichtbefoerderung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });
  });
});
