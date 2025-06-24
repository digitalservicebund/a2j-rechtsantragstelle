import type { GenericGuard } from "~/domains/guards.server";
import { finanzielleAngabeEinkuenfteGuards as guards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/userData";
import { staatlicheLeistungenIsBuergergeld } from "~/domains/shared/formular/finanzielleAngaben/guards";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData>;

export const staatlicheLeistungenDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) =>
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "grundsicherung" ||
    context.staatlicheLeistungen === "keine" ||
    (staatlicheLeistungenIsBuergergeld({ context }) &&
      context.buergergeld !== undefined) ||
    (guards.staatlicheLeistungenIsArbeitslosengeld({ context }) &&
      context.arbeitslosengeld !== undefined);

export const arbeitsabzuegeDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) => {
    if (guards.incomeWithBuergergeld({ context })) return true;
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
    return (
      context.hasArbeitsausgaben !== undefined &&
      !guards.hasAndereArbeitsausgabenAndEmptyArray({ context })
    );
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
      case "employed":
      case undefined:
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

export const furtherIncomeDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) => {
    return (
      context.hasFurtherIncome !== undefined &&
      !guards.hasFurtherIncomeAndEmptyArray({ context })
    );
  };

export const einkuenfteDone: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard =
  ({ context }) =>
    (context.staatlicheLeistungen != undefined &&
      guards.hasGrundsicherungOrAsylbewerberleistungen({
        context,
      })) ||
    (staatlicheLeistungenDone({ context }) &&
      arbeitDone({ context }) &&
      pensionDone({ context }) &&
      leistungenDone({ context }) &&
      furtherIncomeDone({ context }));
