import { type GenericGuard } from "~/domains/guards.server";
import type { ProzesskostenhilfePersoenlicheDatenUserData } from "./userData";

export const prozesskostenhilfePersoenlicheDatenDone: GenericGuard<
  ProzesskostenhilfePersoenlicheDatenUserData
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
