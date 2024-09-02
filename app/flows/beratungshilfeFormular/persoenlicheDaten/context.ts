import { z } from "zod";
import {
  adresseSchema,
  namePrivatPerson,
} from "~/flows/shared/persoenlicheDaten/context";
import { createDateSchema } from "~/services/validation/date";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { addYears, today } from "~/util/date";
import type { GenericGuard } from "../../guards.server";

export const beratungshilfePersoenlicheDaten = {
  ...namePrivatPerson,
  geburtsdatum: createDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }),
  ...adresseSchema,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
};

const _contextObject = z.object(beratungshilfePersoenlicheDaten).partial();
export type BeratungshilfePersoenlicheDaten = z.infer<typeof _contextObject>;

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
