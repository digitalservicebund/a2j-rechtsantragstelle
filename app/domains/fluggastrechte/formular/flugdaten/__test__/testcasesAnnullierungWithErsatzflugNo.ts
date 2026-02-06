import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { fluggesellschaftAddresse } from "./flugdatenMock";
import { daysFromToday } from "./mockedDate";

const baseContext = {
  ...fluggesellschaftAddresse,
  ersatzflug: "no",
  bereich: "annullierung",
  direktFlugnummer: "AB1234",
  buchungsNummer: "X36Q9C",
  direktAbflugsDatum: daysFromToday(0),
  direktAbflugsZeit: "10:00",
  direktAnkunftsDatum: daysFromToday(0),
  direktAnkunftsZeit: "10:00",
  annullierungErsatzverbindungFlugnummer: "BCA4321",
  annullierungErsatzverbindungAbflugsDatum: daysFromToday(0),
  annullierungErsatzverbindungAbflugsZeit: "10:10",
  annullierungErsatzverbindungAnkunftsDatum: daysFromToday(0),
  annullierungErsatzverbindungAnkunftsZeit: "10:10",
};

export const testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo =
  [
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "no",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "oneStop",
        verspaeteterFlugOneStop: "startAirportFirstZwischenstopp",
        anschlussFlugVerpasst: "no",
        ersterZwischenstopp: "HAM",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zwischenstopp-uebersicht-1",
        "/flugdaten/verspaeteter-flug-1",
        "/flugdaten/anschluss-flug-verpasst",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "oneStop",
        verspaeteterFlugOneStop: "firstZwischenstoppEndAirport",
        ersterZwischenstopp: "HAM",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zwischenstopp-uebersicht-1",
        "/flugdaten/verspaeteter-flug-1",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        verspaeteterFlugTwoStops: "firstAirportSecondZwischenstopp",
        anschlussFlugVerpasst: "no",
        ersterZwischenstopp: "HAM",
        zweiterZwischenstopp: "MUC",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zwischenstopp-uebersicht-2",
        "/flugdaten/verspaeteter-flug-2",
        "/flugdaten/anschluss-flug-verpasst",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "twoStop",
        verspaeteterFlugTwoStops: "secondZwischenstoppEndAirport",
        ersterZwischenstopp: "HAM",
        zweiterZwischenstopp: "MUC",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zwischenstopp-uebersicht-2",
        "/flugdaten/verspaeteter-flug-2",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "threeStop",
        verspaeteterFlugThreeStops: "startAirportFirstZwischenstopp",
        anschlussFlugVerpasst: "no",
        ersterZwischenstopp: "HAM",
        zweiterZwischenstopp: "MUC",
        dritterZwischenstopp: "FRA",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zwischenstopp-uebersicht-3",
        "/flugdaten/verspaeteter-flug-3",
        "/flugdaten/anschluss-flug-verpasst",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "threeStop",
        verspaeteterFlugThreeStops: "firstAirportSecondZwischenstopp",
        anschlussFlugVerpasst: "no",
        ersterZwischenstopp: "HAM",
        zweiterZwischenstopp: "MUC",
        dritterZwischenstopp: "FRA",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zwischenstopp-uebersicht-3",
        "/flugdaten/verspaeteter-flug-3",
        "/flugdaten/anschluss-flug-verpasst",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "threeStop",
        verspaeteterFlugThreeStops: "secondAirportThirdZwischenstopp",
        anschlussFlugVerpasst: "no",
        ersterZwischenstopp: "HAM",
        zweiterZwischenstopp: "MUC",
        dritterZwischenstopp: "FRA",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zwischenstopp-uebersicht-3",
        "/flugdaten/verspaeteter-flug-3",
        "/flugdaten/anschluss-flug-verpasst",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
    [
      {
        ...baseContext,
        zwischenstoppAnzahl: "threeStop",
        verspaeteterFlugThreeStops: "thirdZwischenstoppEndAirport",
        ersterZwischenstopp: "HAM",
        zweiterZwischenstopp: "MUC",
        dritterZwischenstopp: "FRA",
        zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
      },
      [
        "/flugdaten/geplanter-flug",
        "/flugdaten/zwischenstopp-uebersicht-3",
        "/flugdaten/verspaeteter-flug-3",
        "/flugdaten/zusaetzliche-angaben",
        "/persoenliche-daten/person/daten",
      ],
    ],
  ] as const satisfies TestCases<FluggastrechteUserData>;
