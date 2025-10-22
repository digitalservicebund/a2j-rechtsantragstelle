import type { GenericGuard } from "~/domains/guards.server";
import { finanzielleAngabeAbzuegeGuards as guards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/guards";
import { type ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const abzuegeDone: GenericGuard<
  ProzesskostenhilfeFinanzielleAngabenUserData
> = ({ context }) => {
  if (context.currentlyEmployed === "no") return true;
  if (context.arbeitsweg === undefined) return false;

  const arbeitsplatzDone =
    objectKeysNonEmpty(context.arbeitsplatz, [
      "strasseHausnummer",
      "plz",
      "ort",
    ]) && context.arbeitsplatzEntfernung !== undefined;
  if (
    guards.usesPublicTransit({ context }) &&
    (context.monatlicheOPNVKosten === undefined || !arbeitsplatzDone)
  )
    return false;
  if (guards.usesPrivateVehicle({ context }) && !arbeitsplatzDone) return false;
  return (
    context.hasArbeitsausgaben !== undefined &&
    !guards.hasAndereArbeitsausgabenAndEmptyArray({ context })
  );
};
