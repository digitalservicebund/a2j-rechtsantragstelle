import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { eigentumTotalWorthLessThan10000 } from "~/domains/beratungshilfe/formular/finanzielleAngaben/guards";
import { type GenericGuard } from "~/domains/guards.server";

export const isFinanciallyEligibleForBerH: GenericGuard<
  BeratungshilfeFormularUserData
> = ({ context }) => {
  const hasQualifyingStaatlicheLeistung =
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "grundsicherung";
  return (
    hasQualifyingStaatlicheLeistung ||
    eigentumTotalWorthLessThan10000({ context })
  );
};
