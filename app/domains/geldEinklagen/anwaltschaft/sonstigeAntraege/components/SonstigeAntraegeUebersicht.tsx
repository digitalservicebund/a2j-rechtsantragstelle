import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import SonstigeAntraege from "./SonstigeAntraege";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { translations } from "~/services/translations/translations";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { getAntragNumber } from "../../tatsachenvortrag/antragOrdering";
import React, { useEffect } from "react";
import { ANTRAG_DELETION_URL_ENDPOINT } from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";

export const BASE_URL_SONSTIGE_ANTRAEGE =
  "/geld-einklagen/anwaltschaft/sonstige-antraege/antrag";

const MAX_SONSTIGE_ANTRAEGE_ITEMS = 10;

const focusStorageKey = "focus-sonstigesantrag";

const onEditSonstigeAntrag = (index: number) => {
  sessionStorage.setItem(focusStorageKey, String(index));
};

const focusOnSonstigerAntrag = (itemIndex: number) => {
  setTimeout(() => {
    const element =
      document.getElementById(`sonstigeAntraege-${itemIndex}`) ??
      document.querySelector<HTMLAnchorElement>(
        '[data-testid="add-sonstigeAntraege"]',
      );

    element?.focus();
  }, 100);
};

const SonstigeAntraegeUebersicht = () => {
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const itemIndex = sessionStorage.getItem(focusStorageKey);

      if (itemIndex === null) return;

      const element = document.getElementById(`sonstigeAntraege-${itemIndex}`);

      if (element) {
        element.focus();
        sessionStorage.removeItem(focusStorageKey);
      }
    }, 0);

    return () => clearTimeout(focusTimer);
  }, []);

  const deleteSonstigeAntrag = useDeleteArrayItem(
    "sonstigeAntraege",
    BASE_URL_SONSTIGE_ANTRAEGE,
    focusOnSonstigerAntrag,
    ANTRAG_DELETION_URL_ENDPOINT,
  );
  const { userData, flowId } = useFormFlow();

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  const userDataGeldEinklagen = userData as GeldEinklagenAnwaltschaftUserData;

  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.sonstigeAntraege)
    ? (userDataGeldEinklagen.sonstigeAntraege?.length ?? 0)
    : 0;

  const addButtonUrl = `${BASE_URL_SONSTIGE_ANTRAEGE}/${nextItemIndex}/daten`;

  const shouldDisableAddButton = nextItemIndex >= MAX_SONSTIGE_ANTRAEGE_ITEMS;

  return (
    <ArrayItemListSection
      notice={
        shouldDisableAddButton && (
          <InlineNotice
            title={
              translations.geldEinklagenAnwaltschaft
                .soenstigeProzessantragInlineNoticeTitle.de
            }
            tagName={"p"}
            look={"info"}
            content={
              translations.geldEinklagenAnwaltschaft
                .soenstigeProzessantragInlineNoticeContent.de
            }
          />
        )
      }
      addButton={{
        href: addButtonUrl,
        disabled: shouldDisableAddButton,
        dataTestId: "add-sonstigeAntraege",
        onClick: () => onEditSonstigeAntrag(nextItemIndex),
        buttonText:
          translations.geldEinklagenAnwaltschaft
            .soenstigeProzessantragArrayButton.de,
      }}
    >
      {arrayIsNonEmpty(userDataGeldEinklagen.sonstigeAntraege) &&
        userDataGeldEinklagen.sonstigeAntraege.map((item, index) => (
          <React.Fragment key={item.id}>
            <h2
              id={`sonstigeAntrag-${index}`}
              className="kern-body kern-body--large kern-body--bold p-0! mb-16"
            >
              {
                translations.geldEinklagenAnwaltschaft
                  .sonstigerAntragArrayItemTitle.de
              }{" "}
              {getAntragNumber(
                userDataGeldEinklagen,
                "sonstigeAntraege",
                index,
              )}
            </h2>
            <SonstigeAntraege
              itemIndex={index}
              antragNumber={getAntragNumber(
                userDataGeldEinklagen,
                "sonstigeAntraege",
                index,
              )}
              item={item}
              onDelete={deleteSonstigeAntrag}
              onEdit={onEditSonstigeAntrag}
            />
          </React.Fragment>
        ))}
    </ArrayItemListSection>
  );
};

export default SonstigeAntraegeUebersicht;
