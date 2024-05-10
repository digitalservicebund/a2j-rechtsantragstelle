import { z } from "zod";
import { namePrivatPerson, adresse } from "../../persoenlicheDaten/context";
import { addYears, createDateSchema, today } from "~/services/validation/date";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import type { GenericGuard } from "../../guards.server";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";

export const beratungshilfePersoenlicheDaten = {
  ...namePrivatPerson,
  geburtsdatum: createDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }),
  ...adresse,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
};

const contextObject = z.object(beratungshilfePersoenlicheDaten).partial();
export type BeratungshilfePersoenlicheDaten = z.infer<typeof contextObject>;

export const beratungshilfePersoenlicheDatenDone: GenericGuard<
  BeratungshilfePersoenlicheDaten
> = ({ context }) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum &&
      context.strasseHausnummer &&
      context.plz &&
      context.ort,
  );
