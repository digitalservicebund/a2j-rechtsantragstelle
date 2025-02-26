import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";
import { getItemValueBox } from "./getItemValueBox";

export type SummaryOverviewBoxItemType = {
  readonly title?: string;
  readonly displayEmptyValue?: string;
  readonly inlineItems: Array<{
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
  inlineItems: Array<{ field: string }>,
  displayEmptyValue?: string,
) => {
  return getItemValueBox(
    translations,
    userData,
    inlineItems,
    displayEmptyValue,
  );
};

const SummaryOverviewBoxItem = ({
  userData,
  translations,
  title,
  displayEmptyValue,
  inlineItems,
}: Props) => {
  const itemValue = buildItemValue(
    userData,
    translations,
    inlineItems,
    displayEmptyValue,
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
