import { type BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";
import { calculateFreibetragBerHFormular } from "~/domains/beratungshilfe/vorabcheck/freibetrag";
import moneyToCents from "~/services/validation/money/moneyToCents";

const eigentumWorthEligibilityThreshhold = 10000;

export const isFinanciallyEligibleForBerH = (
  userData: BeratungshilfeFinanzielleAngabenUserData,
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
    userData.staatlicheLeistungen === "buergergeld" ||
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
      (acc, bankkonto) => acc + Number.parseInt(bankkonto.kontostand),
      0,
    ) ?? 0;

  const totalGeldanlagenWorth =
    userData.geldanlagen?.reduce((acc, geldanlage) => {
      if ("forderung" in geldanlage) {
        return acc + Number.parseInt(geldanlage.forderung ?? "0");
      }
      return acc + Number.parseInt(geldanlage.wert ?? "0");
    }, 0) ?? 0;

  const totalKraftfahrzeugeWorth =
    userData.kraftfahrzeuge?.reduce((acc, kraftfahrzeug) => {
      const verkaufswert =
        "verkaufswert" in kraftfahrzeug ? kraftfahrzeug.verkaufswert : "0";
      // Kraftfahrzeuge that are used for commuting are not counted
      return kraftfahrzeug.hasArbeitsweg === "yes"
        ? acc
        : acc + Number.parseInt(verkaufswert);
    }, 0) ?? 0;

  const totalWertgegendstaendeWorth =
    userData.wertsachen?.reduce(
      (acc, wertsache) => acc + Number.parseInt(wertsache.wert ?? "0"),
      0,
    ) ?? 0;

  const totalGrundeigentumWorth =
    userData.grundeigentum?.reduce(
      (acc, grundeigentum) =>
        acc + Number.parseInt(grundeigentum.verkaufswert ?? "0"),
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
  userData: BeratungshilfeFinanzielleAngabenUserData,
) {
  const einkommen = moneyToCents(userData.einkommen) ?? 0;
  const miete =
    moneyToCents(
      userData.apartmentCostOwnShare ?? userData.apartmentCostAlone,
    ) ?? 0;
  const ausgaben =
    moneyToCents(
      userData.ausgaben
        ?.reduce(
          (acc, ausgabe) => acc + Number.parseInt(ausgabe.beitrag ?? "0"),
          0,
        )
        .toString(),
    ) ?? 0;
  const unterhalt =
    moneyToCents(
      (
        userData.unterhaltszahlungen?.reduce(
          (acc, zahlung) =>
            acc + Number.parseInt(zahlung.monthlyPayment ?? "0"),
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
