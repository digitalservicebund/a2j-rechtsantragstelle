import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { getAbsaetzeBaseUrl } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { Absatz } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/Absatz";
import { MAX_ABSAETZE } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

export const AbsaetzeUebersicht = ({
  isNebenantrag = false,
}: {
  isNebenantrag?: boolean;
}) => {
  const { userData, flowId } = useFormFlow();
  const userDataGeldEinklagenAnwaltschaft =
    userData as GeldEinklagenAnwaltschaftUserData;
  const hauptantragArrayIndex =
    userDataGeldEinklagenAnwaltschaft.pageData?.arrayIndexes?.[0];
  const nebenantragArrayIndex =
    userDataGeldEinklagenAnwaltschaft.pageData?.arrayIndexes?.[1];
  if (
    flowId !== "/geld-einklagen/anwaltschaft" ||
    hauptantragArrayIndex === undefined ||
    (isNebenantrag && nebenantragArrayIndex === undefined)
  ) {
    return null;
  }
  const absaetze = isNebenantrag
    ? userDataGeldEinklagenAnwaltschaft.hauptantrag?.[hauptantragArrayIndex]
        .nebenantrag?.[nebenantragArrayIndex!].absaetze
    : userDataGeldEinklagenAnwaltschaft.hauptantrag?.[hauptantragArrayIndex]
        .absaetze;

  const getAbsatzKey = (index: number) =>
    `hauptantrag-${hauptantragArrayIndex}${isNebenantrag ? `-nebenantrag-${nebenantragArrayIndex}` : ""}-absatz-${index}`;
  const nextAbsatzIndex = absaetze?.length ?? 0;
  const maxAbsaetzeReached = nextAbsatzIndex >= MAX_ABSAETZE;
  return (
    <ArrayItemListSection
      addButton={{
        href: `${getAbsaetzeBaseUrl(hauptantragArrayIndex, isNebenantrag ? nebenantragArrayIndex : undefined)}/${nextAbsatzIndex}/daten`,
        buttonText: translations.geldEinklagenAnwaltschaft.addAbsatzButton.de,
        disabled: maxAbsaetzeReached,
      }}
    >
      {absaetze?.map((absatz, index) => (
        <Absatz
          key={getAbsatzKey(index)}
          absatz={absatz}
          index={index}
          hauptantragIndex={hauptantragArrayIndex}
        />
      ))}
    </ArrayItemListSection>
  );
};
