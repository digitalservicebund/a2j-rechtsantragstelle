import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { getItemValueBox } from "./getItemValueBox";

type Props = {
  readonly fieldName: string;
  readonly userData: Context;
  readonly translations: Translations;
};

const SummaryOverviewBoxItem = ({
  fieldName,
  userData,
  translations,
}: Props) => {
  const itemTitle = translations?.[fieldName];
  const itemValue = getItemValueBox(translations, userData, fieldName);
  return (
    <>
      {itemTitle && (
        <dt
          data-testid="summary-box-item-title"
          className="ds-label-01-bold mt-16"
        >
          {itemTitle}
        </dt>
      )}
      {itemValue.length > 0 && (
        <dd data-testid="summary-box-item-value">{itemValue}</dd>
      )}
    </>
  );
};

export default SummaryOverviewBoxItem;
