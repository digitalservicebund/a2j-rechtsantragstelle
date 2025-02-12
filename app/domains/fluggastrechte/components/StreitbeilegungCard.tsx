import type { Translations } from "~/services/translations/getTranslationByKey";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import type { FluggastrechtContext } from "../formular/context";
import { FLOW_ID } from "../services/summaryPage/getOverviewData";

const TITLE = "Außergerichtliche Streitbeilegung";

function getReasonsAgainstStreitbeilegung(
  streitbeilegungGruende: FluggastrechtContext["streitbeilegungGruende"],
): string {
  if (streitbeilegungGruende === "no")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen keine Bedenken dagegen.";
  if (streitbeilegungGruende === "yesAirlineAgainst")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen Bedenken, weil das bisherige Verhalten der Fluggesellschaft dagegen spricht.";
  if (streitbeilegungGruende === "yesOtherReasons")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen Bedenken dagegen.";
  return "";
}
type StreitbeilegungCardProps = {
  readonly userData: FluggastrechtContext;
  readonly translations: Translations;
};

function StreitbeilegungCard({
  userData: { streitbeilegung, streitbeilegungGruende },
  translations,
}: StreitbeilegungCardProps) {
  const isStreitbeilegung = streitbeilegung === "yes";
  const buttonUrl = isStreitbeilegung
    ? `${FLOW_ID}/grundvoraussetzungen/streitbeilegung`
    : `${FLOW_ID}/grundvoraussetzungen/streitbeilegung-gruende`;

  const data = {
    streitbeilegung: isStreitbeilegung
      ? "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden."
      : getReasonsAgainstStreitbeilegung(streitbeilegungGruende),
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
