import { hasOptionalString, type GenericGuard } from "~/domains/guards.server";
import type { ProzesskostenhilfePersoenlicheDatenUserData } from "./userData";

export const prozesskostenhilfePersoenlicheDatenDone: GenericGuard<
  ProzesskostenhilfePersoenlicheDatenUserData
> = ({ context }) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum?.tag &&
      context.geburtsdatum?.monat &&
      context.geburtsdatum?.jahr &&
      context.street &&
      context.houseNumber &&
      context.plz &&
      context.ort &&
      context.beruf,
  ) && hasOptionalString(context.telefonnummer);
