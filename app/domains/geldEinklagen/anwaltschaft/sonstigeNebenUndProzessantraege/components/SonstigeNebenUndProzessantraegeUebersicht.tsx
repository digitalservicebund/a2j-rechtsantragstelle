import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import SonstigeNebenUndProzessantraege from "./SonstigeNebenUndProzessantraege";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { translations } from "~/services/translations/translations";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";

export const BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE =
  "/geld-einklagen/anwaltschaft/sonstige-neben-und-prozessantraege/antrag";

const MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS = 10;

const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 100;

const focusOnSonstigeNebenUndProzessantraege = (itemIndex: number) => {
  setTimeout(() => {
    let element = document.getElementById(
      `sonstigeNebenUndProzessantraege-${itemIndex}`,
    );
    element ??= document.getElementById(
      `sonstigeNebenUndProzessantraege-${itemIndex - 1}`,
    );
    element ??= document.querySelector<HTMLElement>(
      '[data-testid="add-sonstigeNebenUndProzessantraege"]',
    );
    element?.focus();
  }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
};

const SonstigeNebenUndProzessantraegeUebersicht = () => {
  const deleteArrayItem = useDeleteArrayItem(
    "sonstigeNebenUndProzessantraege",
    BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE,
    focusOnSonstigeNebenUndProzessantraege,
  );
  const { userData, flowId } = useFormFlow();

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  const userDataGeldEinklagen = userData as GeldEinklagenAnwaltschaftUserData;

  const nextItemIndex = arrayIsNonEmpty(
    userDataGeldEinklagen.sonstigeNebenUndProzessantraege,
  )
    ? (userDataGeldEinklagen.sonstigeNebenUndProzessantraege?.length ?? 0)
    : 0;

  const addButtonUrl = `${BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE}/${nextItemIndex}/daten`;

  const shouldDisableAddButton =
    nextItemIndex >= MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS;

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        {arrayIsNonEmpty(
          userDataGeldEinklagen.sonstigeNebenUndProzessantraege,
        ) &&
          userDataGeldEinklagen.sonstigeNebenUndProzessantraege.map(
            (item, index) => (
              <SonstigeNebenUndProzessantraege
                key={item.antrag}
                itemIndex={index}
                item={item}
                onDelete={deleteArrayItem}
              />
            ),
          )}
        <div className="flex flex-col items-start gap-24 p-kern-space-default border border-dashed border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) bg-white">
          <Button
            look="secondary"
            iconLeft={<Icon name="plus" className="text-kern-action-default" />}
            href={addButtonUrl}
            data-testid="add-sonstigeNebenUndProzessantraege"
            fullWidth={true}
            disabled={shouldDisableAddButton}
            aria-disabled={shouldDisableAddButton}
          >
            {
              translations.geldEinklagenAnwaltschaft
                .soenstigeProzessantragArrayButton.de
            }
          </Button>
        </div>
        <div className="pt-24">
          {shouldDisableAddButton && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SonstigeNebenUndProzessantraegeUebersicht;
