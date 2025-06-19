import type { BeratungshilfePersoenlicheDatenUserData } from "~/domains/beratungshilfe/formular/persoenlicheDaten/userData";
import type { GenericGuard } from "~/domains/guards.server";
import { hasOptionalString } from "~/domains/guards.server";

export const beratungshilfePersoenlicheDatenDone: GenericGuard<
  BeratungshilfePersoenlicheDatenUserData
> = ({ context }) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum &&
      context.strasseHausnummer &&
      context.plz &&
      context.ort &&
      hasOptionalString(context.telefonnummer),
  );
