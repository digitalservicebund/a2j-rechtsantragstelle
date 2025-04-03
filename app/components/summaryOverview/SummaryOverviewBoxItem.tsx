import { type Context } from "~/domains/contexts";
import { type Translations } from "~/services/translations/getTranslationByKey";
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

const SummaryOverviewBoxItem = ({
  userData,
  translations,
  title,
  inlineItems,
}: Props) => {
  const itemValue = getItemValueBox(translations, userData, inlineItems);

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
