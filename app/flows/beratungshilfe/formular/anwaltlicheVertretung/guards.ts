import type { BeratungshilfeAnwaltlicheVertretung } from "~/flows/beratungshilfe/formular/anwaltlicheVertretung/context";
import type { GenericGuard, Guards } from "~/flows/guards.server";
import { dateUTCFromGermanDateString, today } from "~/util/date";

const anwaltskanzleiYes: GenericGuard<BeratungshilfeAnwaltlicheVertretung> = ({
  context,
}) => context.anwaltskanzlei === "yes";

export const beratungshilfeAnwaltlicheVertretungGuards = {
  anwaltskanzleiYes,
  beratungStattgefundenYes: ({ context }) =>
    anwaltskanzleiYes({ context }) && context.beratungStattgefunden === "yes",
  beratungStattgefundenDatumLaterThanFourWeeks: ({ context }) => {
    if (typeof context.beratungStattgefundenDatum !== "string") return false;
    const inputDateAsUTC = dateUTCFromGermanDateString(
      context.beratungStattgefundenDatum,
    );
    const differenceInDays =
      (today().getTime() - inputDateAsUTC.getTime()) / 1000 / 60 / 60 / 24; // ms to days

    const FOUR_WEEKS_IN_DAYS = 28;
    return differenceInDays > FOUR_WEEKS_IN_DAYS;
  },
} satisfies Guards<BeratungshilfeAnwaltlicheVertretung>;

export const anwaltlicheVertretungDone: GenericGuard<
  BeratungshilfeAnwaltlicheVertretung
> = ({ context }) =>
  Boolean(
    context.anwaltskanzlei === "no" || context.beratungStattgefunden === "no",
  ) ||
  Boolean(
    context.beratungStattgefunden === "yes" &&
      context.beratungStattgefundenDatum &&
      context.anwaltName &&
      context.anwaltStrasseUndHausnummer &&
      context.anwaltPlz &&
      context.anwaltOrt,
  );
