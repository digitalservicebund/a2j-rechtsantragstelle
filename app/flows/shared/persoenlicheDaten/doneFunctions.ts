import type { GenericGuard } from "~/flows/guards.server";
import type { PersoenlicheDaten } from "~/flows/shared/persoenlicheDaten/context";

export const persoenlicheDatenDone: GenericGuard<PersoenlicheDaten> = ({
  context,
}) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum &&
      context.strasseHausnummer &&
      context.plz &&
      context.ort,
  );
