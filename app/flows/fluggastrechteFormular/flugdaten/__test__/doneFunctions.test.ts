import { flugdatenDone } from "../doneFunctions";

describe("flugdatenDone", () => {
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
    direktAbflugsDatum: "10.03.2024",
    direktAbflugsZeit: "09:09",
    direktAnkunftsDatum: "10.03.2024",
    direktAnkunftsZeit: "09:09",
    zusaetzlicheAngaben: "nice",
  };

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

  test("returns true when all required fields are present for 'verspaetet' with complete 'ersatzverbindung' complete data", () => {
    const context = {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      bereich: "verspaetet",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "etwasAnderes",
      andereErsatzverbindungBeschreibung: "Taxi",
      andereErsatzverbindungStartDatum: "11.03.2024",
      andereErsatzverbindungStartZeit: "10:10",
      andereErsatzverbindungAnkunftsDatum: "11.03.2024",
      andereErsatzverbindungAnkunftsZeit: "11:00",
    } as const;

    expect(flugdatenDone({ context })).toBe(true);
  });

  test("returns true when all required fields are present for 'verspaetet' with 'keineAnkunft'", () => {
    const context = {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      bereich: "verspaetet",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "keineAnkunft",
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
      zwischenstoppAnzahl: "oneStop",
      bereich: "verspaetet",
      tatsaechlicherFlug: "yes",
    } as const;

    expect(flugdatenDone({ context })).toBe(false);
  });

  test("returns false when required fields are missing for 'verspaetet' without tatsaechlicherFlug", () => {
    const context = {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      bereich: "verspaetet",
      tatsaechlicherFlug: "no",
    } as const;

    expect(flugdatenDone({ context })).toBe(false);
  });

  test("returns false when required fields are missing for 'annullierung' with 'flug' and without tatsaechlicherFlug", () => {
    const context = {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      bereich: "annullierung",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
    } as const;

    expect(flugdatenDone({ context })).toBe(false);
  });
});
