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
  const itemTitle = translations?.[`${fieldName}.title`];
  const itemValue = getItemValueBox(translations, userData, fieldName);

  if (typeof itemValue === "undefined" || itemValue.trim().length === 0) {
    return null;
  }

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
      <dd data-testid="summary-box-item-value">{itemValue}</dd>
    </>
  );
};

export default SummaryOverviewBoxItem;
