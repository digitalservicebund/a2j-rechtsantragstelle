import type { FluggastrechtContext } from "~/flows/fluggastrechte/fluggastrechteFormular/context";

export const userDataMock = {
  startAirport: "BER",
  endAirport: "JFK",
  bereich: "verspaetet",
  fluggesellschaft: "LH",
  zustaendigesAmtsgericht: {
    bezeichnung: "Amtsgericht Königs Wusterhausen",
    strasseMitHausnummer: "Schlossplatz 4",
    plzUndStadt: "15711 Königs Wusterhausen",
  },
  prozesszinsen: "yes",
  versaeumnisurteil: "yes",
  direktFlugnummer: "AB6303",
  buchungsNummer: "AB6303",
  direktAbflugsDatum: "10.10.2022",
  direktAbflugsZeit: "10:10",
  zwischenstoppAnzahl: "no",
  direktAnkunftsDatum: "10.10.2022",
  direktAnkunftsZeit: "09:09",
  tatsaechlicherFlug: "no",
  ersatzverbindungArt: "flug",
  ersatzFlugnummer: "AB6303",
  ersatzFlugAnkunftsDatum: "10.02.2024",
  ersatzFlugAnkunftsZeit: "10:10",
  zusaetzlicheAngaben:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  anrede: "Fr.",
  title: "",
  vorname: "Test-Test",
  nachname: "Test",
  strasseHausnummer: "Musterstr. 22",
  plz: "10969",
  ort: "Berlin",
  telefonnummer: "1010101010",
  iban: "DE68500123456789000000",
  kontoinhaber: "Test-Test Müller",
  isWeiterePersonen: "no",
} satisfies FluggastrechtContext;
