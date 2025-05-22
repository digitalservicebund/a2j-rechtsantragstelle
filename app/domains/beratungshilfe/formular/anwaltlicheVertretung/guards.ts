import type { BeratungshilfeAnwaltlicheVertretungUserData } from "~/domains/beratungshilfe/formular/anwaltlicheVertretung/userData";
import type { GenericGuard, Guards } from "~/domains/guards.server";
import { dateUTCFromGermanDateString, today } from "~/util/date";

const anwaltskanzleiYes: GenericGuard<
  BeratungshilfeAnwaltlicheVertretungUserData
> = ({ context }) => context.anwaltskanzlei === "yes";

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
} satisfies Guards<BeratungshilfeAnwaltlicheVertretungUserData>;

export const anwaltlicheVertretungDone: GenericGuard<
  BeratungshilfeAnwaltlicheVertretungUserData
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
