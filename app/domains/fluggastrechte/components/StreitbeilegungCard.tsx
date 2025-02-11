import type { Translations } from "~/services/translations/getTranslationByKey";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import type { FluggastrechtContext } from "../formular/context";
import { FLOW_ID } from "../services/summaryPage/getOverviewData";

const TITLE = "Außergerichtliche Streitbeilegung";

function getReasonsAgainstStreitbeilegung(
  userData: FluggastrechtContext,
): string {
  if (userData.streitbeilegungGruende === "no")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen keine Bedenken dagegen.";
  if (userData.streitbeilegungGruende === "yesAirlineAgainst")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen Bedenken, weil das bisherige Verhalten der Fluggesellschaft dagegen spricht.";
  if (userData.streitbeilegungGruende === "yesOtherReasons")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen Bedenken dagegen.";
  return "";
}
function StreitbeilegungCard({
  userData,
  translations,
}: {
  readonly userData: FluggastrechtContext;
  readonly translations: Translations;
}) {
  const isStreitbeilegung = userData.streitbeilegung === "yes";
  const buttonUrl = isStreitbeilegung
    ? `${FLOW_ID}/grundvoraussetzungen/streitbeilegung`
    : `${FLOW_ID}/grundvoraussetzungen/streitbeilegung-gruende`;

  const data = {
    streitbeilegung: isStreitbeilegung
      ? "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden."
      : getReasonsAgainstStreitbeilegung(userData),
  };
  return (
    <SummaryDataOverviewCard
      title={TITLE}
      showValueHeading={false}
      buttonUrl={buttonUrl}
      data={data}
      translations={translations}
    />
  );
}

export default StreitbeilegungCard;
