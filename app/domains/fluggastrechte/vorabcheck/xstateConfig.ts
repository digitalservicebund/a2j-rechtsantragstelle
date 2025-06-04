import type { Config } from "~/services/flow/server/buildFlowController";
import type { FluggastrechtVorabcheckUserData } from "./userData";

export const fluggastrechteVorabcheckXstateConfig = {
  id: "/fluggastrechte/vorabcheck",
  initial: "start",
  states: {
    start: {
      on: {
        SUBMIT: "bereich",
      },
    },
    bereich: {
      on: {
        BACK: "start",
        SUBMIT: [
          {
            target: "verspaetung",
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          {
            target: "ausgleich",
            guard: ({ context }) => context.bereich === "nichtbefoerderung",
          },
          {
            target: "ankuendigung",
            guard: ({ context }) => context.bereich === "annullierung",
          },
          {
            target: "ergebnis/bereich-abbruch",
          },
        ],
      },
    },
    "ergebnis/bereich-abbruch": {
      on: {
        BACK: "bereich",
      },
    },
    verspaetung: {
      on: {
        BACK: "bereich",
        SUBMIT: [
          {
            target: "gruende",
            guard: ({ context }) => context.verspaetung === "yes",
          },
          {
            target: "ergebnis/verspaetung-abbruch",
          },
        ],
      },
    },
    ausgleich: {
      on: {
        BACK: "bereich",
        SUBMIT: [
          {
            target: "ausgleich-angenommen",
            guard: "ausgleichYes",
          },
          "checkin-nicht-befoerderung",
        ],
      },
    },
    ankuendigung: {
      on: {
        BACK: "bereich",
        SUBMIT: [
          {
            target: "ergebnis/ankuendigung-abbruch",
            guard: ({ context }) => context.ankuendigung === "moreThan13Days",
          },
          "ersatzflug",
        ],
      },
    },
    "vertretbare-gruende-annullierung": {
      on: {
        BACK: [
          {
            target: "ersatzflug",
            guard: ({ context }) =>
              context.ankuendigung !== "moreThan13Days" &&
              context.ersatzflug === "no",
          },
          {
            target: "ersatzflug-landen-zwei-stunden",
            guard: "isErsatzflugYesAndAnkuendigungUntil6DaysOrNo",
          },
          {
            target: "ersatzflug-landen-vier-stunden",
            guard: ({ context }) =>
              context.ankuendigung === "between7And13Days" &&
              context.ersatzflug === "yes",
          },
          "ankuendigung",
        ],
        SUBMIT: [
          {
            target: "gruende-hinweis",
            guard: "vertretbareGruendeAnnullierungYes",
          },
          {
            target: "verjaehrung",
          },
        ],
      },
    },
    ersatzflug: {
      on: {
        BACK: "ankuendigung",
        SUBMIT: [
          {
            target: "vertretbare-gruende-annullierung",
            guard: "ersatzflugNo",
          },
          {
            target: "ersatzflug-starten-eine-stunde",
            guard: "isErsatzflugYesAndAnkuendigungUntil6DaysOrNo",
          },
          {
            target: "ersatzflug-starten-zwei-stunden",
          },
        ],
      },
    },
    "ersatzflug-starten-eine-stunde": {
      on: {
        BACK: "ersatzflug",
        SUBMIT: "ersatzflug-landen-zwei-stunden",
      },
    },
    "ersatzflug-landen-zwei-stunden": {
      on: {
        BACK: "ersatzflug-starten-eine-stunde",
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.ersatzflugLandenZweiStunden === "no" &&
              context.ersatzflugStartenEinStunde === "no",
            target: "ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch",
          },
          "vertretbare-gruende-annullierung",
        ],
      },
    },
    "ersatzflug-starten-zwei-stunden": {
      on: {
        BACK: "ersatzflug",
        SUBMIT: "ersatzflug-landen-vier-stunden",
      },
    },
    "ersatzflug-landen-vier-stunden": {
      on: {
        BACK: "ersatzflug-starten-zwei-stunden",
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.ersatzflugLandenVierStunden === "no" &&
              context.ersatzflugStartenZweiStunden === "no",
            target: "ergebnis/ersatzflug-starten-zwei-landen-vier-abbruch",
          },
          "vertretbare-gruende-annullierung",
        ],
      },
    },
    "ausgleich-angenommen": {
      on: {
        BACK: "ausgleich",
        SUBMIT: "checkin-nicht-befoerderung",
      },
    },
    "ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch": {
      on: {
        BACK: "ersatzflug-landen-zwei-stunden",
      },
    },
    "ergebnis/ersatzflug-starten-zwei-landen-vier-abbruch": {
      on: {
        BACK: "ersatzflug-landen-vier-stunden",
      },
    },
    gruende: {
      on: {
        BACK: "verspaetung",
        SUBMIT: [
          {
            target: "verjaehrung",
            guard: "gruendeNo",
          },
          {
            target: "gruende-hinweis",
            guard: "gruendeYes",
          },
        ],
      },
    },
    "gruende-hinweis": {
      on: {
        BACK: [
          {
            target: "vertretbare-gruende-annullierung",
            guard: ({ context }) => context.bereich === "annullierung",
          },
          {
            target: "gruende",
          },
        ],
        SUBMIT: "verjaehrung",
      },
    },
    verjaehrung: {
      on: {
        BACK: [
          {
            target: "gruende-hinweis",
            guard: ({ context }) =>
              context.bereich === "annullierung" &&
              context.vertretbareGruendeAnnullierung === "yes",
          },
          {
            target: "vertretbare-gruende-annullierung",
            guard: ({ context }) => context.bereich === "annullierung",
          },
          {
            target: "vertretbare-gruende",
            guard: ({ context }) =>
              context?.bereich === "nichtbefoerderung" &&
              context?.vertretbareGruende === "no",
          },
          {
            target: "gruende",
            guard: "gruendeNo",
          },
          {
            target: "gruende-hinweis",
            guard: "gruendeYes",
          },
        ],
        SUBMIT: [
          {
            target: "ergebnis/verjaehrung-abbruch",
            guard: "verjaehrungNo",
          },
          {
            target: "flughaefen",
            guard: "verjaehrungYes",
          },
        ],
      },
    },
    "ergebnis/verjaehrung-abbruch": {
      on: {
        BACK: "verjaehrung",
      },
    },
    "ergebnis/ankuendigung-abbruch": {
      on: {
        BACK: "ankuendigung",
      },
    },
    flughaefen: {
      on: {
        BACK: "verjaehrung",
        SUBMIT: [
          {
            target: "ergebnis/flughaefen-entfernung-abbruch",
            guard: "isInvalidAirportDistance",
          },
          {
            target: "ergebnis/flughaefen-abbruch",
            guard: "areAirportsOutsideEU",
          },
          "fluggesellschaft",
        ],
      },
    },
    "ergebnis/flughaefen-abbruch": {
      on: {
        BACK: "flughaefen",
      },
    },
    "ergebnis/flughaefen-entfernung-abbruch": {
      on: {
        BACK: "flughaefen",
      },
    },
    fluggesellschaft: {
      on: {
        BACK: "flughaefen",
        SUBMIT: [
          {
            target: "ergebnis/fluggesellschaft-nicht-eu-abbruch",
            guard: "isNonGermanAirportsAndIsNotClaimableInEU",
          },
          {
            target: "ergebnis/fluggesellschaft-nicht-eu-abbruch",
            guard: "isGermanEndAirportsAndIsNotClaimable",
          },
          {
            target: "ergebnis/fluggesellschaft-abbruch",
            guard: "isGermanEndAirportsAndOtherAirline",
          },
          {
            target: "ergebnis/fluggesellschaft-abbruch-eu",
            guard: "isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline",
          },
          {
            target: "checkin",
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          "kostenlos",
        ],
      },
    },
    "ergebnis/fluggesellschaft-abbruch": {
      on: {
        BACK: "fluggesellschaft",
      },
    },
    "ergebnis/fluggesellschaft-nicht-eu-abbruch": {
      on: {
        BACK: "fluggesellschaft",
      },
    },
    "ergebnis/fluggesellschaft-abbruch-eu": {
      on: {
        BACK: "fluggesellschaft",
      },
    },
    "ergebnis/verspaetung-abbruch": {
      on: {
        BACK: "verspaetung",
      },
    },
    checkin: {
      on: {
        BACK: ["fluggesellschaft"],
        SUBMIT: [
          {
            target: "kostenlos",
            guard: "checkinYes",
          },
          "ergebnis/checkin-abbruch",
        ],
      },
    },
    "checkin-nicht-befoerderung": {
      on: {
        BACK: [
          {
            target: "ausgleich-angenommen",
            guard: "ausgleichYes",
          },
          "ausgleich",
        ],
        SUBMIT: [
          {
            target: "vertretbare-gruende",
            guard: "checkinYes",
          },
          "ergebnis/checkin-abbruch",
        ],
      },
    },
    "ergebnis/checkin-abbruch": {
      on: {
        BACK: [
          {
            target: "checkin-nicht-befoerderung",
            guard: ({ context }) => context.bereich === "nichtbefoerderung",
          },
          "checkin",
        ],
      },
    },
    "vertretbare-gruende": {
      on: {
        BACK: "checkin-nicht-befoerderung",
        SUBMIT: [
          {
            target: "verjaehrung",
            guard: "vertretbareGruendeNo",
          },
          {
            target: "ergebnis/vertretbare-gruende-abbruch",
          },
        ],
      },
    },
    "ergebnis/vertretbare-gruende-abbruch": {
      on: {
        BACK: "vertretbare-gruende",
      },
    },
    kostenlos: {
      on: {
        BACK: [
          {
            target: "checkin",
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          "fluggesellschaft",
        ],
        SUBMIT: [
          {
            target: "ergebnis/kostenlos-abbruch",
            guard: "kostenlosYes",
          },
          {
            target: "rabatt",
          },
        ],
      },
    },
    "ergebnis/kostenlos-abbruch": {
      on: {
        BACK: "kostenlos",
      },
    },
    rabatt: {
      on: {
        BACK: "kostenlos",
        SUBMIT: [
          {
            target: "buchung",
            guard: "rabattNo",
          },
          {
            target: "ergebnis/rabatt-abbruch",
            guard: "rabattYes",
          },
        ],
      },
    },
    "ergebnis/rabatt-abbruch": {
      on: {
        BACK: "rabatt",
      },
    },
    buchung: {
      on: {
        BACK: "rabatt",
        SUBMIT: [
          {
            target: "abtretung",
            guard: "buchungYes",
          },
          {
            target: "ergebnis/buchung-abbruch",
            guard: "buchungNo",
          },
        ],
      },
    },
    "ergebnis/buchung-abbruch": {
      on: {
        BACK: "buchung",
      },
    },
    abtretung: {
      on: {
        BACK: "buchung",
        SUBMIT: [
          {
            target: "entschaedigung",
            guard: "abtretungNo",
          },
          {
            target: "ergebnis/abtretung-abbruch",
            guard: "abtretungYes",
          },
        ],
      },
    },
    "ergebnis/abtretung-abbruch": {
      on: {
        BACK: "abtretung",
      },
    },
    entschaedigung: {
      on: {
        BACK: "abtretung",
        SUBMIT: [
          {
            target: "gericht",
            guard: "entschaedigungYes",
          },
          {
            target: "ergebnis/erfolg-kontakt",
            guard: "entschaedigungNo",
          },
        ],
      },
    },
    "ergebnis/erfolg-kontakt": {
      on: {
        BACK: "entschaedigung",
      },
    },
    gericht: {
      on: {
        BACK: "entschaedigung",
        SUBMIT: [
          {
            target: "ergebnis/erfolg-gericht",
            guard: "gerichtYes",
          },
          {
            target: "ergebnis/erfolg-eu",
            guard: "isErfolgEU",
          },
          {
            target: "ergebnis/erfolg-analog",
            guard: "isErfolgAnalogGuard",
          },
          "ergebnis/erfolg",
        ],
      },
    },
    "ergebnis/erfolg-gericht": {
      on: {
        BACK: "gericht",
      },
    },
    "ergebnis/erfolg": {
      on: {
        SUBMIT: "ergebnis/erfolg-per-post-klagen",
        BACK: "gericht",
      },
    },
    "ergebnis/erfolg-eu": {
      on: {
        BACK: "gericht",
      },
    },
    "ergebnis/erfolg-analog": {
      on: {
        SUBMIT: "ergebnis/erfolg-per-post-klagen",
        BACK: "gericht",
      },
    },
    "ergebnis/erfolg-per-post-klagen": {},
  },
} satisfies Config<FluggastrechtVorabcheckUserData>;
