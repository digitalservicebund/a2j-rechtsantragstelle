import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { airlineSchema } from "~/services/validation/airline";
import { airportSchema } from "~/services/validation/airport";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const fluggastBereichSchema = z.enum([
  "nichtbefoerderung",
  "verspaetet",
  "annullierung",
  "anderes",
]);

export const ankuendigungSchema = z.enum([
  "no",
  "until6Days",
  "between7And13Days",
  "moreThan13Days",
]);

export const fluggastrechteVorabcheckPages = {
  start: {
    stepId: "start",
  },
  bereich: {
    stepId: "bereich",
    pageSchema: {
      bereich: fluggastBereichSchema,
    },
  },
  verspaetung: {
    stepId: "verspaetung",
    pageSchema: { verspaetung: YesNoAnswer },
  },
  ausgleich: {
    stepId: "ausgleich",
    pageSchema: { ausgleich: YesNoAnswer },
  },
  gruende: {
    stepId: "gruende",
    pageSchema: { gruende: YesNoAnswer },
  },
  ankuendigung: {
    stepId: "ankuendigung",
    pageSchema: {
      ankuendigung: ankuendigungSchema,
    },
  },
  ersatzflug: {
    stepId: "ersatzflug",
    pageSchema: { ersatzflug: YesNoAnswer },
  },
  ausgleichAngenommen: {
    stepId: "ausgleich-angenommen",
    pageSchema: { ausgleichAngenommen: YesNoAnswer },
  },
  "ausgleich-angenommen-info": {
    stepId: "ausgleich-angenommen-info",
  },
  "gruende-hinweis": {
    stepId: "gruende-hinweis",
  },
  verjaehrung: {
    stepId: "verjaehrung",
    pageSchema: { verjaehrung: YesNoAnswer },
  },
  "vertretbare-gruende-annullierung": {
    stepId: "vertretbare-gruende-annullierung",
    pageSchema: { vertretbareGruendeAnnullierung: YesNoAnswer },
  },
  flughaefen: {
    stepId: "flughaefen",
    pageSchema: { startAirport: airportSchema, endAirport: airportSchema },
  },
  fluggesellschaft: {
    stepId: "fluggesellschaft",
    pageSchema: { fluggesellschaft: airlineSchema },
  },
  checkin: {
    stepId: "checkin",
    pageSchema: { checkin: YesNoAnswer },
  },
  "checkin-nicht-befoerderung": {
    stepId: "checkin-nicht-befoerderung",
    pageSchema: { checkin: YesNoAnswer },
  },
  "vertretbare-gruende": {
    stepId: "vertretbare-gruende",
    pageSchema: { vertretbareGruende: YesNoAnswer },
  },
  "vertretbare-gruende-info": {
    stepId: "vertretbare-gruende-info",
  },
  kostenlos: {
    stepId: "kostenlos",
    pageSchema: { kostenlos: YesNoAnswer },
  },
  rabatt: {
    stepId: "rabatt",
    pageSchema: { rabatt: YesNoAnswer },
  },
  buchung: {
    stepId: "buchung",
    pageSchema: { buchung: YesNoAnswer },
  },
  abtretung: {
    stepId: "abtretung",
    pageSchema: { abtretung: YesNoAnswer },
  },
  entschaedigung: {
    stepId: "entschaedigung",
    pageSchema: { entschaedigung: YesNoAnswer },
  },
  gericht: {
    stepId: "gericht",
    pageSchema: { gericht: YesNoAnswer },
  },
  "ersatzflug-starten-eine-stunde": {
    stepId: "ersatzflug-starten-eine-stunde",
    pageSchema: { ersatzflugStartenEinStunde: YesNoAnswer },
  },
  "ersatzflug-starten-zwei-stunden": {
    stepId: "ersatzflug-starten-zwei-stunden",
    pageSchema: { ersatzflugStartenZweiStunden: YesNoAnswer },
  },
  "ersatzflug-landen-zwei-stunden": {
    stepId: "ersatzflug-landen-zwei-stunden",
    pageSchema: { ersatzflugLandenZweiStunden: YesNoAnswer },
  },
  "ersatzflug-landen-vier-stunden": {
    stepId: "ersatzflug-landen-vier-stunden",
    pageSchema: { ersatzflugLandenVierStunden: YesNoAnswer },
  },
  "bereich-abbruch": {
    stepId: "ergebnis/bereich-abbruch",
  },
  "verspaetung-abbruch": {
    stepId: "ergebnis/verspaetung-abbruch",
  },
  "checkin-abbruch": {
    stepId: "ergebnis/checkin-abbruch",
  },
  "erfolg-kontakt": {
    stepId: "ergebnis/erfolg-kontakt",
  },
  "kostenlos-abbruch": {
    stepId: "ergebnis/kostenlos-abbruch",
  },
  "rabatt-abbruch": {
    stepId: "ergebnis/rabatt-abbruch",
  },
  "buchung-abbruch": {
    stepId: "ergebnis/buchung-abbruch",
  },
  erfolg: {
    stepId: "ergebnis/erfolg",
  },
  "flughaefen-abbruch": {
    stepId: "ergebnis/flughaefen-abbruch",
  },
  "abtretung-abbruch": {
    stepId: "ergebnis/abtretung-abbruch",
  },
  "fluggesellschaft-abbruch": {
    stepId: "ergebnis/fluggesellschaft-abbruch",
  },
  "flughaefen-entfernung-abbruch": {
    stepId: "ergebnis/flughaefen-entfernung-abbruch",
  },
  "verjaehrung-abbruch": {
    stepId: "ergebnis/verjaehrung-abbruch",
  },
  "erfolg-gericht": {
    stepId: "ergebnis/erfolg-gericht",
  },
  "ankuendigung-abbruch": {
    stepId: "ergebnis/ankuendigung-abbruch",
  },
  "ersatzflug-starten-eine-landen-zwei-abbruch": {
    stepId: "ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch",
  },
  "ersatzflug-starten-zwei-landen-vier-abbruch": {
    stepId: "ergebnis/ersatzflug-starten-zwei-landen-vier-abbruch",
  },
  "fluggesellschaft-nicht-eu-abbruch": {
    stepId: "ergebnis/fluggesellschaft-nicht-eu-abbruch",
  },
  "erfolg-eu": {
    stepId: "ergebnis/erfolg-eu",
  },
  "fluggesellschaft-abbruch-eu": {
    stepId: "ergebnis/fluggesellschaft-abbruch-eu",
  },
  "erfolg-analog": {
    stepId: "ergebnis/erfolg-analog",
  },
  "erfolg-per-post-klagen": {
    stepId: "ergebnis/erfolg-per-post-klagen",
  },
} as const satisfies PagesConfig;
