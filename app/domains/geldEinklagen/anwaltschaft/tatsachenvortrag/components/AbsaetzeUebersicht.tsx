import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { getAbsaetzeBaseUrl } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { getOrderedAbsaetze } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/beweisOrdering";
import { Absatz } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/Absatz";
import {
  AbsaetzeContext,
  absaetzeFocusKey,
  saveAbsaetzeFocusInSession,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeContext";
import { MAX_ABSAETZE } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";
import { useEffect, useMemo } from "react";

export const AbsaetzeUebersicht = () => {
  const { userData, flowId } = useFormFlow();
  const userDataGeldEinklagenAnwaltschaft =
    userData as GeldEinklagenAnwaltschaftUserData;
  const vortragArrayIndex =
    userDataGeldEinklagenAnwaltschaft.pageData?.arrayIndexes?.[0];
  const absaetzeBaseUrl =
    vortragArrayIndex === undefined
      ? ""
      : getAbsaetzeBaseUrl(vortragArrayIndex);
  const absaetzeContextValue = useMemo(
    () => ({ absaetzeBaseUrl, absaetzeArrayName: "vortraege#absaetze" }),
    [absaetzeBaseUrl],
  );
  useEffect(() => {
    if (!absaetzeBaseUrl) return;

    const key = absaetzeFocusKey(absaetzeBaseUrl);
    const target = sessionStorage.getItem(key);
    if (!target) return;

    const timer = setTimeout(() => {
      sessionStorage.removeItem(key);
      const [targetId, fallbackId] = target.split("|");
      (
        document.getElementById(targetId) ?? document.getElementById(fallbackId)
      )?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [absaetzeBaseUrl]);
  if (
    flowId !== "/geld-einklagen/anwaltschaft" ||
    vortragArrayIndex === undefined
  ) {
    return null;
  }
  const absaetze = getOrderedAbsaetze(userDataGeldEinklagenAnwaltschaft).filter(
    (absatz) => absatz.vortragArrayIndex === vortragArrayIndex,
  );

  const nextAbsatzIndex = absaetze.length;
  const maxAbsaetzeReached = nextAbsatzIndex >= MAX_ABSAETZE;
  return (
    <AbsaetzeContext.Provider value={absaetzeContextValue}>
      <ArrayItemListSection
        addButton={{
          href: `${absaetzeBaseUrl}/${nextAbsatzIndex}/daten`,
          buttonText: translations.geldEinklagenAnwaltschaft.addAbsatzButton.de,
          disabled: maxAbsaetzeReached,
          onClick: () =>
            saveAbsaetzeFocusInSession(
              absaetzeBaseUrl,
              `absatz-${nextAbsatzIndex}`,
            ),
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
        {absaetze.map(({ absatz, absatzArrayIndex, beweise }) => (
          <Absatz
            key={`absatz-${absatzArrayIndex}`}
            absatz={absatz}
            index={absatzArrayIndex}
            beweise={beweise}
          />
        ))}
      </ArrayItemListSection>
    </AbsaetzeContext.Provider>
  );
};
