import type { BeratungshilfeAnwaltlicheVertretungUserData } from "~/domains/beratungshilfe/formular/anwaltlicheVertretung/userData";
import type { GenericGuard, Guards } from "~/domains/guards.server";
import { toDateString } from "~/services/validation/date";
import { dateUTCFromGermanDateString, today } from "~/util/date";

const anwaltskanzleiYes: GenericGuard<
  BeratungshilfeAnwaltlicheVertretungUserData
> = ({ context }) => context.anwaltskanzlei === "yes";

export const beratungshilfeAnwaltlicheVertretungGuards = {
  anwaltskanzleiYes,
  beratungStattgefundenYes: ({ context }) =>
    anwaltskanzleiYes({ context }) && context.beratungStattgefunden === "yes",
  beratungStattgefundenDatumLaterThanFourWeeks: ({ context }) => {
    const value = context.beratungStattgefundenDatum;
    if (!value) return false;

    let dateString: string | undefined;
    if (typeof value === "string") {
      dateString = value;
    } else if (
      typeof value === "object" &&
      "day" in value &&
      "month" in value &&
      "year" in value
    ) {
      const { day, month, year } = value as {
        day: string | number;
        month: string | number;
        year: string | number;
      };
      dateString = toDateString(
        Number(day),
        Number(month),
        typeof year === "string" ? Number(year) : year,
      );
    }

    if (!dateString) return false;

    const inputDateAsUTC = dateUTCFromGermanDateString(dateString);
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
