import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { getAbsaetzeBaseUrl } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { Absatz } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/Absatz";
import { MAX_ABSAETZE } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

export const AbsaetzeUebersicht = () => {
  const { userData, flowId } = useFormFlow();
  const userDataGeldEinklagenAnwaltschaft =
    userData as GeldEinklagenAnwaltschaftUserData;
  const hauptantragArrayIndex =
    userDataGeldEinklagenAnwaltschaft.pageData?.arrayIndexes?.[0];
  if (
    flowId !== "/geld-einklagen/anwaltschaft" ||
    hauptantragArrayIndex === undefined
  ) {
    return null;
  }
  const absaetze =
    userDataGeldEinklagenAnwaltschaft.hauptantrag?.[hauptantragArrayIndex]
      .absaetze;
  const nextAbsatzIndex = absaetze?.length ?? 0;
  const maxAbsaetzeReached = nextAbsatzIndex >= MAX_ABSAETZE;
  return (
    <ArrayItemListSection
      addButton={{
        href: `${getAbsaetzeBaseUrl(hauptantragArrayIndex)}/${nextAbsatzIndex}/daten`,
        buttonText: translations.geldEinklagenAnwaltschaft.addAbsatzButton.de,
        disabled: maxAbsaetzeReached,
      }}
    >
      {absaetze?.map((absatz, index) => (
        <Absatz
          // oxlint-disable-next-line react/no-array-index-key
          key={`hauptantrag-${hauptantragArrayIndex}-absatz-${index}`}
          absatz={absatz}
          index={index}
          hauptantragIndex={hauptantragArrayIndex}
        />
      ))}
    </ArrayItemListSection>
  );
};
