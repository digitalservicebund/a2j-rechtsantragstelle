import type { UserData } from "~/domains/userData";
import type { FieldItems, SummaryOverviewBoxItemType } from "./types";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { resolveInlineUserFields, getItemValueBox } from "./getItemValueBox";

type Props = SummaryOverviewBoxItemType & {
  readonly userData: UserData;
  readonly translations: Translations;
};

const allowedFieldOverflow = new Set([
  "sachverhaltBegruendung",
  "beweiseBeschreibung",
  "weitereAntraege",
  "rechtlicheWuerdigung",
]);

const SCROLLABLE_BOX_ROWS = 10;

const hasNonEmptyLongTextField = (fieldItems: FieldItems) =>
  fieldItems.some(
    ({ fieldName, fieldValue }) =>
      allowedFieldOverflow.has(fieldName) &&
      typeof fieldValue === "string" &&
      fieldValue.trim().length > 0,
  );

export const SummaryValueOverflowContainer = ({
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
    <div
      className="border-blue-500 p-[16px] mt-8 w-full overflow-auto resize-y box-border border-1 whitespace-pre-wrap"
      style={{ blockSize: `${SCROLLABLE_BOX_ROWS * 1.5}rem` }}
    >
      {children}
    </div>
  );
};

const SummaryOverviewBoxItem = ({
  userData,
  translations,
  title,
  inlineItems,
}: Props) => {
  const itemValue = getItemValueBox(translations, userData, inlineItems);
  if (itemValue.trim() === "") return null;

  const fieldItems = resolveInlineUserFields(userData, inlineItems);

  return (
    <div>
      {title && (
        <dt
          data-testid="summary-box-item-title"
          className="ds-label-01-bold mt-16"
        >
          {title}
        </dt>
      )}

      <dd data-testid="summary-box-item-value">
        <SummaryValueOverflowContainer fieldItems={fieldItems}>
          {itemValue}
        </SummaryValueOverflowContainer>
      </dd>
    </div>
  );
};

export default SummaryOverviewBoxItem;
