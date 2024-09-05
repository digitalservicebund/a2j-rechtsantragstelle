import type { GenericGuard } from "~/flows/guards.server";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { finanzielleAngabeEinkuenfteGuards as guards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>;

export const staatlicheLeistungenDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) =>
    guards.hasGrundsicherungOrAsylbewerberleistungen({ context }) ||
    context.staatlicheLeistungen === "keine" ||
    (guards.hasBuergergeld({ context }) && context.buergergeld !== undefined) ||
    (guards.hasArbeitslosengeld({ context }) &&
      context.arbeitslosengeld !== undefined);

export const arbeitsabzuegeDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) => {
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
    if (guards.usesPrivateVehicle({ context }) && !arbeitsplatzDone)
      return false;
    return !guards.hasAndereArbeitsausgabenAndEmptyArray({ context });
  };

export const einkommenDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) => {
    const employeeIncomeComplete =
      context.nettoEinkuenfteAlsArbeitnehmer !== undefined;
    const selfEmploymentIncomeComplete = objectKeysNonEmpty(context, [
      "selbststaendigMonatlichesEinkommen",
      "selbststaendigBruttoNetto",
      "selbststaendigAbzuege",
    ]);
    switch (context.employmentType) {
      case "employedAndSelfEmployed":
        return employeeIncomeComplete && selfEmploymentIncomeComplete;
      case "selfEmployed":
        return selfEmploymentIncomeComplete;
      default:
        return employeeIncomeComplete;
    }
  };

export const leistungenDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) => {
    if (guards.hasWohngeld({ context }) && context.wohngeldAmount === undefined)
      return false;
    if (
      guards.hasKrankengeld({ context }) &&
      context.krankengeldAmount === undefined
    )
      return false;
    if (
      guards.hasElterngeld({ context }) &&
      context.elterngeldAmount === undefined
    )
      return false;
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (
      guards.hasKindergeld({ context }) &&
      context.kindergeldAmount === undefined
    )
      return false;
    return true;
  };

export const arbeitDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) =>
    guards.notEmployed({ context }) ||
    (einkommenDone({ context }) && arbeitsabzuegeDone({ context }));

export const pensionDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) => {
    if (context.receivesPension === undefined) return false;
    return guards.receivesPension({ context })
      ? context.pensionAmount !== undefined
      : true;
  };

export const supportDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) => {
    if (context.receivesSupport === undefined) return false;
    return guards.receivesSupport({ context })
      ? context.supportAmount !== undefined
      : true;
  };

export const furtherIncomeDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) => {
    return (
      context.hasFurtherIncome !== undefined &&
      !guards.hasFurtherIncomeAndEmptyArray({ context })
    );
  };

export const einkuenfteDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) =>
    guards.hasGrundsicherungOrAsylbewerberleistungen({ context }) ||
    (staatlicheLeistungenDone({ context }) &&
      arbeitDone({ context }) &&
      pensionDone({ context }) &&
      supportDone({ context }) &&
      leistungenDone({ context }) &&
      furtherIncomeDone({ context }));
