import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import SonstigeNebenUndProzessantraege from "./SonstigeNebenUndProzessantraege";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { useSonstigeNebenUndProzessantraegeDelete } from "../hooks/useSonstigeNebenUndProzessantraegeDelete";
import { translations } from "~/services/translations/translations";
import { InlineNotice } from "~/components/content/InlineNotice";

export const BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE =
  "/geld-einklagen/anwaltschaft/sonstige-neben-und-prozessantraege/antrag";

const MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS = 10;

const SonstigeNebenUndProzessantraegeUebersicht = () => {
  const { onSonstigeNebenUndProzessantraegeDelete } =
    useSonstigeNebenUndProzessantraegeDelete();
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
                onDelete={onSonstigeNebenUndProzessantraegeDelete}
              />
            ),
          )}
        <div className="flex flex-col items-start gap-24 p-kern-space-default border-1 border-dashed border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)] bg-white">
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
