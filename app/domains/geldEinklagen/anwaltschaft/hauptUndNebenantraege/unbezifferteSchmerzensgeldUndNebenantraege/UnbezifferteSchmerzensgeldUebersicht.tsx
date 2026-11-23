import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { translations } from "~/services/translations/translations";
import { InlineNotice } from "~/components/content/InlineNotice";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import React, { useEffect } from "react";
import { UnbezifferteSchmerzensgeldantrag } from "./UnbezifferteSchmerzensgeldantrag";
import { getAntragNumber } from "../../tatsachenvortrag/antragOrdering";
import { ANTRAG_DELETION_URL_ENDPOINT } from "../../services/antragHelpers";
import { getOrderedKlageParties } from "../../shared/klageParties/klagePartyOrdering";

const BASE_URL_SCHMERZENGELD_ANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege";

const MAX_SCHMERZENGELD_ANTRAG_ITEMS = 30;

const focusStorageKey = "focus-schmerzengeldantrag";

const onEditSchmerzengeldAntrag = (index: number) => {
  sessionStorage.setItem(focusStorageKey, String(index));
};

const focusOnSchmerzengeldAntrag = (index: number) => {
  setTimeout(() => {
    const element =
      document.getElementById(`schmerzengeldantrag-${index}`) ??
      document.querySelector<HTMLAnchorElement>(
        '[data-testid="add-schmerzengeldantrag"]',
      );

    element?.focus();
  }, 100);
};

const UnbezifferteSchmerzensgeldUebersicht = () => {
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const itemIndex = sessionStorage.getItem(focusStorageKey);

      if (itemIndex === null) return;

      const element = document.getElementById(
        `schmerzengeldantrag-${itemIndex}`,
      );

      if (element) {
        element.focus();
        sessionStorage.removeItem(focusStorageKey);
      }
    }, 0);

    return () => clearTimeout(focusTimer);
  }, []);

  const { userData, flowId } = useFormFlow();

  const userDataGeldEinklagen = userData as GeldEinklagenAnwaltschaftUserData;

  const deleteSchmerzengeldAntrag = useDeleteArrayItem(
    "schmerzengeldantrag",
    "/geld-einklagen/anwaltschaft",
    focusOnSchmerzengeldAntrag,
    ANTRAG_DELETION_URL_ENDPOINT,
  );

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  const nextItemIndex = arrayIsNonEmpty(
    userDataGeldEinklagen.schmerzengeldantrag,
  )
    ? (userDataGeldEinklagen.schmerzengeldantrag?.length ?? 0)
    : 0;

  const hasParteien =
    getOrderedKlageParties(userDataGeldEinklagen, "klagende").length > 0 &&
    getOrderedKlageParties(userDataGeldEinklagen, "beklagte").length > 0;

  const maxAntraegeReached = nextItemIndex >= MAX_SCHMERZENGELD_ANTRAG_ITEMS;

  return (
    <ArrayItemListSection
      headingId="schmerzengeldantrag-heading"
      notice={
        maxAntraegeReached ? (
          <InlineNotice
            title={
              translations.geldEinklagenAnwaltschaft
                .schmerzengeldantragInlineNoticeMaxReachedTitle.de
            }
            tagName="p"
            look="info"
            content={
              translations.geldEinklagenAnwaltschaft
                .schmerzengeldantragInlineNoticeMaxReachedContent.de
            }
          />
        ) : (
          !hasParteien && (
            <InlineNotice
              title={
                translations.geldEinklagenAnwaltschaft
                  .zahlungsAntragInlineNoticeMissingPartiesTitle.de
              }
              tagName="p"
              look="warning"
              content={
                translations.geldEinklagenAnwaltschaft
                  .zahlungsAntragInlineNoticeMissingPartiesContent.de
              }
            />
          )
        )
      }
      addButton={{
        href: `${BASE_URL_SCHMERZENGELD_ANTRAG}/${nextItemIndex}/daten`,
        buttonText:
          translations.geldEinklagenAnwaltschaft.schmerzengeldantragAddButton
            .de,
        disabled: maxAntraegeReached || !hasParteien,
        dataTestId: "add-schmerzengeldantrag",
        onClick: () => onEditSchmerzengeldAntrag(nextItemIndex),
      }}
    >
      {arrayIsNonEmpty(userDataGeldEinklagen.schmerzengeldantrag) &&
        userDataGeldEinklagen.schmerzengeldantrag.map((item, index) => {
          const antragNumber = getAntragNumber(
            userDataGeldEinklagen,
            "schmerzengeldantrag",
            index,
          );
          return (
            <React.Fragment key={item.id ?? index}>
              <h2
                id={`schmerzengeldantrag-heading-${index}`}
                className="kern-body kern-body--large kern-body--bold p-0! mb-16"
              >
                {
                  translations.geldEinklagenAnwaltschaft
                    .schmerzengeldantragHeadline.de
                }{" "}
                {antragNumber}
              </h2>
              <UnbezifferteSchmerzensgeldantrag
                item={item}
                itemIndex={index}
                antragNumber={antragNumber}
                userData={userDataGeldEinklagen}
                onDelete={deleteSchmerzengeldAntrag}
                onEdit={onEditSchmerzengeldAntrag}
              />
            </React.Fragment>
          );
        })}
    </ArrayItemListSection>
  );
};

export default UnbezifferteSchmerzensgeldUebersicht;
