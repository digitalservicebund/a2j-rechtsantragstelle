import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import { BezifferterZahlungsantrag } from "./BezifferterZahlungsantrag";
import { translations } from "~/services/translations/translations";
import { InlineNotice } from "~/components/content/InlineNotice";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import React, { useEffect } from "react";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { focusOnZahlungsAntrag } from "../zahlungsAntragFocus";

const BASE_URL_ZAHLUNGS_ANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/hauptantrag";

const BASE_URL_WARNUNG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/warnung";

const MAX_BEZIFFERTE_NEBEN_UND_PROZESSANTRAEGE_ITEMS = 50;

const focusStorageKey = "focus-zahlungsantrag";

const onEditZahlungsAntrag = (index: number) => () => {
  sessionStorage.setItem(focusStorageKey, String(index));
};

const BezifferteZahlungsUndNebenantraegeUebersicht = () => {
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const itemIndex = sessionStorage.getItem(focusStorageKey);

      if (itemIndex === null) return;

      const element = document.getElementById(`zahlungsAntrag-${itemIndex}`);

      if (element) {
        element.focus();
        sessionStorage.removeItem(focusStorageKey);
      }
    }, 0);

    return () => clearTimeout(focusTimer);
  }, []);

  const { userData, flowId } = useFormFlow();

  const userDataGeldEinklagen = userData as GeldEinklagenAnwaltschaftUserData;

  const deleteHauptantrag = useDeleteArrayItem(
    "hauptantrag",
    "/geld-einklagen/anwaltschaft",
    focusOnZahlungsAntrag,
  );

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.hauptantrag)
    ? (userDataGeldEinklagen.hauptantrag?.length ?? 0)
    : 0;

  const hasParteien =
    arrayIsNonEmpty(userDataGeldEinklagen.beklagten) &&
    arrayIsNonEmpty(userDataGeldEinklagen.klagenden);

  const maxAntraegeReached =
    nextItemIndex >= MAX_BEZIFFERTE_NEBEN_UND_PROZESSANTRAEGE_ITEMS;

  return (
    <ArrayItemListSection
      headingId="zahlungsantrag-heading"
      notice={
        maxAntraegeReached ? (
          <InlineNotice
            title={
              translations.geldEinklagenAnwaltschaft
                .zahlungsAntragInlineNoticeMaxReachedTitle.de
            }
            tagName="p"
            look="info"
            content={
              translations.geldEinklagenAnwaltschaft
                .zahlungsAntragInlineNoticeMaxReachedContent.de
            }
          />
        ) : undefined
      }
      addButton={{
        href: !hasParteien
          ? `${BASE_URL_WARNUNG}`
          : `${BASE_URL_ZAHLUNGS_ANTRAG}/${nextItemIndex}/daten`,
        buttonText:
          translations.geldEinklagenAnwaltschaft.zahlungsAntragHinzufuegen.de,
        disabled: maxAntraegeReached,
        dataTestId: "add-zahlungsantrag",
      }}
    >
      {arrayIsNonEmpty(userDataGeldEinklagen.hauptantrag) &&
        userDataGeldEinklagen.hauptantrag.map((item, index) => (
          <React.Fragment key={item.id ?? index}>
            <h2
              id={`zahlungsantrag-heading-${index}`}
              className="kern-body kern-body--large kern-body--bold p-0! mb-16"
            >
              {
                translations.geldEinklagenAnwaltschaft
                  .bezifferterZahlungsantragHeadline.de
              }{" "}
              {index + 1}
            </h2>
            <BezifferterZahlungsantrag
              key={item.internesSchlagwortFordureung}
              itemIndex={index}
              item={item}
              userData={userDataGeldEinklagen}
              onDelete={deleteHauptantrag}
              onEdit={onEditZahlungsAntrag(index)}
            />
          </React.Fragment>
        ))}
    </ArrayItemListSection>
  );
};

export default BezifferteZahlungsUndNebenantraegeUebersicht;
