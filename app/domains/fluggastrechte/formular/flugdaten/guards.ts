import {
  type GenericGuard,
  type Guards,
  yesNoGuards,
} from "~/domains/guards.server";
import type { FluggastrechteFlugdatenContext } from "./context";
import { flugdatenDone } from "./doneFunctions";

type Guard = GenericGuard<FluggastrechteFlugdatenContext>;

const hasOneStop: Guard = ({ context }) =>
  context.zwischenstoppAnzahl === "oneStop";
const hasTwoStop: Guard = ({ context }) =>
  context.zwischenstoppAnzahl === "twoStop";
const hasThreeStop: Guard = ({ context }) =>
  context.zwischenstoppAnzahl === "threeStop";
const _hasAnnullierung: Guard = ({ context }) =>
  context.bereich === "annullierung";
const _hasNichtbefoerderung: Guard = ({ context }) =>
  context.bereich === "nichtbefoerderung";

export const fluggastrechteFlugdatenGuards = {
  hasOneStop,
  hasTwoStop,
  hasThreeStop,
  hasOneStopWithNichtBefoerderung: ({ context }) =>
    hasOneStop({ context }) && _hasNichtbefoerderung({ context }),
  hasTwoStopWithNichtBefoerderung: ({ context }) =>
    hasTwoStop({ context }) && _hasNichtbefoerderung({ context }),
  hasThreeStopWithNichtBefoerderung: ({ context }) =>
    hasThreeStop({ context }) && _hasNichtbefoerderung({ context }),
  hasVerspaetung: ({ context }) => context.bereich === "verspaetet",
  hasAnnullierung: ({ context }) => _hasAnnullierung({ context }),
  hasNoZwischenstoppWithNichtBefoerderung: ({ context }) =>
    context.zwischenstoppAnzahl === "no" && _hasNichtbefoerderung({ context }),
  hasNoZwischenstoppAndVerspaetung: ({ context }) =>
    context.zwischenstoppAnzahl === "no" && context.bereich === "verspaetet",
  hasNoZwischenstoppAndAnnullierung: ({ context }) =>
    context.zwischenstoppAnzahl === "no" && _hasAnnullierung({ context }),
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
  hasVerspaeteterFlugStartAirportFirstZwischenstopp: ({ context }) =>
    context.verspaeteterFlug === "startAirportFirstZwischenstopp",
  hasVerspaeteterFlugFirstAirportSecondZwischenstopp: ({ context }) =>
    context.verspaeteterFlug === "firstAirportSecondZwischenstopp",
  hasVerspaeteterFlugSecondAirportThirdZwischenstopp: ({ context }) =>
    context.verspaeteterFlug === "secondAirportThirdZwischenstopp",
  hasBereichNichtBefoerderungAndVerspaeteterFlugNonEndAirport: ({ context }) =>
    _hasNichtbefoerderung({ context }) &&
    (context.verspaeteterFlug === "startAirportFirstZwischenstopp" ||
      context.verspaeteterFlug === "firstAirportSecondZwischenstopp" ||
      context.verspaeteterFlug === "secondAirportThirdZwischenstopp"),
  hasVerspaeteterFlugNonEndAirport: ({ context }) =>
    context.verspaeteterFlug === "startAirportFirstZwischenstopp" ||
    context.verspaeteterFlug === "firstAirportSecondZwischenstopp" ||
    context.verspaeteterFlug === "secondAirportThirdZwischenstopp",
  ...yesNoGuards("tatsaechlicherFlug"),
  flugdatenDone,
} satisfies Guards<FluggastrechteFlugdatenContext>;
