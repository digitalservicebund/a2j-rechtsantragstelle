import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";

const EMPTY_ITEM_TRANSLATION_VALUE = "emptyValue";

type Props = {
  readonly fieldName: string;
  readonly userData: Context;
  readonly translations: Translations;
};

const getItemValue = (
  translations: Translations,
  userData: Context,
  fieldName: string,
) => {
  const itemValue = userData[fieldName] as string;
  const translationItemValue = translations[`${fieldName}.${itemValue}`];

  if (typeof translationItemValue !== "undefined") {
    return translationItemValue;
  }

  const translationEmptyValue =
    translations[`${fieldName}.${EMPTY_ITEM_TRANSLATION_VALUE}`];

  if (typeof translationEmptyValue !== "undefined" && itemValue.length === 0) {
    return translationEmptyValue;
  }

  const translationValue = translations[`${fieldName}.value`];

  return translationValue ?? itemValue;
};

const SummaryOverviewBoxItem = ({
  fieldName,
  userData,
  translations,
}: Props) => {
  const itemTitle = translations?.[fieldName];
  return (
    <>
      {itemTitle && <dt className="ds-label-01-bold mt-16">{itemTitle}</dt>}

      <dd>{getItemValue(translations, userData, fieldName)}</dd>
    </>
  );
};

export default SummaryOverviewBoxItem;
