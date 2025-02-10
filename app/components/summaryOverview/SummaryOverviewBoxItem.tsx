import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import Heading from "../Heading";

type Props = {
  readonly fieldName: string;
  readonly userData: Context;
  readonly translations: Translations;
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
  const titleTranslation = translations?.[fieldName];

  return (
    <>
      {typeof titleTranslation !== "undefined" ? (
        <Heading text={titleTranslation} tagName="p" look="ds-label-01-bold" />
      ) : (
        <br />
      )}

      {getTranslationByKeyForUserData(
        userData[fieldName] as string,
        translations,
      )}
    </>
  );
};

export default SummaryOverviewBoxItem;
