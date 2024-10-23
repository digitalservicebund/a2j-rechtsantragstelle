import type { Context } from "~/flows/contexts";
import { type Translations } from "~/services/cms/index.server";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { lookupOrKey } from "~/util/lookupOrKey";
import Button from "./Button";
import Heading from "./Heading";

type MigrationDataProps = {
  readonly userData?: Context;
  readonly translations: Translations;
  readonly sortedFields?: string[];
  readonly buttonUrl?: string;
};

const MIGRATION_BUTTON_TEXT_TRANSLATION = "migrationButtonText";

type ValueOfContext = Context[keyof Context];

const renderMigrationValue = (
  translations: Translations,
  value: ValueOfContext,
  key: string,
) => {
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).map(([_, subValue]) => (
      <p key={subValue as string}>
        {lookupOrKey(subValue as string, translations)}
      </p>
    ));
  }

  const translation = translations[`${key}.${value}`];

  if (typeof translation === "undefined") {
    return translations[`${key}.value`];
  }

  return translation;
};

const getSortedFieldsUserData = (
  userData: Context,
  sortedFields?: string[],
) => {
  if (typeof sortedFields === "undefined" || sortedFields.length === 0) {
    return userData;
  }

  return sortedFields.reduce((sortedUserData, key) => {
    if (key in userData) {
      sortedUserData[key] = userData[key];
    }
    return sortedUserData;
  }, {} as Context);
};

export default function MigrationDataOverview({
  translations,
  userData,
  sortedFields,
  buttonUrl,
}: MigrationDataProps) {
  if (!userData || Object.keys(userData).length === 0) return null;

  const sortedFieldsUserData = getSortedFieldsUserData(userData, sortedFields);

  return (
    <div className="space-y-16 bg-white pt-32 pb-44 px-32">
      {Object.entries(sortedFieldsUserData).map(([itemKey, itemValue]) => (
        <div key={itemKey} className="first:pt-0 scroll-my-40">
          <Heading
            text={getTranslationByKey(itemKey, translations)}
            tagName="p"
            look="ds-label-01-bold"
            dataTestid="migration-field-value"
          />
          {renderMigrationValue(translations, itemValue, itemKey)}
        </div>
      ))}

      {buttonUrl && (
        <Button href={buttonUrl} look="tertiary" size="large" className="w-fit">
          {getTranslationByKey(MIGRATION_BUTTON_TEXT_TRANSLATION, translations)}
        </Button>
      )}
    </div>
  );
}
