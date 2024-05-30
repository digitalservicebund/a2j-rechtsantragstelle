import type { TestCases } from "~/models/flows/__test__/TestCases";
import { guards } from "~/models/flows/fluggastrechte/guards";
import fluggastrechte from "~/models/flows/fluggastrechte/config.json";
import type { FluggastrechtVorabcheckContext } from "~/models/flows/fluggastrechte/context";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { createMachine } from "xstate";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechte, context: {} },
  { guards },
);

const cases = [
  [
    {
      bereich: "annulierung",
      ankuendigung: "no",
      vertretbareGruendeAnnullierung: "yes",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
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
      "vertretbare-gruende-annullierung",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg-gericht",
    ],
  ],
  [
    {
      bereich: "annulierung",
      ankuendigung: "no",
      vertretbareGruendeAnnullierung: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
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
      "vertretbare-gruende-annullierung",
      "verjaehrung",
      "flughaefen",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg-gericht",
    ],
  ],
  [
    {
      bereich: "annulierung",
      ankuendigung: "until6Days",
      ersatzflug: "no",
      vertretbareGruendeAnnullierung: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
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
      "vertretbare-gruende-annullierung",
      "verjaehrung",
      "flughaefen",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg-gericht",
    ],
  ],
  [
    {
      bereich: "annulierung",
      ankuendigung: "until6Days",
      ersatzflug: "yes",
      ersatzflugStartenEinStunde: "yes",
      ersatzflugLandenZweiStuden: "yes",
      vertretbareGruendeAnnullierung: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
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
      "ersatzflug-starten-eine-stunde",
      "ersatzflug-landen-zwei-stunden",
      "vertretbare-gruende-annullierung",
      "verjaehrung",
      "flughaefen",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg-gericht",
    ],
  ],
  [
    {
      bereich: "annulierung",
      ankuendigung: "until6Days",
      ersatzflug: "yes",
      ersatzflugStartenEinStunde: "no",
      ersatzflugLandenZweiStuden: "no",
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
      bereich: "annulierung",
      ankuendigung: "until6Days",
      ersatzflug: "yes",
      ersatzflugStartenEinStunde: "yes",
      ersatzflugLandenZweiStuden: "no",
      vertretbareGruendeAnnullierung: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
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
      "ersatzflug-starten-eine-stunde",
      "ersatzflug-landen-zwei-stunden",
      "vertretbare-gruende-annullierung",
      "verjaehrung",
      "flughaefen",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg-gericht",
    ],
  ],
  [
    {
      bereich: "annulierung",
      ankuendigung: "between7And13Days",
      ersatzflug: "yes",
      ersatzflugStartenZweiStunden: "yes",
      ersatzflugLandenVierStunden: "no",
      vertretbareGruendeAnnullierung: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
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
      "vertretbare-gruende-annullierung",
      "verjaehrung",
      "flughaefen",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg-gericht",
    ],
  ],
  [
    {
      bereich: "annulierung",
      ankuendigung: "between7And13Days",
      ersatzflug: "yes",
      ersatzflugStartenZweiStunden: "no",
      ersatzflugLandenVierStunden: "no",
      vertretbareGruendeAnnullierung: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
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
      bereich: "annulierung",
      ankuendigung: "between7And13Days",
      ersatzflug: "yes",
      ersatzflugStartenZweiStunden: "no",
      ersatzflugLandenVierStunden: "yes",
      vertretbareGruendeAnnullierung: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
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
      "vertretbare-gruende-annullierung",
      "verjaehrung",
      "flughaefen",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg-gericht",
    ],
  ],
  [
    {
      bereich: "annulierung",
      ankuendigung: "moreThan13Days",
    },
    ["start", "bereich", "ankuendigung", "ergebnis/ankuendigung-abbruch"],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechteAnnullierung = {
  machine,
  cases,
};
