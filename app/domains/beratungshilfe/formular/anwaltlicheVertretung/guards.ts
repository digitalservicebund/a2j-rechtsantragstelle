import type { BeratungshilfeAnwaltlicheVertretungUserData } from "./userData";
import type { Guards } from "~/domains/guards.server";
import { toDateString } from "~/services/validation/date";
import { dateUTCFromGermanDateString, today } from "~/util/date";

export const beratungshilfeAnwaltlicheVertretungGuards = {
  anwaltskanzleiYes: ({ context }) => context.anwaltskanzlei === "yes",
  beratungStattgefundenYes: ({ context }) =>
    context.beratungStattgefunden === "yes",
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
