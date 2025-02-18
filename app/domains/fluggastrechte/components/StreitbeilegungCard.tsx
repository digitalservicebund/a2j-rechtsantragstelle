import type { Translations } from "~/services/translations/getTranslationByKey";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import type { FluggastrechtContext } from "../formular/context";
import { FLOW_ID } from "../services/summaryPage/getOverviewData";

const TITLE = "Außergerichtliche Streitbeilegung";

function getReasonsAgainstStreitbeilegung(
  streitbeilegungGruende: FluggastrechtContext["streitbeilegungGruende"],
): string {
  if (streitbeilegungGruende === "yes")
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.";
  return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.";
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
