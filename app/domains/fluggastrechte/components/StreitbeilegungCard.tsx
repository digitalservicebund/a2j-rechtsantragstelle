import type { Translations } from "~/services/translations/getTranslationByKey";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import type { FluggastrechtContext } from "../formular/context";
import { FLOW_ID } from "../services/summaryPage/getOverviewData";

const TITLE = "Außergerichtliche Streitbeilegung";

function getReasonsAgainstStreitbeilegung(
  userData: FluggastrechtContext,
): string | undefined {
  if (userData.streitbeilegungGruende === "no")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen keine Bedenken dagegen.";
  if (userData.streitbeilegungGruende === "yesAirlineAgainst")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen Bedenken, weil das bisherige Verhalten der Fluggesellschaft dagegen spricht.";
  if (userData.streitbeilegungGruende === "yesOtherReasons")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden und es bestehen Bedenken dagegen.";
  return undefined;
}
function StreitbeilegungCard({
  userData,
  translations,
}: {
  readonly userData: FluggastrechtContext;
  readonly translations: Translations;
}) {
  if (userData.streitbeilegung === "yes") {
    return (
      <SummaryDataOverviewCard
        title={TITLE}
        showValueHeading={false}
        buttonUrl={`${FLOW_ID}/flugdaten/ersatzverbindung-daten`}
        data={{
          streitbeilegung:
            "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.",
        }}
        translations={translations}
      />
    );
  }
  return (
    <SummaryDataOverviewCard
      title={TITLE}
      showValueHeading={false}
      buttonUrl={`${FLOW_ID}/grundvoraussetzungen/streitbeilegung-gruende`}
      data={{
        streitbeilegung: getReasonsAgainstStreitbeilegung(userData),
      }}
      translations={translations}
    />
  );
}

export default StreitbeilegungCard;
