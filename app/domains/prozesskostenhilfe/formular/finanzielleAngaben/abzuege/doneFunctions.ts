import type { GenericGuard } from "~/domains/guards.server";
import { finanzielleAngabeAbzuegeGuards as guards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/guards";
import type { ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type ProzesskostenhilfeFinanzielleAngabenAbzuegeGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData>;

export const abzuegeDone: ProzesskostenhilfeFinanzielleAngabenAbzuegeGuard = ({
  context,
}) => {
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
