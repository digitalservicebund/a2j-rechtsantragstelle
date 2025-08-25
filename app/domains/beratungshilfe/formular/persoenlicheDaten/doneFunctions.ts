import type { BeratungshilfePersoenlicheDatenUserData } from "~/domains/beratungshilfe/formular/persoenlicheDaten/userData";
import { hasOptionalString, type GenericGuard } from "~/domains/guards.server";

export const beratungshilfePersoenlicheDatenDone: GenericGuard<
  BeratungshilfePersoenlicheDatenUserData
> = ({ context }) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum &&
      context.street &&
      context.houseNumber &&
      context.plz &&
      context.ort,
  ) && hasOptionalString(context.telefonnummer);
