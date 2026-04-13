import type { UserData } from "~/domains/userData";
import type { FieldItems, SummaryOverviewBoxItemType } from "./types";
import { type Translations } from "~/services/translations/getTranslationByKey";
import {
  extractFieldItemsFromInlineItems,
  getItemValueBox,
} from "./getItemValueBox";
import { hasMoneyValidationSchema, hasNonEmptyLongTextField } from "./helper";

type Props = SummaryOverviewBoxItemType & {
  readonly userData: UserData;
  readonly translations: Translations;
  readonly pathname: string;
};

const SCROLLABLE_BOX_ROWS = 10;

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
  pathname,
}: Props) => {
  const rawItemValue = getItemValueBox(translations, userData, inlineItems);
  if (rawItemValue.trim() === "") return null;

  const fieldItems = extractFieldItemsFromInlineItems(userData, inlineItems);
  const shouldAppendEuroWord = hasMoneyValidationSchema(pathname, fieldItems);
  const itemValue = shouldAppendEuroWord
    ? `${rawItemValue} Euro`
    : rawItemValue;

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
