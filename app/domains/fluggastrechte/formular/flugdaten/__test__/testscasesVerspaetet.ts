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
  bereich: "verspaetet",
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
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "/flugdaten/adresse-fluggesellschaft",
      "/flugdaten/geplanter-flug",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
      "/flugdaten/anderer-flug-ankunft",
      "/flugdaten/zusaetzliche-angaben",
      "/persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "etwasAnderes",
      andereErsatzverbindungAnkunftsDatum: "10.03.2024",
      andereErsatzverbindungAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
      "/flugdaten/ersatzverbindung-beschreibung",
      "/flugdaten/zusaetzliche-angaben",
      "/persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "keineAnkunft",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
      "/flugdaten/zusaetzliche-angaben",
      "/persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "no",
      tatsaechlicherFlug: "yes",
      tatsaechlicherAnkunftsDatum: "10.03.2024",
      tatsaechlicherAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/tatsaechlicher-flug-ankunft",
      "/flugdaten/zusaetzliche-angaben",
      "/persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      verspaeteterFlug: "startAirportFirstZwischenstopp",
      anschlussFlugVerpasst: "yes",
      ersterZwischenstopp: "HAM",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-1",
      "/flugdaten/verspaeteter-flug-1",
      "/flugdaten/anschluss-flug-verpasst",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
      "/flugdaten/anderer-flug-ankunft",
      "/flugdaten/zusaetzliche-angaben",
      "/persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      verspaeteterFlug: "firstZwischenstoppEndAirport",
      ersterZwischenstopp: "HAM",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-1",
      "/flugdaten/verspaeteter-flug-1",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
      "/flugdaten/anderer-flug-ankunft",
      "/flugdaten/zusaetzliche-angaben",
      "/persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "twoStop",
      verspaeteterFlug: "startAirportFirstZwischenstopp",
      anschlussFlugVerpasst: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-2",
      "/flugdaten/verspaeteter-flug-2",
      "/flugdaten/anschluss-flug-verpasst",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "twoStop",
      verspaeteterFlug: "firstAirportSecondZwischenstopp",
      anschlussFlugVerpasst: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-2",
      "/flugdaten/verspaeteter-flug-2",
      "/flugdaten/anschluss-flug-verpasst",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "twoStop",
      verspaeteterFlug: "secondZwischenstoppEndAirport",
      anschlussFlugVerpasst: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-2",
      "/flugdaten/verspaeteter-flug-2",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "threeStop",
      verspaeteterFlug: "startAirportFirstZwischenstopp",
      anschlussFlugVerpasst: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-3",
      "/flugdaten/verspaeteter-flug-3",
      "/flugdaten/anschluss-flug-verpasst",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "threeStop",
      verspaeteterFlug: "firstAirportSecondZwischenstopp",
      anschlussFlugVerpasst: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-3",
      "/flugdaten/verspaeteter-flug-3",
      "/flugdaten/anschluss-flug-verpasst",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "threeStop",
      verspaeteterFlug: "secondAirportThirdZwischenstopp",
      anschlussFlugVerpasst: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-3",
      "/flugdaten/verspaeteter-flug-3",
      "/flugdaten/anschluss-flug-verpasst",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "threeStop",
      verspaeteterFlug: "thirdZwischenstoppEndAirport",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
    },
    [
      "/flugdaten/geplanter-flug",
      "/flugdaten/zwischenstopp-uebersicht-3",
      "/flugdaten/verspaeteter-flug-3",
      "/flugdaten/tatsaechlicher-flug",
      "/flugdaten/ersatzverbindung-art",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularFlugdatenVerspaetet = {
  machine,
  cases,
};
