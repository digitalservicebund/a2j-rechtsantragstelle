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

const happyPathSteps = [
  "intro/start",
  "intro/dokumente",
  "intro/daten-uebernahme",
  "flugdaten/geplanter-flug",
  "flugdaten/zwischenstopps",
];

const cases = [
  [{}, happyPathSteps],
  [
    {
      direktFlugnummer: "AB6303",
      direktAbflugsDatum: "10.03.2024",
      direktAbflugsZeit: "22:00",
      direktAnkunftsDatum: "10.03.2024",
      direktAnkunftsZeit: "09:08",
    },
    [
      "intro/daten-uebernahme",
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopps",
    ],
  ],
  [
    {
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "10.03.2024",
      direktAbflugsZeit: "11:11",
      direktAnkunftsDatum: "11.03.2024",
      direktAnkunftsZeit: "22:22",
      zwischenstopps: "no",
      tatsaechlicherFlug: "yes",
      tatsaechlicherAnkunftsDatum: "11.03.2024",
      tatsaechlicherAnkunftsZeit: "11:00",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopps",
      "flugdaten/tatsaechlicher-flug",
      "flugdaten/tatsaechlicher-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      direktFlugnummer: "AB1234",
      direktAbflugsDatum: "10.03.2024",
      direktAbflugsZeit: "11:11",
      direktAnkunftsDatum: "11.03.2024",
      direktAnkunftsZeit: "22:22",
      zwischenstopps: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "flug",
      ersatzFlugnummer: "AB1234",
      ersatzFlugAnkunftsDatum: "11.03.2024",
      ersatzFlugAnkunftsZeit: "00:10",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopps",
      "flugdaten/tatsaechlicher-flug",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/anderer-flug-ankunft",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      direktFlugnummer: "AB6303",
      direktAbflugsDatum: "10.03.2024",
      direktAbflugsZeit: "09:08",
      direktAnkunftsDatum: "11.03.2024",
      direktAnkunftsZeit: "08:10",
      zwischenstopps: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "etwasAnderes",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopps",
      "flugdaten/tatsaechlicher-flug",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/ersatzverbindung-beschreibung",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
  [
    {
      direktFlugnummer: "AB6303",
      direktAbflugsDatum: "10.03.2024",
      direktAbflugsZeit: "09:08",
      direktAnkunftsDatum: "11.03.2024",
      direktAnkunftsZeit: "08:10",
      zwischenstopps: "no",
      tatsaechlicherFlug: "no",
      ersatzverbindungArt: "keineAnkunft",
    },
    [
      "flugdaten/geplanter-flug",
      "flugdaten/zwischenstopps",
      "flugdaten/tatsaechlicher-flug",
      "flugdaten/ersatzverbindung-art",
      "flugdaten/zusaetzliche-angaben",
      "persoenliche-daten/person/daten",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularFlugdaten = { machine, cases };
