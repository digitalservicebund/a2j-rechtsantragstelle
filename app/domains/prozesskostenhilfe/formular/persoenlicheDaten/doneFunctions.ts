import { hasOptionalString, type GenericGuard } from "~/domains/guards.server";
import type { ProzesskostenhilfePersoenlicheDatenUserData } from "./userData";

export const prozesskostenhilfePersoenlicheDatenDone: GenericGuard<
  ProzesskostenhilfePersoenlicheDatenUserData
> = ({ context }) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum?.day &&
      context.geburtsdatum?.month &&
      context.geburtsdatum?.year &&
      context.street &&
      context.houseNumber &&
      context.plz &&
      context.ort &&
      context.beruf,
  ) && hasOptionalString(context.telefonnummer);
