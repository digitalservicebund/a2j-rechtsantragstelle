import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  createDateSchema,
  dateUTCFromGermanDateString,
  today,
} from "~/services/validation/date";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import { postcodeSchema } from "~/services/validation/postcode";
import type { GenericGuard, Guards } from "../../guards.server";

export const beratungshilfeAnwaltlicheVertretung = {
  anwaltskanzlei: YesNoAnswer,
  beratungStattgefunden: YesNoAnswer,
  beratungStattgefundenDatum: createDateSchema(),
  anwaltName: inputRequiredSchema,
  anwaltStrasseUndHausnummer: inputRequiredSchema,
  anwaltPlz: inputRequiredSchema.pipe(postcodeSchema),
  anwaltOrt: inputRequiredSchema,
};

const contextObject = z.object(beratungshilfeAnwaltlicheVertretung).partial();
export type BeratungshilfeAnwaltlicheVertretung = z.infer<typeof contextObject>;

export const beratungshilfeAnwaltlicheVertretungGuards = {
  anwaltskanzleiNo: ({ context }) => context.anwaltskanzlei === "no",
  beratungStattgefundenNo: ({ context }) =>
    context.beratungStattgefunden === "no",
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
