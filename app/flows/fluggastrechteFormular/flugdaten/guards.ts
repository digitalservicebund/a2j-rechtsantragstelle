import {
  type GenericGuard,
  type Guards,
  yesNoGuards,
} from "~/flows/guards.server";
import type { FluggastrechteFlugdatenContext } from "./context";

type Guard = GenericGuard<FluggastrechteFlugdatenContext>;

const hasOneStop: Guard = ({ context }) =>
  context.zwischenstoppAnzahl === "oneStop";
const hasTwoStop: Guard = ({ context }) =>
  context.zwischenstoppAnzahl === "twoStop";
const hasThreeStop: Guard = ({ context }) =>
  context.zwischenstoppAnzahl === "threeStop";
const hasFourStop: Guard = ({ context }) =>
  context.zwischenstoppAnzahl === "fourStop";
const hasFiveStop: Guard = ({ context }) =>
  context.zwischenstoppAnzahl === "fiveStop";
const hasAnnullierungOrNichtBefoerderung: Guard = ({ context }) =>
  context.bereich === "annullierung" || context.bereich === "nichtbefoerderung";

export const fluggastrechteFlugdatenGuards = {
  hasOneStop,
  hasTwoStop,
  hasThreeStop,
  hasFourStop,
  hasFiveStop,
  hasOneStopWithAnnullierungOrNichtBefoerderung: ({ context }) =>
    hasOneStop({ context }) && hasAnnullierungOrNichtBefoerderung({ context }),
  hasTwoStopWithAnnullierungOrNichtBefoerderung: ({ context }) =>
    hasTwoStop({ context }) && hasAnnullierungOrNichtBefoerderung({ context }),
  hasThreeStopWithAnnullierungOrNichtBefoerderung: ({ context }) =>
    hasThreeStop({ context }) &&
    hasAnnullierungOrNichtBefoerderung({ context }),
  hasFourStopWithAnnullierungOrNichtBefoerderung: ({ context }) =>
    hasFourStop({ context }) && hasAnnullierungOrNichtBefoerderung({ context }),
  hasFiveStopWithAnnullierungOrNichtBefoerderung: ({ context }) =>
    hasFiveStop({ context }) && hasAnnullierungOrNichtBefoerderung({ context }),
  hasZwischenstoppAndVerspaetung: ({ context }) =>
    context.zwischenstoppAnzahl !== "no" && context.bereich === "verspaetet",
  hasNoZwischenstoppNoAnnullierungOrNoNichtBefoerderung: ({ context }) =>
    context.zwischenstoppAnzahl === "no" &&
    hasAnnullierungOrNichtBefoerderung({ context }),
  hasNoZwischenstoppAndVerspaetung: ({ context }) =>
    context.zwischenstoppAnzahl === "no" && context.bereich === "verspaetet",
  hasErsatzVerbindungFlug: ({ context }) =>
    context.ersatzverbindungArt === "flug",
  hasDetailedErsatzVerbindungFlug: ({ context }) =>
    Boolean(
      context.ersatzverbindungArt === "flug" &&
        context.ersatzFlugnummer &&
        context.ersatzFlugAnkunftsDatum &&
        context.ersatzFlugAnkunftsZeit,
    ),
  hasAndereErsatzVerbindung: ({ context }) =>
    context.ersatzverbindungArt === "etwasAnderes",
  hasDetailedTatsaechlicherFlugAnkunft: ({ context }) =>
    Boolean(
      context.tatsaechlicherFlug === "yes" &&
        context.tatsaechlicherAnkunftsDatum &&
        context.tatsaechlicherAnkunftsZeit,
    ),
  hasKeineErsatzVerbindung: ({ context }) =>
    context.tatsaechlicherFlug === "no" &&
    context.ersatzverbindungArt === "keineAnkunft",
  ...yesNoGuards("tatsaechlicherFlug"),
} satisfies Guards<FluggastrechteFlugdatenContext>;
