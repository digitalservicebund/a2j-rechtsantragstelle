import type { GenericGuard } from "~/flows/guards.server";
import type { ProzesskostenhilfePersoenlicheDaten } from "./context";

export const prozesskostenhilfePersoenlicheDatenDone: GenericGuard<
  ProzesskostenhilfePersoenlicheDaten
> = ({ context }) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum &&
      context.strasseHausnummer &&
      context.plz &&
      context.ort &&
      context.beruf,
  );
