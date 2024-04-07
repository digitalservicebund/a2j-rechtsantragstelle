import { dateUTCFromGermanDateString, today } from "~/services/validation/date";
import type { GenericGuard, Guards } from "~/models/flows/guards.server";
import type { BeratungshilfeAnwaltlicheVertretung } from "~/models/flows/beratungshilfeFormular/anwaltlicheVertretung/context";

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
    return differenceInDays > 28;
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
