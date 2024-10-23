import { createMachine } from "xstate";
import type { TestCases } from "~/flows/__test__/TestCases";
import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechteVorabcheck/context";
import fluggastrechte from "~/flows/fluggastrechteVorabcheck/flow.json";
import { guards } from "~/flows/fluggastrechteVorabcheck/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechte, context: {} },
  { guards },
);

const cases = [
  [
    {
      bereich: "annullierung",
      ankuendigung: "no",
      ersatzflug: "yes",
      ersatzflugStartenEinStunde: "no",
      ersatzflugLandenZweiStunden: "no",
    },
    [
      "start",
      "bereich",
      "ankuendigung",
      "ersatzflug",
      "ersatzflug-starten-eine-stunde",
      "ersatzflug-landen-zwei-stunden",
      "ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch",
    ],
  ],
  [
    {
      bereich: "annullierung",
      ankuendigung: "until6Days",
      ersatzflug: "yes",
      ersatzflugStartenEinStunde: "no",
      ersatzflugLandenZweiStunden: "no",
    },
    [
      "start",
      "bereich",
      "ankuendigung",
      "ersatzflug",
      "ersatzflug-starten-eine-stunde",
      "ersatzflug-landen-zwei-stunden",
      "ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch",
    ],
  ],
  [
    {
      bereich: "annullierung",
      ankuendigung: "between7And13Days",
      ersatzflug: "yes",
      ersatzflugStartenZweiStunden: "no",
      ersatzflugLandenVierStunden: "no",
      vertretbareGruendeAnnullierung: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "AF",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "yes",
    },
    [
      "start",
      "bereich",
      "ankuendigung",
      "ersatzflug",
      "ersatzflug-starten-zwei-stunden",
      "ersatzflug-landen-vier-stunden",
      "ergebnis/ersatzflug-starten-zwei-landen-vier-abbruch",
    ],
  ],
  [
    {
      bereich: "annullierung",
      ankuendigung: "moreThan13Days",
    },
    ["start", "bereich", "ankuendigung", "ergebnis/ankuendigung-abbruch"],
  ],
  [
    {
      bereich: "annullierung",
      ankuendigung: "no",
      vertretbareGruendeAnnullierung: "yes",
      verjaehrung: "yes",
      ersatzflug: "no",
      startAirport: "JFK",
      endAirport: "BER",
      fluggesellschaft: "DL",
    },
    [
      "start",
      "bereich",
      "ankuendigung",
      "ersatzflug",
      "vertretbare-gruende-annullierung",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      bereich: "annullierung",
      ankuendigung: "no",
      vertretbareGruendeAnnullierung: "yes",
      verjaehrung: "yes",
      ersatzflug: "no",
      startAirport: "JFK",
      endAirport: "AMS",
      fluggesellschaft: "sonstiges",
    },
    [
      "start",
      "bereich",
      "ankuendigung",
      "ersatzflug",
      "vertretbare-gruende-annullierung",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-abbruch-eu",
    ],
  ],
  [
    {
      bereich: "annullierung",
      ankuendigung: "no",
      vertretbareGruendeAnnullierung: "yes",
      verjaehrung: "yes",
      ersatzflug: "no",
      startAirport: "CDG",
      endAirport: "DRS",
      fluggesellschaft: "DL",
    },
    [
      "start",
      "bereich",
      "ankuendigung",
      "ersatzflug",
      "vertretbare-gruende-annullierung",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      bereich: "annullierung",
      ankuendigung: "no",
      vertretbareGruendeAnnullierung: "yes",
      verjaehrung: "yes",
      ersatzflug: "no",
      startAirport: "CDG",
      endAirport: "DRS",
      fluggesellschaft: "sonstiges",
    },
    [
      "start",
      "bereich",
      "ankuendigung",
      "ersatzflug",
      "vertretbare-gruende-annullierung",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-abbruch",
    ],
  ],
  [
    {
      bereich: "annullierung",
      ankuendigung: "no",
      vertretbareGruendeAnnullierung: "yes",
      verjaehrung: "yes",
      ersatzflug: "no",
      startAirport: "CDG",
      endAirport: "BER",
      fluggesellschaft: "DL",
    },
    [
      "start",
      "bereich",
      "ankuendigung",
      "ersatzflug",
      "vertretbare-gruende-annullierung",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechteAnnullierung = {
  machine,
  cases,
};
