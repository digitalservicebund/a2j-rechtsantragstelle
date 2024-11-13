import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { fluggastrechteGuards } from "~/domains/fluggastrechte/formular/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const baseContext = {
  bereich: "nichtbefoerderung",
  direktFlugnummer: "AB1234",
  buchungsNummer: "X36Q9C",
  direktAbflugsDatum: "01.05.2023",
  direktAbflugsZeit: "10:00",
  direktAnkunftsDatum: "02.05.2023",
  direktAnkunftsZeit: "10:00",
};

const cases = [
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "no",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "no",
      ersatzverbindungArt: "etwasAnderes",
      andereErsatzverbindungBeschreibung: "Beschreibung",
      andereErsatzverbindungAnkunftsDatum: "10.03.2024",
      andereErsatzverbindungAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/ersatzverbindung-beschreibung",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "no",
      ersatzverbindungArt: "keineAnkunft",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      verspaeteterFlug: "startAirportFirstZwischenstopp",
      anschlussFlugVerpasst: "no",
      ersterZwischenstopp: "HAM",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-1",
      "flugdaten/verspaeteter-flug-1",
      "flugdaten/anschluss-flug-verpasst",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      verspaeteterFlug: "firstZwischenstoppEndAirport",
      ersterZwischenstopp: "HAM",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-1",
      "flugdaten/verspaeteter-flug-1",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "twoStop",
      verspaeteterFlug: "firstAirportSecondZwischenstopp",
      anschlussFlugVerpasst: "no",
      ersterZwischenstopp: "HAM",
      zweiterZwischenstopp: "JFK",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-2",
      "flugdaten/verspaeteter-flug-2",
      "flugdaten/anschluss-flug-verpasst",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "twoStop",
      verspaeteterFlug: "secondZwischenstoppEndAirport",
      ersterZwischenstopp: "HAM",
      zweiterZwischenstopp: "JFK",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-2",
      "flugdaten/verspaeteter-flug-2",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "threeStop",
      verspaeteterFlug: "startAirportFirstZwischenstopp",
      anschlussFlugVerpasst: "no",
      ersterZwischenstopp: "HAM",
      zweiterZwischenstopp: "BER",
      dritterZwischenstopp: "MUC",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-3",
      "flugdaten/verspaeteter-flug-3",
      "flugdaten/anschluss-flug-verpasst",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "threeStop",
      verspaeteterFlug: "firstAirportSecondZwischenstopp",
      anschlussFlugVerpasst: "no",
      ersterZwischenstopp: "HAM",
      zweiterZwischenstopp: "BER",
      dritterZwischenstopp: "MUC",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-3",
      "flugdaten/verspaeteter-flug-3",
      "flugdaten/anschluss-flug-verpasst",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "threeStop",
      verspaeteterFlug: "secondAirportThirdZwischenstopp",
      anschlussFlugVerpasst: "no",
      ersterZwischenstopp: "HAM",
      zweiterZwischenstopp: "BER",
      dritterZwischenstopp: "MUC",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-3",
      "flugdaten/verspaeteter-flug-3",
      "flugdaten/anschluss-flug-verpasst",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "threeStop",
      verspaeteterFlug: "thirdZwischenstoppEndAirport",
      ersterZwischenstopp: "HAM",
      zweiterZwischenstopp: "BER",
      dritterZwischenstopp: "MUC",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-3",
      "flugdaten/verspaeteter-flug-3",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularFlugdatenNichtBefoerderung = {
  machine,
  cases,
};
