import { type Guards, yesNoGuards } from "~/flows/guards.server";
import type { FluggastrechteFlugdatenContext } from "./context";

export const fluggastrechteFlugdatenGuards = {
  hasErsatzVerbindungFlug: ({ context }) =>
    context.ersatzverbindungArt === "flug",
  hasDetailedErsatzVerbindungFlug: ({ context }) =>
    Boolean(
      context.tatsaechlicherFlug === "no" &&
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
