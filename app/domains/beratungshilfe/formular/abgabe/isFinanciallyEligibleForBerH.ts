import { type BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";
import { calculateFreibetragBerHFormular } from "~/domains/beratungshilfe/vorabcheck/freibetrag";
import { staatlicheLeistungenIsBuergergeld } from "~/domains/shared/formular/finanzielleAngaben/guards";
import moneyToCents from "~/services/validation/money/moneyToCents";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "../finanzielleAngaben/einkommen/userData";

const eigentumWorthEligibilityThreshhold = 10000;

export const isFinanciallyEligibleForBerH = (
  userData: BeratungshilfeFinanzielleAngabenUserData &
    BeratungshilfeFinanzielleAngabenEinkommenUserData,
) => {
  const hasQualifyingStaatlicheLeistung =
    userData.staatlicheLeistungen === "asylbewerberleistungen" ||
    userData.staatlicheLeistungen === "grundsicherung";
  const totalEigentumWorth = calculateEigentumTotalWorth(userData);
  const hasExpensiveFahrzeug = (userData.kraftfahrzeuge ?? []).some(
    (kraftfahrzeug) =>
      kraftfahrzeug.hasArbeitsweg === "no" &&
      kraftfahrzeug.wert === "over10000",
  );
  const noEinzusetzendesEinkommen =
    staatlicheLeistungenIsBuergergeld({ context: userData }) ||
    !hasEinzusetzendesEinkommen(userData);
  return (
    hasQualifyingStaatlicheLeistung ||
    (noEinzusetzendesEinkommen &&
      totalEigentumWorth < eigentumWorthEligibilityThreshhold &&
      !hasExpensiveFahrzeug)
  );
};

function calculateEigentumTotalWorth(
  userData: BeratungshilfeFinanzielleAngabenUserData,
) {
  const totalBankkontenWorth =
    userData.bankkonten?.reduce(
      (acc, bankkonto) => acc + parseInt(bankkonto.kontostand),
      0,
    ) ?? 0;

  const totalGeldanlagenWorth =
    userData.geldanlagen?.reduce((acc, geldanlage) => {
      if (geldanlage.art === "forderung") {
        return acc + parseInt(geldanlage.forderung ?? "0");
      }
      return acc + parseInt(geldanlage.wert ?? "0");
    }, 0) ?? 0;

  const totalKraftfahrzeugeWorth =
    userData.kraftfahrzeuge?.reduce((acc, kraftfahrzeug) => {
      // Kraftfahrzeuge that are used for commuting are not counted
      return kraftfahrzeug.hasArbeitsweg === "yes"
        ? acc
        : acc + parseInt(kraftfahrzeug.verkaufswert ?? "0");
    }, 0) ?? 0;

  const totalWertgegendstaendeWorth =
    userData.wertsachen?.reduce(
      (acc, wertsache) => acc + parseInt(wertsache.wert ?? "0"),
      0,
    ) ?? 0;

  const totalGrundeigentumWorth =
    userData.grundeigentum?.reduce(
      (acc, grundeigentum) => acc + parseInt(grundeigentum.verkaufswert ?? "0"),
      0,
    ) ?? 0;

  return (
    totalBankkontenWorth +
    totalGeldanlagenWorth +
    totalKraftfahrzeugeWorth +
    totalWertgegendstaendeWorth +
    totalGrundeigentumWorth
  );
}

function hasEinzusetzendesEinkommen(
  userData: BeratungshilfeFinanzielleAngabenUserData &
    BeratungshilfeFinanzielleAngabenEinkommenUserData,
) {
  const einkommen = moneyToCents(userData.einkommen) ?? 0;
  const miete =
    moneyToCents(
      userData.apartmentCostOwnShare ?? userData.apartmentCostAlone,
    ) ?? 0;
  const ausgaben =
    moneyToCents(
      userData.ausgaben
        ?.reduce((acc, ausgabe) => acc + parseInt(ausgabe.beitrag ?? "0"), 0)
        .toString(),
    ) ?? 0;
  const unterhalt =
    moneyToCents(
      (
        userData.unterhaltszahlungen?.reduce(
          (acc, zahlung) => acc + parseInt(zahlung.monthlyPayment ?? "0"),
          0,
        ) ?? 0
      ).toString(),
    ) ?? 0;
  return (
    einkommen - miete - ausgaben - unterhalt >
    calculateFreibetragBerHFormular({
      working: userData.erwerbstaetig === "yes",
      partnership: userData.partnerschaft === "yes",
      partnerIncome: moneyToCents(userData.partnerEinkommenSumme),
      kinder: userData.kinder ?? [],
    })
  );
}
