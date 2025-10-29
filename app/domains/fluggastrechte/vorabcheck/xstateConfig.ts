import type { Config } from "~/services/flow/server/types";
import type { FluggastrechtVorabcheckUserData } from "./userData";
import { fluggastrechteVorabcheckPages } from "./pages";
import mapValues from "lodash/mapValues";

const stepIds = mapValues(fluggastrechteVorabcheckPages, (v) => v.stepId);

export const fluggastrechteVorabcheckXstateConfig = {
  id: "/fluggastrechte/vorabcheck",
  initial: stepIds.start,
  states: {
    [stepIds.start]: {
      on: {
        SUBMIT: stepIds.bereich,
      },
    },
    [stepIds.bereich]: {
      on: {
        BACK: stepIds.start,
        SUBMIT: [
          {
            target: stepIds.verspaetung,
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          {
            target: stepIds.ausgleich,
            guard: ({ context }) => context.bereich === "nichtbefoerderung",
          },
          {
            target: stepIds.ankuendigung,
            guard: ({ context }) => context.bereich === "annullierung",
          },
          stepIds["bereich-abbruch"],
        ],
      },
    },
    [stepIds["bereich-abbruch"]]: {
      on: {
        BACK: stepIds.bereich,
      },
    },
    [stepIds.verspaetung]: {
      on: {
        BACK: stepIds.bereich,
        SUBMIT: [
          {
            target: stepIds.gruende,
            guard: ({ context }) => context.verspaetung === "yes",
          },
          stepIds["verspaetung-abbruch"],
        ],
      },
    },
    [stepIds.ausgleich]: {
      on: {
        BACK: stepIds.bereich,
        SUBMIT: [
          {
            target: stepIds.ausgleichAngenommen,
            guard: "ausgleichYes",
          },
          stepIds["checkin-nicht-befoerderung"],
        ],
      },
    },
    [stepIds.ankuendigung]: {
      on: {
        BACK: stepIds.bereich,
        SUBMIT: [
          {
            target: stepIds["ankuendigung-abbruch"],
            guard: ({ context }) => context.ankuendigung === "moreThan13Days",
          },
          stepIds.ersatzflug,
        ],
      },
    },
    [stepIds["vertretbare-gruende-annullierung"]]: {
      on: {
        BACK: [
          {
            target: stepIds.ersatzflug,
            guard: ({ context }) =>
              context.ankuendigung !== "moreThan13Days" &&
              context.ersatzflug === "no",
          },
          {
            target: stepIds["ersatzflug-landen-zwei-stunden"],
            guard: "isErsatzflugYesAndAnkuendigungUntil6DaysOrNo",
          },
          {
            target: stepIds["ersatzflug-landen-vier-stunden"],
            guard: ({ context }) =>
              context.ankuendigung === "between7And13Days" &&
              context.ersatzflug === "yes",
          },
          stepIds.ankuendigung,
        ],
        SUBMIT: [
          {
            target: stepIds["gruende-hinweis"],
            guard: ({ context }) =>
              context.vertretbareGruendeAnnullierung === "yes",
          },
          stepIds.verjaehrung,
        ],
      },
    },
    [stepIds.ersatzflug]: {
      on: {
        BACK: stepIds.ankuendigung,
        SUBMIT: [
          {
            target: stepIds["vertretbare-gruende-annullierung"],
            guard: "ersatzflugNo",
          },
          {
            target: stepIds["ersatzflug-starten-eine-stunde"],
            guard: "isErsatzflugYesAndAnkuendigungUntil6DaysOrNo",
          },
          stepIds["ersatzflug-starten-zwei-stunden"],
        ],
      },
    },
    [stepIds["ersatzflug-starten-eine-stunde"]]: {
      on: {
        BACK: stepIds.ersatzflug,
        SUBMIT: stepIds["ersatzflug-landen-zwei-stunden"],
      },
    },
    [stepIds["ersatzflug-landen-zwei-stunden"]]: {
      on: {
        BACK: stepIds["ersatzflug-starten-eine-stunde"],
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.ersatzflugLandenZweiStunden === "no" &&
              context.ersatzflugStartenEinStunde === "no",
            target: stepIds["ersatzflug-starten-eine-landen-zwei-abbruch"],
          },
          stepIds["vertretbare-gruende-annullierung"],
        ],
      },
    },
    [stepIds["ersatzflug-starten-zwei-stunden"]]: {
      on: {
        BACK: stepIds.ersatzflug,
        SUBMIT: stepIds["ersatzflug-landen-vier-stunden"],
      },
    },
    [stepIds["ersatzflug-landen-vier-stunden"]]: {
      on: {
        BACK: stepIds["ersatzflug-starten-zwei-stunden"],
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.ersatzflugLandenVierStunden === "no" &&
              context.ersatzflugStartenZweiStunden === "no",
            target: stepIds["ersatzflug-starten-zwei-landen-vier-abbruch"],
          },
          stepIds["vertretbare-gruende-annullierung"],
        ],
      },
    },
    [stepIds.ausgleichAngenommen]: {
      on: {
        BACK: stepIds.ausgleich,
        SUBMIT: [
          {
            guard: ({ context }) => context.ausgleichAngenommen === "yes",
            target: stepIds["ausgleich-angenommen-info"],
          },
          stepIds["checkin-nicht-befoerderung"],
        ],
      },
    },
    [stepIds["ausgleich-angenommen-info"]]: {
      on: {
        BACK: stepIds.ausgleichAngenommen,
        SUBMIT: stepIds["checkin-nicht-befoerderung"],
      },
    },
    [stepIds["ersatzflug-starten-eine-landen-zwei-abbruch"]]: {
      on: {
        BACK: stepIds["ersatzflug-landen-zwei-stunden"],
      },
    },
    [stepIds["ersatzflug-starten-zwei-landen-vier-abbruch"]]: {
      on: {
        BACK: stepIds["ersatzflug-landen-vier-stunden"],
      },
    },
    [stepIds.gruende]: {
      on: {
        BACK: stepIds.verspaetung,
        SUBMIT: [
          {
            target: stepIds.verjaehrung,
            guard: "gruendeNo",
          },
          stepIds["gruende-hinweis"],
        ],
      },
    },
    [stepIds["gruende-hinweis"]]: {
      on: {
        BACK: [
          {
            target: stepIds["vertretbare-gruende-annullierung"],
            guard: ({ context }) => context.bereich === "annullierung",
          },
          stepIds.gruende,
        ],
        SUBMIT: stepIds.verjaehrung,
      },
    },
    [stepIds.verjaehrung]: {
      on: {
        BACK: [
          {
            target: stepIds["gruende-hinweis"],
            guard: ({ context }) =>
              context.bereich === "annullierung" &&
              context.vertretbareGruendeAnnullierung === "yes",
          },
          {
            target: stepIds["vertretbare-gruende-annullierung"],
            guard: ({ context }) => context.bereich === "annullierung",
          },
          {
            target: stepIds["vertretbare-gruende"],
            guard: ({ context }) =>
              context?.bereich === "nichtbefoerderung" &&
              context?.vertretbareGruende === "no",
          },
          {
            target: stepIds["vertretbare-gruende-info"],
            guard: ({ context }) =>
              context?.bereich === "nichtbefoerderung" &&
              context?.vertretbareGruende === "yes",
          },
          {
            target: stepIds.gruende,
            guard: "gruendeNo",
          },
          stepIds["gruende-hinweis"],
        ],
        SUBMIT: [
          {
            target: stepIds["verjaehrung-abbruch"],
            guard: "verjaehrungNo",
          },
          stepIds.flughaefen,
        ],
      },
    },
    [stepIds["verjaehrung-abbruch"]]: {
      on: {
        BACK: stepIds.verjaehrung,
      },
    },
    [stepIds["ankuendigung-abbruch"]]: {
      on: {
        BACK: stepIds.ankuendigung,
      },
    },
    [stepIds.flughaefen]: {
      on: {
        BACK: stepIds.verjaehrung,
        SUBMIT: [
          {
            target: stepIds["flughaefen-entfernung-abbruch"],
            guard: "isInvalidAirportDistance",
          },
          {
            target: stepIds["flughaefen-abbruch"],
            guard: "areAirportsOutsideEU",
          },
          stepIds.fluggesellschaft,
        ],
      },
    },
    [stepIds["flughaefen-abbruch"]]: {
      on: {
        BACK: stepIds.flughaefen,
      },
    },
    [stepIds["flughaefen-entfernung-abbruch"]]: {
      on: {
        BACK: stepIds.flughaefen,
      },
    },
    [stepIds.fluggesellschaft]: {
      on: {
        BACK: stepIds.flughaefen,
        SUBMIT: [
          {
            target: stepIds["fluggesellschaft-nicht-eu-abbruch"],
            guard: "isNonGermanAirportsAndIsNotClaimableInEU",
          },
          {
            target: stepIds["fluggesellschaft-nicht-eu-abbruch"],
            guard: "isGermanEndAirportsAndIsNotClaimable",
          },
          {
            target: stepIds["fluggesellschaft-abbruch"],
            guard: "isGermanEndAirportsAndOtherAirline",
          },
          {
            target: stepIds["fluggesellschaft-abbruch-eu"],
            guard: "isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline",
          },
          {
            target: stepIds.checkin,
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          stepIds.kostenlos,
        ],
      },
    },
    [stepIds["fluggesellschaft-abbruch"]]: {
      on: {
        BACK: stepIds.fluggesellschaft,
      },
    },
    [stepIds["fluggesellschaft-nicht-eu-abbruch"]]: {
      on: {
        BACK: stepIds.fluggesellschaft,
      },
    },
    [stepIds["fluggesellschaft-abbruch-eu"]]: {
      on: {
        BACK: stepIds.fluggesellschaft,
      },
    },
    [stepIds["verspaetung-abbruch"]]: {
      on: {
        BACK: stepIds.verspaetung,
      },
    },
    [stepIds.checkin]: {
      on: {
        BACK: stepIds.fluggesellschaft,
        SUBMIT: [
          {
            target: "kostenlos",
            guard: "checkinYes",
          },
          stepIds["checkin-abbruch"],
        ],
      },
    },
    [stepIds["checkin-nicht-befoerderung"]]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.ausgleichAngenommen === "yes",
            target: stepIds["ausgleich-angenommen-info"],
          },
          {
            guard: ({ context }) => context.ausgleich === "no",
            target: stepIds.ausgleich,
          },
          stepIds.ausgleichAngenommen,
        ],
        SUBMIT: [
          {
            target: stepIds["vertretbare-gruende"],
            guard: "checkinYes",
          },
          stepIds["checkin-abbruch"],
        ],
      },
    },
    [stepIds["checkin-abbruch"]]: {
      on: {
        BACK: [
          {
            target: stepIds["checkin-nicht-befoerderung"],
            guard: ({ context }) => context.bereich === "nichtbefoerderung",
          },
          stepIds.checkin,
        ],
      },
    },
    [stepIds["vertretbare-gruende"]]: {
      on: {
        BACK: stepIds["checkin-nicht-befoerderung"],
        SUBMIT: [
          {
            target: stepIds.verjaehrung,
            guard: ({ context }) => context.vertretbareGruende === "no",
          },
          stepIds["vertretbare-gruende-info"],
        ],
      },
    },
    [stepIds["vertretbare-gruende-info"]]: {
      on: {
        BACK: stepIds["vertretbare-gruende"],
        SUBMIT: stepIds.verjaehrung,
      },
    },
    [stepIds.kostenlos]: {
      on: {
        BACK: [
          {
            target: stepIds.checkin,
            guard: ({ context }) => context.bereich === "verspaetet",
          },
          stepIds.fluggesellschaft,
        ],
        SUBMIT: [
          {
            target: stepIds["kostenlos-abbruch"],
            guard: ({ context }) => context.kostenlos === "yes",
          },
          stepIds.rabatt,
        ],
      },
    },
    [stepIds["kostenlos-abbruch"]]: {
      on: {
        BACK: stepIds.kostenlos,
      },
    },
    [stepIds.rabatt]: {
      on: {
        BACK: stepIds.kostenlos,
        SUBMIT: [
          {
            target: stepIds.buchung,
            guard: "rabattNo",
          },
          stepIds["rabatt-abbruch"],
        ],
      },
    },
    [stepIds["rabatt-abbruch"]]: {
      on: {
        BACK: stepIds.rabatt,
      },
    },
    [stepIds.buchung]: {
      on: {
        BACK: stepIds.rabatt,
        SUBMIT: [
          {
            target: stepIds.abtretung,
            guard: "buchungYes",
          },
          stepIds["buchung-abbruch"],
        ],
      },
    },
    [stepIds["buchung-abbruch"]]: {
      on: {
        BACK: stepIds.buchung,
      },
    },
    [stepIds.abtretung]: {
      on: {
        BACK: stepIds.buchung,
        SUBMIT: [
          {
            target: stepIds.entschaedigung,
            guard: "abtretungNo",
          },
          stepIds["abtretung-abbruch"],
        ],
      },
    },
    [stepIds["abtretung-abbruch"]]: {
      on: {
        BACK: stepIds.abtretung,
      },
    },
    [stepIds.entschaedigung]: {
      on: {
        BACK: stepIds.abtretung,
        SUBMIT: [
          {
            target: stepIds.gericht,
            guard: "entschaedigungYes",
          },
          stepIds["erfolg-kontakt"],
        ],
      },
    },
    [stepIds["erfolg-kontakt"]]: {
      on: {
        BACK: stepIds.entschaedigung,
      },
    },
    [stepIds.gericht]: {
      on: {
        BACK: stepIds.entschaedigung,
        SUBMIT: [
          {
            target: stepIds["erfolg-gericht"],
            guard: ({ context }) => context.gericht === "yes",
          },
          {
            target: stepIds["erfolg-eu"],
            guard: "isErfolgEU",
          },
          {
            target: stepIds["erfolg-analog"],
            guard: "isErfolgAnalogGuard",
          },
          stepIds.erfolg,
        ],
      },
    },
    [stepIds["erfolg-gericht"]]: {
      on: {
        BACK: stepIds.gericht,
      },
    },
    [stepIds.erfolg]: {
      on: {
        SUBMIT: stepIds["erfolg-per-post-klagen"],
        BACK: stepIds.gericht,
      },
    },
    [stepIds["erfolg-eu"]]: {
      on: {
        BACK: stepIds.gericht,
      },
    },
    [stepIds["erfolg-analog"]]: {
      on: {
        SUBMIT: stepIds["erfolg-per-post-klagen"],
        BACK: stepIds.gericht,
      },
    },
    [stepIds["erfolg-per-post-klagen"]]: {},
  },
} satisfies Config<FluggastrechtVorabcheckUserData>;
