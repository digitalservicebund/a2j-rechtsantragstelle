import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  createDateSchema,
  dateUTCFromGermanDateString,
  today,
} from "~/services/validation/date";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import { postcodeSchema } from "~/services/validation/postcode";

export const beratungshilfeAnwaltlicheVertretung = {
  anwaltskanzlei: YesNoAnswer,
  beratungStattgefunden: YesNoAnswer,
  beratungStattgefundenDatum: createDateSchema(),
  name: inputRequiredSchema,
  strasseUndHausnummer: inputRequiredSchema,
  plz: inputRequiredSchema.pipe(postcodeSchema),
  ort: inputRequiredSchema,
};

const contextObject = z.object(beratungshilfeAnwaltlicheVertretung).partial();
export type BeratungshilfeAnwaltlicheVertretung = z.infer<typeof contextObject>;

export const beratungshilfeAnwaltlicheVertretungGuards = {
  anwaltskanzleiNo: (context: BeratungshilfeAnwaltlicheVertretung) =>
    context.anwaltskanzlei === "no",
  beratungStattgefundenNo: (context: BeratungshilfeAnwaltlicheVertretung) =>
    context.beratungStattgefunden === "no",
  beratungStattgefundenDatumEarlierThanFourWeeks: (
    context: BeratungshilfeAnwaltlicheVertretung,
  ) => {
    if (context.beratungStattgefundenDatum === undefined) return false;
    const inputDateAsUTC = dateUTCFromGermanDateString(
      context.beratungStattgefundenDatum,
    );
    const differenceInDays =
      (today().getTime() - inputDateAsUTC.getTime()) / 1000 / 60 / 60 / 24; // ms to days
    return differenceInDays < 28;
  },
};

export const anwaltlicheVertretungDone = (
  context: BeratungshilfeAnwaltlicheVertretung,
) =>
  Boolean(
    context.anwaltskanzlei === "no" || context.beratungStattgefunden === "no",
  ) ||
  Boolean(
    context.beratungStattgefunden === "yes" &&
      context.beratungStattgefundenDatum &&
      context.name &&
      context.strasseUndHausnummer &&
      context.plz &&
      context.ort,
  );
