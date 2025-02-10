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
const hasNichtbefoerderung: Guard = ({ context }) =>
  context.bereich === "nichtbefoerderung";
const _hasVerspaeteterFlugNonEndAirport: Guard = ({ context }) =>
  context.verspaeteterFlug === "startAirportFirstZwischenstopp" ||
  context.verspaeteterFlug === "firstAirportSecondZwischenstopp" ||
  context.verspaeteterFlug === "secondAirportThirdZwischenstopp";

const _hasAnnullierungWithErsatzflugNo: Guard = ({ context }) =>
  _hasAnnullierung({ context }) && context.ersatzflug === "no";

export const fluggastrechteFlugdatenGuards = {
  hasOneStop,
  hasTwoStop,
  hasThreeStop,
  hasOneStopWithNichtBefoerderung: ({ context }) =>
    hasOneStop({ context }) && hasNichtbefoerderung({ context }),
  hasTwoStopWithNichtBefoerderung: ({ context }) =>
    hasTwoStop({ context }) && hasNichtbefoerderung({ context }),
  hasThreeStopWithNichtBefoerderung: ({ context }) =>
    hasThreeStop({ context }) && hasNichtbefoerderung({ context }),
  hasOneStopWithAnnullierungWithErsatzflugNo: ({ context }) =>
    hasOneStop({ context }) && _hasAnnullierungWithErsatzflugNo({ context }),
  hasTwoStopWithAnnullierungWithErsatzflugNo: ({ context }) =>
    hasTwoStop({ context }) && _hasAnnullierungWithErsatzflugNo({ context }),
  hasThreeStopWithAnnullierungWithErsatzflugNo: ({ context }) =>
    hasThreeStop({ context }) && _hasAnnullierungWithErsatzflugNo({ context }),
  hasVerspaetung: ({ context }) => context.bereich === "verspaetet",
  hasAnnullierungWithErsatzflugYes: ({ context }) =>
    _hasAnnullierung({ context }) && context.ersatzflug === "yes",
  hasAnnullierungWithErsatzflugNo: ({ context }) =>
    _hasAnnullierungWithErsatzflugNo({ context }),
  hasNoZwischenstoppWithNichtBefoerderung: ({ context }) =>
    context.zwischenstoppAnzahl === "no" && hasNichtbefoerderung({ context }),
  hasNoZwischenstoppAndVerspaetung: ({ context }) =>
    context.zwischenstoppAnzahl === "no" && context.bereich === "verspaetet",
  hasNoZwischenstoppAndAnnullierungWithErsatzflugYes: ({ context }) =>
    context.zwischenstoppAnzahl === "no" &&
    _hasAnnullierung({ context }) &&
    context.ersatzflug === "yes",
  hasNoZwischenstoppAndAnnullierungWithErsatzflugNo: ({ context }) =>
    context.zwischenstoppAnzahl === "no" &&
    _hasAnnullierungWithErsatzflugNo({ context }),
  hasVerspaeteterFlugNonEndAirportAndAnnullierungWithErsatzflugNo: ({
    context,
  }) =>
    _hasVerspaeteterFlugNonEndAirport({ context }) &&
    _hasAnnullierungWithErsatzflugNo({ context }),
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
    hasNichtbefoerderung({ context }) &&
    _hasVerspaeteterFlugNonEndAirport({ context }),
  hasVerspaeteterFlugNonEndAirport: ({ context }) =>
    _hasVerspaeteterFlugNonEndAirport({ context }),
  ...yesNoGuards("tatsaechlicherFlug"),
  flugdatenDone,
} satisfies Guards<FluggastrechteFlugdatenContext>;
