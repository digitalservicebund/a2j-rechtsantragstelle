import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { arrayIsNonEmpty } from "~/util/array";
import { getItemValueBox } from "./getItemValueBox";

const EMPTY_SPACE = " ";

export type SummaryOverviewBoxItemType = {
  readonly field: string;
  readonly title?: string;
  readonly displayEmptyValue?: string;
  readonly inlineItems?: Array<{
    readonly field: string;
  }>;
};

export type Props = SummaryOverviewBoxItemType & {
  readonly userData: Context;
  readonly translations: Translations;
};

const getInlineItemValues = (
  userData: Context,
  translations: Translations,
  inlineItems?: Array<{ field: string }>,
) => {
  if (!arrayIsNonEmpty(inlineItems)) {
    return "";
  }

  return inlineItems
    .map(({ field }) => {
      return getItemValueBox(translations, userData, field) + EMPTY_SPACE;
    })
    .join(" ");
};

const SummaryOverviewBoxItem = ({
  field,
  userData,
  translations,
  title,
  displayEmptyValue,
  inlineItems,
}: Props) => {
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

  if (
    (typeof itemValue === "undefined" || itemValue.trim().length === 0) &&
    inlineItemValues.length === 0
  ) {
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
      <dd data-testid="summary-box-item-value">
        {inlineItemValues.length > 0 ? inlineItemValues : itemValue}
      </dd>
    </>
  );
};

export default SummaryOverviewBoxItem;
