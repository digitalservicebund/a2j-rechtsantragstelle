import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

export const userDataMock = {
  startAirport: "BER",
  endAirport: "JFK",
  bereich: "verspaetet",
  fluggesellschaft: "LH",
  prozesszinsen: "yes",
  versaeumnisurteil: "yes",
  direktFlugnummer: "AB6303",
  buchungsNummer: "AB6303",
  direktAbflugsDatum: "10.10.2023",
  direktAbflugsZeit: "09:00",
  zwischenstoppAnzahl: "no",
  direktAnkunftsDatum: "10.10.2023",
  direktAnkunftsZeit: "10:00",
  tatsaechlicherFlug: "no",
  ersatzverbindungArt: "flug",
  ersatzFlugnummer: "AB6303",
  ersatzFlugAnkunftsDatum: "10.02.2024",
  ersatzFlugAnkunftsZeit: "10:10",
  zusaetzlicheAngaben:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  anrede: "herr",
  title: "",
  vorname: "Test-Test",
  nachname: "Test",
  strasseHausnummer: "Musterstr. 22",
  plz: "10969",
  ort: "Berlin",
  land: "Deutschland",
  telefonnummer: "1010101010",
  iban: "DE68500123456789000000",
  kontoinhaber: "Test-Test Müller",
  isWeiterePersonen: "no",
  fluggesellschaftStrasseHausnummer: "Musterstr. 30",
  fluggesellschaftPostleitzahl: "10970",
  fluggesellschaftOrt: "Berlin",
  fluggesellschaftLand: "Deutschland",
} satisfies FluggastrechteUserData;
