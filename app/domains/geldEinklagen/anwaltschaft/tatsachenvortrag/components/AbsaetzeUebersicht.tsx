import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { getAbsaetzeBaseUrl } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { Absatz } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/Absatz";
import { AbsaetzeContext } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeContext";
import { MAX_ABSAETZE } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";
import { useMemo } from "react";

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

  const nextAbsatzIndex = absaetze?.length ?? 0;
  const maxAbsaetzeReached = nextAbsatzIndex >= MAX_ABSAETZE;
  const absaetzeBaseUrl = getAbsaetzeBaseUrl(
    hauptantragArrayIndex,
    isNebenantrag ? nebenantragArrayIndex : undefined,
  );

  const absaetzeContextValue = useMemo(
    () => ({
      isNebenantrag,
      hauptantragArrayIndex,
      nebenantragArrayIndex,
      absaetzeBaseUrl,
      absaetzeArrayName: `hauptantrag${isNebenantrag ? "#nebenantrag" : ""}#absaetze`,
    }),
    [
      isNebenantrag,
      hauptantragArrayIndex,
      nebenantragArrayIndex,
      absaetzeBaseUrl,
    ],
  );

  return (
    <AbsaetzeContext.Provider value={absaetzeContextValue}>
      <ArrayItemListSection
        addButton={{
          href: `${absaetzeBaseUrl}/${nextAbsatzIndex}/daten`,
          buttonText: translations.geldEinklagenAnwaltschaft.addAbsatzButton.de,
          disabled: maxAbsaetzeReached,
          additionalContent: maxAbsaetzeReached && (
            <InlineNotice
              title={
                translations.geldEinklagenAnwaltschaft.absatzInlineNoticeTitle
                  .de
              }
              tagName={"p"}
              look={"info"}
              content={
                translations.geldEinklagenAnwaltschaft.absatzInlineNoticeContent
                  .de
              }
              className="text-wrap"
            />
          ),
        }}
      >
        {absaetze?.map((absatz, index) => (
          <Absatz
            // oxlint-disable-next-line react/no-array-index-key
            key={`absatz-${index}`}
            absatz={absatz}
            index={index}
          />
        ))}
      </ArrayItemListSection>
    </AbsaetzeContext.Provider>
  );
};
