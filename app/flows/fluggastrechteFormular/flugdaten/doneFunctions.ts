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

const hasAnnullierungOrNichtBefoerderung: FluggastrechteFlugdatenGuard = ({
  context,
}) => {
  return (
    context.bereich === "annullierung" ||
    context.bereich === "nichtbefoerderung"
  );
};

const hasNoZwischenstoppAnnullierungOrNichtBefoerderungWithErsatzFlugDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl === "no" &&
      hasAnnullierungOrNichtBefoerderung({ context }) &&
      hasDefaultFlugdaten({ context }) &&
      hasErsatzFlug({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasNoZwischenstoppAnnullierungOrNichtBefoerderungWithOthersDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl === "no" &&
      hasAnnullierungOrNichtBefoerderung({ context }) &&
      hasDefaultFlugdaten({ context }) &&
      hasAndereErsatzverbindung({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasNoZwischenstoppAnnullierungOrNichtBefoerderungWithKeineAnkunftDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl === "no" &&
      hasDefaultFlugdaten({ context }) &&
      hasAnnullierungOrNichtBefoerderung({ context }) &&
      context.ersatzverbindungArt === "keineAnkunft" &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasNoZwischenstoppVerspaetungWithTatsaechlicherFlugYesAnkunftDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl === "no" &&
      hasDefaultFlugdaten({ context }) &&
      context.bereich === "verspaetet" &&
      hasTatsaechlicherFlug({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasNoZwischenstoppVerspaetungAndTatsaechlicherFlugNoWithErsatzFlugDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl === "no" &&
      context.bereich === "verspaetet" &&
      hasDefaultFlugdaten({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      hasErsatzFlug({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasNoZwischenstoppVerspaetungAndTatsaechlicherFlugNoWithOthersDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl === "no" &&
      context.bereich === "verspaetet" &&
      hasDefaultFlugdaten({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      hasAndereErsatzverbindung({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasNoZwischenstoppVerspaetungAndTatsaechlicherFlugNoWithKeineAnkunftDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl === "no" &&
      context.bereich === "verspaetet" &&
      hasDefaultFlugdaten({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      context.ersatzverbindungArt === "keineAnkunft" &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasZwischenstoppVerspaetungWithTatsaechlicherFlugYesAnkunftDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl !== "no" &&
      hasDefaultFlugdaten({ context }) &&
      context.bereich === "verspaetet" &&
      hasTatsaechlicherFlug({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasZwischenstoppVerspaetungWithTatsaechlicherFlugNoAndErsatzFlugDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl !== "no" &&
      hasDefaultFlugdaten({ context }) &&
      context.bereich === "verspaetet" &&
      context.tatsaechlicherFlug === "no" &&
      hasErsatzFlug({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasZwischenstoppVerspaetungWithTatsaechlicherFlugNoWithOthersFlugDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl !== "no" &&
      hasDefaultFlugdaten({ context }) &&
      context.bereich === "verspaetet" &&
      context.tatsaechlicherFlug === "no" &&
      hasAndereErsatzverbindung({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasZwischenstoppVerspaetungWithTatsaechlicherFlugNoAndKeineAnkunftDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl !== "no" &&
      hasDefaultFlugdaten({ context }) &&
      context.bereich === "verspaetet" &&
      context.tatsaechlicherFlug === "no" &&
      context.ersatzverbindungArt === "keineAnkunft" &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasZwischenstoppAnnullierungOrNichtBefoerderungWithTatsaechlicherFlugNoAndErsatzFlugDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl !== "no" &&
      hasDefaultFlugdaten({ context }) &&
      hasAnnullierungOrNichtBefoerderung({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      hasErsatzFlug({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasZwischenstoppAnnullierungOrNichtBefoerderungWithTatsaechlicherFlugNoWithOthersFlugDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl !== "no" &&
      hasDefaultFlugdaten({ context }) &&
      hasAnnullierungOrNichtBefoerderung({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      hasAndereErsatzverbindung({ context }) &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

const hasZwischenstoppAnnullierungOrNichtBefoerderungWithTatsaechlicherFlugNoAndKeinAnkunftDone: FluggastrechteFlugdatenGuard =
  ({ context }) => {
    return (
      context.zwischenstoppAnzahl !== "no" &&
      hasDefaultFlugdaten({ context }) &&
      hasAnnullierungOrNichtBefoerderung({ context }) &&
      context.tatsaechlicherFlug === "no" &&
      context.ersatzverbindungArt === "keineAnkunft" &&
      hasOptionalString(context.zusaetzlicheAngaben)
    );
  };

export const flugdatenDone: FluggastrechteFlugdatenGuard = ({ context }) => {
  return (
    hasNoZwischenstoppAnnullierungOrNichtBefoerderungWithErsatzFlugDone({
      context,
    }) ||
    hasNoZwischenstoppAnnullierungOrNichtBefoerderungWithOthersDone({
      context,
    }) ||
    hasNoZwischenstoppAnnullierungOrNichtBefoerderungWithKeineAnkunftDone({
      context,
    }) ||
    hasNoZwischenstoppVerspaetungWithTatsaechlicherFlugYesAnkunftDone({
      context,
    }) ||
    hasNoZwischenstoppVerspaetungAndTatsaechlicherFlugNoWithErsatzFlugDone({
      context,
    }) ||
    hasNoZwischenstoppVerspaetungAndTatsaechlicherFlugNoWithOthersDone({
      context,
    }) ||
    hasNoZwischenstoppVerspaetungAndTatsaechlicherFlugNoWithKeineAnkunftDone({
      context,
    }) ||
    hasZwischenstoppVerspaetungWithTatsaechlicherFlugYesAnkunftDone({
      context,
    }) ||
    hasZwischenstoppVerspaetungWithTatsaechlicherFlugNoAndErsatzFlugDone({
      context,
    }) ||
    hasZwischenstoppVerspaetungWithTatsaechlicherFlugNoWithOthersFlugDone({
      context,
    }) ||
    hasZwischenstoppVerspaetungWithTatsaechlicherFlugNoAndKeineAnkunftDone({
      context,
    }) ||
    hasZwischenstoppAnnullierungOrNichtBefoerderungWithTatsaechlicherFlugNoAndErsatzFlugDone(
      { context },
    ) ||
    hasZwischenstoppAnnullierungOrNichtBefoerderungWithTatsaechlicherFlugNoWithOthersFlugDone(
      { context },
    ) ||
    hasZwischenstoppAnnullierungOrNichtBefoerderungWithTatsaechlicherFlugNoAndKeinAnkunftDone(
      { context },
    )
  );
};
