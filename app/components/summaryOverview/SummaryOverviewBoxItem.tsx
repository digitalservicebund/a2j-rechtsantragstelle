import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";
import { getItemValueBox } from "./getItemValueBox";

export type SummaryOverviewBoxItemType = {
  readonly title?: string;
  readonly inlineItems: Array<{
    readonly field: string;
    readonly emptyValuePlaceholder?: string;
  }>;
};

type Props = SummaryOverviewBoxItemType & {
  readonly userData: Context;
  readonly translations: Translations;
};

const buildItemValue = (
  userData: Context,
  translations: Translations,
  inlineItems: Array<{ field: string; emptyValuePlaceholder?: string }>,
) => {
  return getItemValueBox(translations, userData, inlineItems);
};

const SummaryOverviewBoxItem = ({
  userData,
  translations,
  title,
  inlineItems,
}: Props) => {
  const itemValue = buildItemValue(userData, translations, inlineItems);

  if (isFieldEmptyOrUndefined(itemValue.trim())) {
    return null;
  }

  return (
    <>
      {title && (
        <div
          data-testid="summary-box-item-title"
          className="ds-label-01-bold mt-16"
        >
          {title}
        </div>
      )}
      <div data-testid="summary-box-item-value">{itemValue}</div>
    </>
  );
};

export default SummaryOverviewBoxItem;
