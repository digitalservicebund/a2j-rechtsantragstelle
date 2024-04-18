import { z } from "zod";
import { namePrivatPerson, adresse } from "../../persoenlicheDaten/context";
import { createDateSchema } from "~/services/validation/date";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import type { GenericGuard } from "../../guards.server";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";

export const beratungshilfePersoenlicheDaten = {
  ...namePrivatPerson,
  geburtsdatum: createDateSchema(),
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
