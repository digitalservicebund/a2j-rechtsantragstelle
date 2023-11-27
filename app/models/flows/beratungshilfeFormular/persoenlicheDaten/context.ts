import { z } from "zod";
import { namePrivatPerson, adresse } from "../../persoenlicheDaten/context";
import { dateSchema } from "~/services/validation/date";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";

export const beratungshilfePersoenlicheDaten = {
  ...namePrivatPerson,
  geburtsdatum: dateSchema,
  ...adresse,
  telefonnummer: phoneNumberSchema.or(z.string().max(0)), //either optional or proper phone number
};

const contextObject = z.object(beratungshilfePersoenlicheDaten).partial();
export type BeratungshilfePersoenlicheDaten = z.infer<typeof contextObject>;

export const beratungshilfePersoenlicheDatenDone = (
  context: BeratungshilfePersoenlicheDaten,
) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum &&
      context.strasseHausnummer &&
      context.plz &&
      context.ort,
  );
