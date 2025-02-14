import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { getItemValueBox } from "./getItemValueBox";

export type SummaryOverviewBoxItemType = {
  readonly field: string;
  readonly title?: string;
  readonly displayEmptyValue?: string;
};

export type Props = SummaryOverviewBoxItemType & {
  readonly userData: Context;
  readonly translations: Translations;
};

const SummaryOverviewBoxItem = ({
  field,
  userData,
  translations,
  title,
  displayEmptyValue,
}: Props) => {
  const itemValue = getItemValueBox(
    translations,
    userData,
    field,
    displayEmptyValue,
  );

  if (typeof itemValue === "undefined" || itemValue.trim().length === 0) {
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
