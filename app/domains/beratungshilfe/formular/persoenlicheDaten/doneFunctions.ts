import type { BeratungshilfePersoenlicheDaten } from "~/domains/beratungshilfe/formular/persoenlicheDaten/context";
import type { GenericGuard } from "~/domains/guards.server";

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
