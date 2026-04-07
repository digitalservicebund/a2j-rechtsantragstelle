import isCurrency from "validator/lib/isCurrency";
import type { UserData } from "~/domains/userData";
import { isGeldEinklagenLongTextField } from "~/domains/geldEinklagen/formular/klage-erstellen/longTextFieldConfig";
import type { FieldItems, SummaryOverviewBoxItemType } from "./types";
import { type Translations } from "~/services/translations/getTranslationByKey";
import {
  extractFieldItemsFromInlineItems,
  getItemValueBox,
} from "./getItemValueBox";

type Props = SummaryOverviewBoxItemType & {
  readonly userData: UserData;
  readonly translations: Translations;
};

const SCROLLABLE_BOX_ROWS = 10;

const hasNonEmptyLongTextField = (fieldItems: FieldItems) =>
  fieldItems.some(
    ({ fieldName, fieldValue }) =>
      isGeldEinklagenLongTextField(fieldName) &&
      typeof fieldValue === "string" &&
      fieldValue.trim().length > 0,
  );

const SummaryValueOverflowContainer = ({
  children,
  fieldItems,
}: {
  children: React.ReactNode;
  fieldItems: FieldItems;
}) => {
  const useScrollableContainer = hasNonEmptyLongTextField(fieldItems);

  if (!useScrollableContainer) {
    return <>{children}</>;
  }

  return (
    <div className="kern-form-input">
      <div
        className="kern-form-input__input pt-kern-space-small! overflow-auto resize-y box-border whitespace-pre-wrap"
        style={{ blockSize: `${SCROLLABLE_BOX_ROWS * 1.5}rem` }}
      >
        {children}
      </div>
    </div>
  );
};

const SummaryOverviewBoxItem = ({
  userData,
  translations,
  title,
  inlineItems,
}: Props) => {
  const rawItemValue = getItemValueBox(translations, userData, inlineItems);
  const detectedAsCurrency = isCurrency(rawItemValue, {
    thousands_separator: ".",
    decimal_separator: ",",
    require_decimal: true,
  });

  const itemValue = detectedAsCurrency ? `${rawItemValue} €` : rawItemValue;

  if (itemValue.trim() === "") return null;

  const fieldItems = extractFieldItemsFromInlineItems(userData, inlineItems);
  return (
    <dl className="flex flex-col items-start">
      {title && (
        <dt
          data-testid="summary-box-item-title"
          className="kern-label text-kern-static-medium w-full"
        >
          {title}
        </dt>
      )}

      <dd
        data-testid="summary-box-item-value"
        className="kern-body text-kern-static-medium w-full h-full"
      >
        <SummaryValueOverflowContainer fieldItems={fieldItems}>
          {itemValue}
        </SummaryValueOverflowContainer>
      </dd>
    </dl>
  );
};

export default SummaryOverviewBoxItem;
