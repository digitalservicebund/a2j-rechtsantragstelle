import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import Heading from "../Heading";

const EMPTY_TITLE = "emptyTitle";

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

function getTranslationByKeyForUserData(
  key: string,
  translations?: Translations,
): string {
  const translation = translations?.[key];
  return translation ?? key;
}

const SummaryOverviewBoxItem = ({
  fieldName,
  userData,
  translations,
}: Props) => {
  return (
    <>
      {renderItemTitle(translations, fieldName)}

      {getTranslationByKeyForUserData(
        userData[fieldName] as string,
        translations,
      )}
    </>
  );
};

export default SummaryOverviewBoxItem;
