import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import { fluggastrechteGuards } from "~/domains/fluggastrechte/formular/guards";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { fluggesellschaftAddresse } from "./flugdatenMock";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const baseContext = {
  ...fluggesellschaftAddresse,
  ersatzflug: "no",
  bereich: "annullierung",
  direktFlugnummer: "AB1234",
  buchungsNummer: "X36Q9C",
  direktAbflugsDatum: "01.05.2023",
  direktAbflugsZeit: "10:00",
  direktAnkunftsDatum: "02.05.2023",
  direktAnkunftsZeit: "10:00",
  annullierungErsatzverbindungFlugnummer: "BCA4321",
  annullierungErsatzverbindungAbflugsDatum: "10.03.2024",
  annullierungErsatzverbindungAbflugsZeit: "10:10",
  annullierungErsatzverbindungAnkunftsDatum: "10.03.2024",
  annullierungErsatzverbindungAnkunftsZeit: "10:10",
};

const cases = [
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "no",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "/flugdaten/adresse-fluggesellschaft",
      "/flugdaten/geplanter-flug",
      "/flugdaten/zusaetzliche-angaben",
      "/persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      ...baseContext,
      zwischenstoppAnzahl: "oneStop",
      verspaeteterFlug: "startAirportFirstZwischenstopp",
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
      verspaeteterFlug: "firstZwischenstoppEndAirport",
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
      verspaeteterFlug: "firstAirportSecondZwischenstopp",
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
      verspaeteterFlug: "secondZwischenstoppEndAirport",
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
      verspaeteterFlug: "startAirportFirstZwischenstopp",
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
      verspaeteterFlug: "firstAirportSecondZwischenstopp",
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
      verspaeteterFlug: "secondAirportThirdZwischenstopp",
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
      verspaeteterFlug: "thirdZwischenstoppEndAirport",
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

export const testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo =
  {
    machine,
    cases,
  };
