import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

const baseContext: FluggastrechtVorabcheckUserData = {
  verjaehrung: "yes",
  fluggesellschaft: "AF",
  kostenlos: "no",
  rabatt: "no",
  buchung: "yes",
  abtretung: "no",
};

const otherErfolgs1Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  startAirport: "JFK",
  endAirport: "MUC",
  checkin: "yes",
  entschaedigung: "no",
};

const otherErfolgs2Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  startAirport: "JFK",
  endAirport: "MUC",
  checkin: "yes",
  entschaedigung: "yes",
  gericht: "yes",
};

const otherErfolgs3Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  bereich: "annullierung",
  ankuendigung: "between7And13Days",
  ersatzflug: "yes",
  ersatzflugStartenZweiStunden: "yes",
  ersatzflugLandenVierStunden: "no",
  vertretbareGruendeAnnullierung: "no",
  startAirport: "MUC",
  endAirport: "MUN",
  entschaedigung: "yes",
  gericht: "yes",
};

const otherErfolgs4Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  bereich: "nichtbefoerderung",
  ausgleich: "yes",
  ausgleichAngenommen: "no",
  vertretbareGruende: "no",
  startAirport: "JFK",
  endAirport: "MUC",
  checkin: "yes",
  entschaedigung: "yes",
  gericht: "yes",
};

export const testcasesFluggastrechtOtherErfolgsNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "other-erfolgs-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/verspaetung",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/gruende",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/flughaefen",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/checkin",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/kostenlos",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/rabatt",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/buchung",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/abtretung",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: otherErfolgs1Context,
      },
      {
        stepId: "/ergebnis/erfolg-kontakt",
      },
    ],
    "other-erfolgs-2": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/verspaetung",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/gruende",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/flughaefen",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/checkin",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/kostenlos",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/rabatt",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/buchung",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/abtretung",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/gericht",
        userInput: otherErfolgs2Context,
      },
      {
        stepId: "/ergebnis/erfolg-gericht",
      },
    ],
    "other-erfolgs-3": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/ersatzflug-starten-zwei-stunden",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/ersatzflug-landen-vier-stunden",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/verjaehrung",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/flughaefen",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/kostenlos",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/rabatt",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/buchung",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/abtretung",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/gericht",
        userInput: otherErfolgs3Context,
      },
      {
        stepId: "/ergebnis/erfolg-gericht",
      },
    ],
    "other-erfolgs-4": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/ausgleich",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/verjaehrung",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/flughaefen",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/kostenlos",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/rabatt",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/buchung",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/abtretung",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/gericht",
        userInput: otherErfolgs4Context,
      },
      {
        stepId: "/ergebnis/erfolg-gericht",
      },
    ],
  };
