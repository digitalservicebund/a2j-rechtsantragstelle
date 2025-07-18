import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { type GenericGuard } from "~/domains/guards.server";

const eigentumWorthEligibilityThreshhold = 10000;

export const isFinanciallyEligibleForBerH: GenericGuard<
  BeratungshilfeFormularUserData
> = ({ context }) => {
  const hasQualifyingStaatlicheLeistung =
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "grundsicherung";
  const totalEigentumWorth = calculateEigentumTotalWorth(context);
  return (
    hasQualifyingStaatlicheLeistung ||
    totalEigentumWorth < eigentumWorthEligibilityThreshhold ||
    !context.kraftfahrzeuge?.some(
      (kraftfahrzeug) =>
        kraftfahrzeug.hasArbeitsweg === "no" &&
        kraftfahrzeug.wert === "over10000",
    )
  );
};

function calculateEigentumTotalWorth(userData: BeratungshilfeFormularUserData) {
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
