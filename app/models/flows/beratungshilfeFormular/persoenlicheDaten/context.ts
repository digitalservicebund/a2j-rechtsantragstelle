import { z } from "zod";
import { namePrivatPerson, adresse } from "../../persoenlicheDaten/context";
import { createDateSchema } from "~/services/validation/date";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import type { GenericGuard } from "../../guards.server";

export const beratungshilfePersoenlicheDaten = {
  ...namePrivatPerson,
  geburtsdatum: createDateSchema(),
  ...adresse,
  telefonnummer: phoneNumberSchema.or(z.string().max(0)), //either optional or proper phone number
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
