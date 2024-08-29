import type { GenericGuard } from "~/flows/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteFlugdatenContext } from "./context";

export type FluggastrechteFlugdatenGuard =
  GenericGuard<FluggastrechteFlugdatenContext>;

function hasOptionalString(value: string | undefined): boolean {
  return typeof value === "string";
}

const hasDefaultFlugdaten: FluggastrechteFlugdatenGuard = ({ context }) => {
  return objectKeysNonEmpty(context, [
    "direktFlugnummer",
    "direktAbflugsDatum",
    "direktAbflugsZeit",
    "direktAnkunftsDatum",
    "direktAnkunftsZeit",
    "zwischenstoppAnzahl",
  ]);
};

const hasErsatzFlug: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    context.ersatzverbindungArt === "flug" &&
    objectKeysNonEmpty(context, [
      "ersatzFlugnummer",
      "ersatzFlugAnkunftsDatum",
      "ersatzFlugAnkunftsZeit",
    ])
  );
};

const hasAndereErsatzverbindung: FluggastrechteFlugdatenGuard = ({
  context,
}) => {
  return (
    context.ersatzverbindungArt === "etwasAnderes" &&
    objectKeysNonEmpty(context, [
      "andereErsatzverbindungBeschreibung",
      "andereErsatzverbindungStartDatum",
      "andereErsatzverbindungStartZeit",
      "andereErsatzverbindungAnkunftsDatum",
      "andereErsatzverbindungAnkunftsZeit",
    ])
  );
};

const hasTatsaechlicherFlug: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    context.tatsaechlicherFlug === "yes" &&
    objectKeysNonEmpty(context, [
      "tatsaechlicherFlug",
      "tatsaechlicherAnkunftsZeit",
    ])
  );
};

const hasErsatzFlugDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    hasErsatzFlug({ context }) &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasOthersDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    hasAndereErsatzverbindung({ context }) &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasKeineAnkunftDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    context.ersatzverbindungArt === "keineAnkunft" &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasTatsaechlicherFlugYesAnkunftDone: FluggastrechteFlugdatenGuard = ({
  context,
}) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    hasTatsaechlicherFlug({ context }) &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasTatsaechlicherFlugNoWithErsatzFlugDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      hasDefaultFlugdaten({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      hasErsatzFlug({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasTatsaechlicherFlugNoWithOthersDone: FluggastrechteFlugdatenGuard = ({
  context,
}) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    context.tatsaechlicherFlug === "no" &&
    hasAndereErsatzverbindung({ context }) &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasTatsaechlicherFlugNoWithKeineAnkunftDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      hasDefaultFlugdaten({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      context.ersatzverbindungArt === "keineAnkunft" &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

export const flugdatenDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  const doneCases: Record<string, FluggastrechteFlugdatenGuard[]> = {
    verspaetetWithZwischenstopp: [
      hasTatsaechlicherFlugYesAnkunftDone,
      hasTatsaechlicherFlugNoWithErsatzFlugDone,
      hasTatsaechlicherFlugNoWithOthersDone,
      hasTatsaechlicherFlugNoWithKeineAnkunftDone,
    ],
    verspaetetWithoutZwischenstopp: [
      hasTatsaechlicherFlugYesAnkunftDone,
      hasTatsaechlicherFlugNoWithErsatzFlugDone,
      hasTatsaechlicherFlugNoWithOthersDone,
      hasTatsaechlicherFlugNoWithKeineAnkunftDone,
    ],
    annullierungWithZwischenstopp: [
      hasTatsaechlicherFlugNoWithErsatzFlugDone,
      hasTatsaechlicherFlugNoWithOthersDone,
      hasTatsaechlicherFlugNoWithKeineAnkunftDone,
    ],
    annullierungWithoutZwischenstopp: [
      hasErsatzFlugDone,
      hasOthersDone,
      hasKeineAnkunftDone,
    ],
    nichtbefoerderungWithZwischenstopp: [
      hasTatsaechlicherFlugNoWithErsatzFlugDone,
      hasTatsaechlicherFlugNoWithOthersDone,
      hasTatsaechlicherFlugNoWithKeineAnkunftDone,
    ],
    nichtbefoerderungWithoutZwischenstopp: [
      hasErsatzFlugDone,
      hasOthersDone,
      hasKeineAnkunftDone,
    ],
    anderesWithZwischenstopp: [], // placeholder
    anderesWithoutZwischenstopp: [],
  };

  const doneIdentifier = [
    context.bereich,
    context.zwischenstoppAnzahl !== "no"
      ? "WithZwischenstopp"
      : "WithoutZwischenstopp",
  ].join("");

  const donePaths = doneCases[doneIdentifier] || [];

  return donePaths.some((callbackFn) => callbackFn({ context }));
};
