/* eslint sonarjs/no-duplicate-string: 0 */
import { createMachine } from "xstate";
import type { TestCases } from "~/flows/__test__/TestCases";
import { fluggastrechtFlow } from "~/flows/fluggastrechteFormular";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import { fluggastrechteGuards } from "~/flows/fluggastrechteFormular/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const cases = [
  [
    {
      bereich: "verspaetet",
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "01.05.2023",
      direktAbflugsZeit: "10:00",
      direktAnkunftsDatum: "02.05.2023",
      direktAnkunftsZeit: "10:00",
      zwischenstoppAnzahl: "oneStop",
      ersterZwischenstopp: "HAM",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "BCA4321",
      ersatzFlugAnkunftsDatum: "10.03.2024",
      ersatzFlugAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-1",
      "flugdaten/tatsaechlicher-flug",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "01.05.2023",
      direktAbflugsZeit: "10:00",
      direktAnkunftsDatum: "02.05.2023",
      direktAnkunftsZeit: "10:00",
      zwischenstoppAnzahl: "oneStop",
      ersterZwischenstopp: "HAM",
      tatsaechlicherFlug: "yes",
      tatsaechlicherAnkunftsDatum: "10.03.2024",
      tatsaechlicherAnkunftsZeit: "10:10",
      zusaetzlicheAngaben: "Zusätzliche Angaben zum Reiseverlauf",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopp-uebersicht-1",
      "flugdaten/tatsaechlicher-flug",
      "flugdaten/tatsaechlicher-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "01.05.2023",
      direktAbflugsZeit: "10:00",
      direktAnkunftsDatum: "02.05.2023",
      direktAnkunftsZeit: "10:00",
      zwischenstoppAnzahl: "twoStop",
    },
    ["flugdaten/geplanter-flug", "flugdaten/zwischenstopp-uebersicht-2"],
  ],
  [
    {
      bereich: "verspaetet",
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "01.05.2023",
      direktAbflugsZeit: "10:00",
      direktAnkunftsDatum: "02.05.2023",
      direktAnkunftsZeit: "10:00",
      zwischenstoppAnzahl: "threeStop",
    },
    ["flugdaten/geplanter-flug", "flugdaten/zwischenstopp-uebersicht-3"],
  ],
  [
    {
      bereich: "verspaetet",
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "01.05.2023",
      direktAbflugsZeit: "10:00",
      direktAnkunftsDatum: "02.05.2023",
      direktAnkunftsZeit: "10:00",
      zwischenstoppAnzahl: "fourStop",
    },
    ["flugdaten/geplanter-flug", "flugdaten/zwischenstopp-uebersicht-4"],
  ],
  [
    {
      bereich: "verspaetet",
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "01.05.2023",
      direktAbflugsZeit: "10:00",
      direktAnkunftsDatum: "02.05.2023",
      direktAnkunftsZeit: "10:00",
      zwischenstoppAnzahl: "fiveStop",
    },
    ["flugdaten/geplanter-flug", "flugdaten/zwischenstopp-uebersicht-5"],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "01.05.2023",
      direktAbflugsZeit: "10:00",
      direktAnkunftsDatum: "02.05.2023",
      direktAnkunftsZeit: "10:00",
      zwischenstoppAnzahl: "oneStop",
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
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      bereich: "annullierung",
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "01.05.2023",
      direktAbflugsZeit: "10:00",
      zwischenstoppAnzahl: "no",
      direktAnkunftsDatum: "02.05.2023",
      direktAnkunftsZeit: "10:00",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "etwasAnderes",
      andereErsatzverbindungBeschreibung: "Lorem ipsum",
      andereErsatzverbindungStartDatum: "03.04.2023",
      andereErsatzverbindungStartZeit: "10:00",
      andereErsatzverbindungAnkunftsDatum: "06.04.2023",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/ersatzverbindung-beschreibung",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularFlugdaten = { machine, cases };
