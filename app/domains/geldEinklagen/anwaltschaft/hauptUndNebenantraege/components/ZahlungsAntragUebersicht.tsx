import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BezifferterZahlungsantrag } from "./BezifferterZahlungsantrag";
import { translations } from "~/services/translations/translations";
import { InlineNotice } from "~/components/content/InlineNotice";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import React from "react";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";

const BASE_URL_ZAHLUNGS_ANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/hauptantrag";

const MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS = 50;

const ZahlungsAntragUebersicht = () => {
  const { userData, flowId } = useFormFlow();

  const userDataGeldEinklagen = userData as GeldEinklagenAnwaltschaftUserData;

  const deleteHauptantrag = useDeleteArrayItem(
    "hauptantrag",
    "/geld-einklagen/anwaltschaft",
  );

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.hauptantrag)
    ? (userDataGeldEinklagen.hauptantrag?.length ?? 0)
    : 0;

  const shouldDisableAddButton =
    nextItemIndex >= MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS;

  return (
    <ArrayItemListSection
      headingId="zahlungsantrag-heading"
      notice={
        shouldDisableAddButton ? (
          <InlineNotice
            title={
              translations.geldEinklagenAnwaltschaft
                .zahlungsAntragInlineNoticeTitle.de
            }
            tagName="p"
            look="info"
            content={
              translations.geldEinklagenAnwaltschaft
                .zahlungsAntragInlineNoticeContent.de
            }
          />
        ) : undefined
      }
      addButton={{
        href: `${BASE_URL_ZAHLUNGS_ANTRAG}/${nextItemIndex}/daten`,
        buttonText:
          translations.geldEinklagenAnwaltschaft.zahlungsAntragHinzufuegen.de,
        disabled: shouldDisableAddButton,
        dataTestId: "add-zahlungsantrag",
      }}
    >
      {arrayIsNonEmpty(userDataGeldEinklagen.hauptantrag) &&
        userDataGeldEinklagen.hauptantrag.map((item, index) => (
          <React.Fragment key={item.id}>
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
              index={index}
              onDelete={deleteHauptantrag}
            />
          </React.Fragment>
        ))}
    </ArrayItemListSection>
  );
};

export default ZahlungsAntragUebersicht;
