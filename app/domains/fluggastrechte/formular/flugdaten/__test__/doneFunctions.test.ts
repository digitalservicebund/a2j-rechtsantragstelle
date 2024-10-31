import { flugdatenDone } from "../doneFunctions";

const baseContext = {
  startAirport: "BER",
  endAirport: "FRA",
  fluggesellschaft: "LH",
  zustaendigesAmtsgericht: {
    bezeichnung: "Amtsgericht",
    strasseMitHausnummer: "Amtsgericht",
    plzUndStadt: "Amtsgericht",
  },
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
        andereErsatzverbindungBeschreibung: "Taxi",
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
    test("returns true when all required fields are present for 'annullierung' with 'flug' complete data", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(true);
    });

    test("returns false when required fields are missing for 'annullierung' with 'flug'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        ersatzverbindungArt: "flug",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'annullierung' with 'etwasAnderes'", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        andereErsatzverbindungBeschreibung: "Taxi",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'annullierung' with 'flug' and without tatsaechlicherFlug", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        bereich: "annullierung",
        tatsaechlicherFlug: "no",
        ersatzverbindungArt: "flug",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'annullierung' without the zwischenstopps", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "oneStop",
        bereich: "annullierung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'annullierung' without the second zwischenstopp airport", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        ersterZwischenstopp: "BER",
        bereich: "annullierung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns false when required fields are missing for 'annullierung' without the verspaeteterFlug for the zwischenstopp", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        ersterZwischenstopp: "BER",
        zweiterZwischenstopp: "BER",
        bereich: "annullierung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
      } as const;

      expect(flugdatenDone({ context })).toBe(false);
    });

    test("returns true when required fields are present for 'annullierung' and zwischenstopp", () => {
      const context = {
        ...baseContext,
        zwischenstoppAnzahl: "threeStop",
        ersterZwischenstopp: "BER",
        zweiterZwischenstopp: "BER",
        dritterZwischenstopp: "BER",
        verspaeteterFlug: "secondAirportThirdZwischenstopp",
        bereich: "annullierung",
        ersatzverbindungArt: "flug",
        ersatzFlugnummer: "XY1234",
        ersatzFlugAnkunftsDatum: "11.03.2024",
        ersatzFlugAnkunftsZeit: "10:10",
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
        andereErsatzverbindungBeschreibung: "Taxi",
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
