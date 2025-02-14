import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";
import { getInlineItemValues } from "./getInlineItemValues";
import { getItemValueBox } from "./getItemValueBox";

export type SummaryOverviewBoxItemType = {
  readonly field: string;
  readonly title?: string;
  readonly displayEmptyValue?: string;
  readonly inlineItems?: Array<{
    readonly field: string;
  }>;
};

type Props = SummaryOverviewBoxItemType & {
  readonly userData: Context;
  readonly translations: Translations;
};

const buildItemValue = (
  userData: Context,
  translations: Translations,
  field: string,
  displayEmptyValue?: string,
  inlineItems?: Array<{ field: string }>,
) => {
  const itemValue = getItemValueBox(
    translations,
    userData,
    field,
    displayEmptyValue,
  );

  const inlineItemValues = getInlineItemValues(
    userData,
    translations,
    inlineItems,
  );

  return inlineItemValues.length > 0 ? inlineItemValues : (itemValue ?? "");
};

const SummaryOverviewBoxItem = ({
  field,
  userData,
  translations,
  title,
  displayEmptyValue,
  inlineItems,
}: Props) => {
  const itemValue = buildItemValue(
    userData,
    translations,
    field,
    displayEmptyValue,
    inlineItems,
  );

  if (isFieldEmptyOrUndefined(itemValue.trim())) {
    return null;
  }

  return (
    <>
      {title && (
        <dt
          data-testid="summary-box-item-title"
          className="ds-label-01-bold mt-16"
        >
          {title}
        </dt>
      )}
      <dd data-testid="summary-box-item-value">{itemValue}</dd>
    </>
  );
};

export default SummaryOverviewBoxItem;
