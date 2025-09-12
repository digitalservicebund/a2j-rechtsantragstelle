import type { UserData } from "~/domains/userData";
import {
  getTranslationByKey,
  type Translations,
} from "~/services/translations/getTranslationByKey";
import { lookupOrKey } from "~/util/lookupOrKey";
import Heading from "./common/Heading";
import { StandaloneLink } from "./common/StandaloneLink";

type MigrationDataProps = {
  readonly userData?: UserData;
  readonly translations: Translations;
  readonly sortedFields?: string[];
  readonly buttonUrl?: string;
};

const MIGRATION_BUTTON_TEXT_TRANSLATION = "migrationButtonText";

type ValueOfUserData = UserData[keyof UserData];

const renderMigrationValue = (
  translations: Translations,
  value: ValueOfUserData,
  key: string,
  // eslint-disable-next-line sonarjs/function-return-type
) => {
  if (typeof value === "object") {
    return Object.entries(value).map(([_, subValue]) => (
      <p key={subValue as string}>
        {lookupOrKey(subValue as string, translations)}
      </p>
    ));
  }

  return (
    translations[`${key}.${value}`] ?? translations[`${key}.migration.value`]
  );
};

const getSortedFieldsUserData = (
  userData: UserData,
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
  }, {} as UserData);
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
        <div className="mt-32!">
          <StandaloneLink
            url={buttonUrl}
            text={getTranslationByKey(
              MIGRATION_BUTTON_TEXT_TRANSLATION,
              translations,
            )}
          />
        </div>
      )}
    </div>
  );
}
