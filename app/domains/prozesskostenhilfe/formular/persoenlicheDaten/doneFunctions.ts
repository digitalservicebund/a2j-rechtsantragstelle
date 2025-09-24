import { hasOptionalString, type GenericGuard } from "~/domains/guards.server";
import type { ProzesskostenhilfePersoenlicheDatenUserData } from "./userData";

export const prozesskostenhilfePersoenlicheDatenDone: GenericGuard<
  ProzesskostenhilfePersoenlicheDatenUserData
> = ({ context }) =>
  Boolean(
    context.vorname &&
      context.nachname &&
      context.geburtsdatum?.geburtsdatumTag &&
      context.geburtsdatum?.geburtsdatumMonat &&
      context.geburtsdatum?.geburtsdatumJahr &&
      context.street &&
      context.houseNumber &&
      context.plz &&
      context.ort &&
      context.beruf,
  ) && hasOptionalString(context.telefonnummer);
