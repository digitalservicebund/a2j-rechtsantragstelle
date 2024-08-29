import { flugdatenDone } from "../doneFunctions";

describe("flugdatenDone", () => {
  const mockData = {
    doMigration: "yes",
    startAirport: "BER",
    endAirport: "FRA",
    fluggesellschaft: "LH",
    zustaendigesAmtsgericht: {
      bezeichnung: "Amtsgericht Königs Wusterhausen",
      strasseMitHausnummer: "Schlossplatz 4",
      plzUndStadt: "15711 Königs Wusterhausen",
    },
    direktFlugnummer: "AB6303",
    direktAbflugsDatum: "10.03.2024",
    direktAbflugsZeit: "09:09",
    zwischenstoppAnzahl: "no",
    direktAnkunftsDatum: "10.03.2024",
    direktAnkunftsZeit: "09:09",
    zusaetzlicheAngaben: "nice",
  } as const;

  test("returns true for all complete Flugdaten", () => {
    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "no",
          bereich: "annullierung",
          ersatzverbindungArt: "flug",
          ersatzFlugnummer: "XY1234",
          ersatzFlugAnkunftsDatum: "11.03.2024",
          ersatzFlugAnkunftsZeit: "10:10",
        },
      }),
    ).toBe(true);

    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "oneStop",
          bereich: "verspaetet",
          tatsaechlicherFlug: "no",
          ersatzverbindungArt: "etwasAnderes",
          andereErsatzverbindungBeschreibung: "Taxi",
          andereErsatzverbindungStartDatum: "11.03.2024",
          andereErsatzverbindungStartZeit: "10:10",
          andereErsatzverbindungAnkunftsDatum: "11.03.2024",
          andereErsatzverbindungAnkunftsZeit: "11:00",
        },
      }),
    ).toBe(true);

    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "oneStop",
          bereich: "verspaetet",
          tatsaechlicherFlug: "no",
          ersatzverbindungArt: "keineAnkunft",
        },
      }),
    ).toBe(true);
  });

  test("returns false for incomplete Flugdaten", () => {
    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "no",
          bereich: "annullierung",
          ersatzverbindungArt: "flug",
        },
      }),
    ).toBe(false);

    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "no",
          bereich: "annullierung",
          andereErsatzverbindungBeschreibung: "Taxi",
        },
      }),
    ).toBe(false);

    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "no",
          bereich: "verspaetet",
          tatsaechlicherFlug: "no",
          ersatzverbindungArt: "flug",
        },
      }),
    ).toBe(false);

    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "no",
          bereich: "verspaetet",
          tatsaechlicherFlug: "no",
          ersatzverbindungArt: "etwasAnderes",
        },
      }),
    ).toBe(false);

    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "oneStop",
          bereich: "verspaetet",
          tatsaechlicherFlug: "yes",
        },
      }),
    ).toBe(false);

    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "oneStop",
          bereich: "verspaetet",
          tatsaechlicherFlug: "no",
        },
      }),
    ).toBe(false);

    expect(
      flugdatenDone({
        context: {
          ...mockData,
          zwischenstoppAnzahl: "oneStop",
          bereich: "annullierung",
          tatsaechlicherFlug: "no",
          ersatzverbindungArt: "flug",
        },
      }),
    ).toBe(false);
  });
});
