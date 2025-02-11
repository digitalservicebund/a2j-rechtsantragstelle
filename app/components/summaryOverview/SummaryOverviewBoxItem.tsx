import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import Heading from "../Heading";

const EMPTY_TITLE = "emptyTitle";
const EMPTY_ITEM_TRANSLATION_VALUE = "emptyValue";

type Props = {
  readonly fieldName: string;
  readonly userData: Context;
  readonly translations: Translations;
};

const renderItemTitle = (translations: Translations, fieldName: string) => {
  const titleTranslation = translations?.[fieldName];

  if (typeof titleTranslation === "string") {
    if (titleTranslation === EMPTY_TITLE) {
      return null;
    }

    return (
      <Heading text={titleTranslation} tagName="p" look="ds-label-01-bold" />
    );
  }

  return <br />;
};

const renderItemValue = (
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
  return (
    <>
      {renderItemTitle(translations, fieldName)}
      {renderItemValue(translations, userData, fieldName)}
    </>
  );
};

export default SummaryOverviewBoxItem;
