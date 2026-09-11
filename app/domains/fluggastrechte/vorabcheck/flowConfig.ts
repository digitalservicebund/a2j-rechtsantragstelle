import { fluggastrechteVorabcheckPages } from "~/domains/fluggastrechte/vorabcheck/pages";
import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { guards } from "./guards";

const fluggastrechteVorabcheckPagesWithLeadingSlash =
  addLeadingSlashToPageSchemas(fluggastrechteVorabcheckPages);

export const fluggastrechteVorabcheckFlowConfig = compileFlow({
  pages: fluggastrechteVorabcheckPagesWithLeadingSlash,
  initialStep: "start",
  transitions: {
    start: "bereich",
    bereich: [
      {
        target: "verspaetung",
        guard: ({ bereich }) => bereich === "verspaetet",
      },
      {
        target: "ausgleich",
        guard: ({ bereich }) => bereich === "nichtbefoerderung",
      },
      {
        target: "ankuendigung",
        guard: ({ bereich }) => bereich === "annullierung",
      },
      { target: "bereich-abbruch" },
    ],
    "bereich-abbruch": "bereich",
    verspaetung: [
      {
        target: "gruende",
        guard: ({ verspaetung }) => verspaetung === "yes",
      },
      { target: "verspaetung-abbruch" },
    ],
    ausgleich: [
      {
        target: "ausgleichAngenommen",
        guard: ({ ausgleich }) => ausgleich === "yes",
      },
      { target: "checkin-nicht-befoerderung" },
    ],
    ankuendigung: [
      {
        target: "ankuendigung-abbruch",
        guard: ({ ankuendigung }) => ankuendigung === "moreThan13Days",
      },
      { target: "ersatzflug" },
    ],
    "vertretbare-gruende-annullierung": [
      {
        target: "gruende-hinweis",
        guard: ({ vertretbareGruendeAnnullierung }) =>
          vertretbareGruendeAnnullierung === "yes",
      },
      { target: "verjaehrung" },
    ],
    ersatzflug: [
      {
        target: "vertretbare-gruende-annullierung",
        guard: ({ ersatzflug }) => ersatzflug === "no",
      },
      {
        target: "ersatzflug-starten-eine-stunde",
        guard: (context) =>
          guards.isErsatzflugYesAndAnkuendigungUntil6DaysOrNo({ context }),
      },
      { target: "ersatzflug-starten-zwei-stunden" },
    ],
    "ersatzflug-starten-eine-stunde": "ersatzflug-landen-zwei-stunden",
    "ersatzflug-landen-zwei-stunden": [
      {
        target: "ersatzflug-starten-eine-landen-zwei-abbruch",
        guard: ({ ersatzflugLandenZweiStunden, ersatzflugStartenEinStunde }) =>
          ersatzflugLandenZweiStunden === "no" &&
          ersatzflugStartenEinStunde === "no",
      },
      { target: "vertretbare-gruende-annullierung" },
    ],
    "ersatzflug-starten-zwei-stunden": "ersatzflug-landen-vier-stunden",
    "ersatzflug-landen-vier-stunden": [
      {
        target: "ersatzflug-starten-zwei-landen-vier-abbruch",
        guard: ({
          ersatzflugLandenVierStunden,
          ersatzflugStartenZweiStunden,
        }) =>
          ersatzflugLandenVierStunden === "no" &&
          ersatzflugStartenZweiStunden === "no",
      },
      { target: "vertretbare-gruende-annullierung" },
    ],
    ausgleichAngenommen: [
      {
        target: "ausgleich-angenommen-info",
        guard: ({ ausgleichAngenommen }) => ausgleichAngenommen === "yes",
      },
      { target: "checkin-nicht-befoerderung" },
    ],
    "ausgleich-angenommen-info": "checkin-nicht-befoerderung",
    "ersatzflug-starten-eine-landen-zwei-abbruch": null,
    "ersatzflug-starten-zwei-landen-vier-abbruch": null,
    gruende: [
      {
        target: "verjaehrung",
        guard: ({ gruende }) => gruende === "no",
      },
      { target: "gruende-hinweis" },
    ],
    "gruende-hinweis": "verjaehrung",
    verjaehrung: [
      {
        target: "verjaehrung-abbruch",
        guard: ({ verjaehrung }) => verjaehrung === "no",
      },
      { target: "flughaefen" },
    ],
    "verjaehrung-abbruch": null,
    "ankuendigung-abbruch": null,
    flughaefen: [
      {
        target: "flughaefen-entfernung-abbruch",
        guard: (context) => guards.isInvalidAirportDistance({ context }),
      },
      {
        target: "flughaefen-abbruch",
        guard: (context) => guards.areAirportsOutsideEU({ context }),
      },
      { target: "fluggesellschaft" },
    ],
    "flughaefen-abbruch": null,
    "flughaefen-entfernung-abbruch": null,
    fluggesellschaft: [
      {
        target: "fluggesellschaft-nicht-eu-abbruch",
        guard: (context) =>
          guards.isNonGermanAirportsAndIsNotClaimableInEU({ context }),
      },
      {
        target: "fluggesellschaft-nicht-eu-abbruch",
        guard: (context) =>
          guards.isGermanEndAirportsAndIsNotClaimable({ context }),
      },
      {
        target: "fluggesellschaft-abbruch",
        guard: (context) =>
          guards.isGermanEndAirportsAndOtherAirline({ context }),
      },
      {
        target: "fluggesellschaft-abbruch-eu",
        guard: (context) =>
          guards.isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline({
            context,
          }),
      },
      {
        target: "checkin",
        guard: ({ bereich }) => bereich === "verspaetet",
      },
      { target: "kostenlos" },
    ],
    "fluggesellschaft-abbruch": null,
    "fluggesellschaft-nicht-eu-abbruch": null,
    "fluggesellschaft-abbruch-eu": null,
    "verspaetung-abbruch": null,
    checkin: [
      {
        target: "kostenlos",
        guard: ({ checkin }) => checkin === "yes",
      },
      { target: "checkin-abbruch" },
    ],
    "checkin-nicht-befoerderung": [
      {
        target: "vertretbare-gruende",
        guard: ({ checkin }) => checkin === "yes",
      },
      { target: "checkin-abbruch" },
    ],
    "checkin-abbruch": null,
    "vertretbare-gruende": [
      {
        target: "verjaehrung",
        guard: ({ vertretbareGruende }) => vertretbareGruende === "no",
      },
      { target: "vertretbare-gruende-info" },
    ],
    "vertretbare-gruende-info": "verjaehrung",
    kostenlos: [
      {
        target: "kostenlos-abbruch",
        guard: ({ kostenlos }) => kostenlos === "yes",
      },
      { target: "rabatt" },
    ],
    "kostenlos-abbruch": null,
    rabatt: [
      {
        target: "buchung",
        guard: ({ rabatt }) => rabatt === "no",
      },
      { target: "rabatt-abbruch" },
    ],
    "rabatt-abbruch": null,
    buchung: [
      {
        target: "abtretung",
        guard: ({ buchung }) => buchung === "yes",
      },
      { target: "buchung-abbruch" },
    ],
    "buchung-abbruch": null,
    abtretung: [
      {
        target: "entschaedigung",
        guard: ({ abtretung }) => abtretung === "no",
      },
      { target: "abtretung-abbruch" },
    ],
    "abtretung-abbruch": null,
    entschaedigung: [
      {
        target: "gericht",
        guard: ({ entschaedigung }) => entschaedigung === "yes",
      },
      { target: "erfolg-kontakt" },
    ],
    "erfolg-kontakt": null,
    gericht: [
      {
        target: "erfolg-gericht",
        guard: ({ gericht }) => gericht === "yes",
      },
      {
        target: "erfolg-eu",
        guard: (context) => guards.isErfolgEU({ context }),
      },
      {
        target: "erfolg-analog",
        guard: (context) => guards.isErfolgAnalogGuard({ context }),
      },
      { target: "erfolg" },
    ],
    "erfolg-gericht": null,
    erfolg: "erfolg-per-post-klagen",
    "erfolg-eu": null,
    "erfolg-analog": "erfolg-per-post-klagen",
    "erfolg-per-post-klagen": null,
  },
}) as CompiledFlow<PageConfigMap>;
