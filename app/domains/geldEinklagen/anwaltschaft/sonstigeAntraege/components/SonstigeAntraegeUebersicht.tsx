import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import SonstigeAntraege from "./SonstigeAntraege";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { translations } from "~/services/translations/translations";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";
import { getAntragNumber } from "../../tatsachenvortrag/antragOrdering";

export const BASE_URL_SONSTIGE_ANTRAEGE =
  "/geld-einklagen/anwaltschaft/sonstige-antraege/antrag";

const MAX_SONSTIGE_ANTRAEGE_ITEMS = 10;

const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 100;

const focusOnSonstigeAntraege = (itemIndex: number) => {
  setTimeout(() => {
    let element = document.getElementById(`sonstigeAntraege-${itemIndex}`);
    element ??= document.getElementById(`sonstigeAntraege-${itemIndex - 1}`);
    element ??= document.querySelector<HTMLElement>(
      '[data-testid="add-sonstigeAntraege"]',
    );
    element?.focus();
  }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
};

const SonstigeAntraegeUebersicht = () => {
  const deleteArrayItem = useDeleteArrayItem(
    "sonstigeAntraege",
    BASE_URL_SONSTIGE_ANTRAEGE,
    focusOnSonstigeAntraege,
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
        buttonText:
          translations.geldEinklagenAnwaltschaft
            .soenstigeProzessantragArrayButton.de,
      }}
    >
      {arrayIsNonEmpty(userDataGeldEinklagen.sonstigeAntraege) &&
        userDataGeldEinklagen.sonstigeAntraege.map((item, index) => (
          <SonstigeAntraege
            key={item.antrag}
            itemIndex={index}
            antragNumber={getAntragNumber(
              userDataGeldEinklagen,
              "sonstigeAntraege",
              index,
            )}
            item={item}
            onDelete={deleteArrayItem}
          />
        ))}
    </ArrayItemListSection>
  );
};

export default SonstigeAntraegeUebersicht;
