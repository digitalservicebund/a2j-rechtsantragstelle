import type { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteFlugdatenContext } from "./context";

export type FluggastrechteFlugdatenGuard =
  GenericGuard<FluggastrechteFlugdatenContext>;

const hasZwischenStoppData: FluggastrechteFlugdatenGuard = ({ context }) => {
  switch (context.zwischenstoppAnzahl) {
    case "no": {
      return true;
    }
    case "oneStop": {
      return objectKeysNonEmpty(context, [
        "ersterZwischenstopp",
        "verspaeteterFlug",
      ]);
    }

    case "twoStop": {
      return objectKeysNonEmpty(context, [
        "ersterZwischenstopp",
        "zweiterZwischenstopp",
        "verspaeteterFlug",
      ]);
    }

    case "threeStop": {
      return objectKeysNonEmpty(context, [
        "ersterZwischenstopp",
        "zweiterZwischenstopp",
        "dritterZwischenstopp",
        "verspaeteterFlug",
      ]);
    }

    default: {
      return false;
    }
  }
};

function hasOptionalString(value: string | undefined): boolean {
  return typeof value === "string";
}

const hasDefaultFlugdaten: FluggastrechteFlugdatenGuard = ({ context }) => {
  return objectKeysNonEmpty(context, [
    "direktFlugnummer",
    "buchungsNummer",
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
      "tatsaechlicherAnkunftsDatum",
      "tatsaechlicherAnkunftsZeit",
    ])
  );
};

const hasErsatzFlugDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    hasZwischenStoppData({ context }) &&
    hasErsatzFlug({ context }) &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasOthersDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    hasZwischenStoppData({ context }) &&
    hasAndereErsatzverbindung({ context }) &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasKeineAnkunftDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    hasZwischenStoppData({ context }) &&
    context.ersatzverbindungArt === "keineAnkunft" &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasTatsaechlicherFlugYesAnkunftDone: FluggastrechteFlugdatenGuard = ({
  context,
}) => {
  return (
    hasDefaultFlugdaten({ context }) &&
    hasZwischenStoppData({ context }) &&
    hasTatsaechlicherFlug({ context }) &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasTatsaechlicherFlugNoWithErsatzFlugDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      hasDefaultFlugdaten({ context }) &&
      hasZwischenStoppData({ context }) &&
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
    hasZwischenStoppData({ context }) &&
    context.tatsaechlicherFlug === "no" &&
    hasAndereErsatzverbindung({ context }) &&
    hasOptionalString(context.zusaetzlicheAngaben)
  );
};

const hasTatsaechlicherFlugNoWithKeineAnkunftDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      hasDefaultFlugdaten({ context }) &&
      hasZwischenStoppData({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      context.ersatzverbindungArt === "keineAnkunft" &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

export const flugdatenDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  const doneCases: Record<string, FluggastrechteFlugdatenGuard[]> = {
    verspaetet: [
      hasTatsaechlicherFlugYesAnkunftDone,
      hasTatsaechlicherFlugNoWithErsatzFlugDone,
      hasTatsaechlicherFlugNoWithOthersDone,
      hasTatsaechlicherFlugNoWithKeineAnkunftDone,
    ],
    annullierung: [hasErsatzFlugDone, hasOthersDone, hasKeineAnkunftDone],
    nichtbefoerderung: [hasErsatzFlugDone, hasOthersDone, hasKeineAnkunftDone],
  };

  const doneIdentifier = [context.bereich].join("");

  const donePaths = doneCases[doneIdentifier] || [];

  return donePaths.some((callbackFn) => callbackFn({ context }));
};
