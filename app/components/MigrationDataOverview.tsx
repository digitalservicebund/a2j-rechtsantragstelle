import type { UserData } from "~/domains/userData";
import {
  getTranslationByKey,
  type Translations,
} from "~/services/translations/getTranslationByKey";
import { StandaloneLink } from "./common/StandaloneLink";

type MigrationDataProps = {
  readonly userData?: UserData;
  readonly translations: Translations;
  readonly sortedFields?: string[];
  readonly buttonUrl?: string;
};

const MIGRATION_BUTTON_TEXT_TRANSLATION = "migrationButtonText";

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

type MigrationItemsProps = {
  itemKey: string;
  itemValue: string;
  translations: Translations;
};

const MigrationItems = ({
  itemKey,
  itemValue,
  translations,
}: MigrationItemsProps) => {
  return (
    <>
      <dt data-testid="migration-field-value" className="ds-label-01-bold mb-0">
        {getTranslationByKey(itemKey, translations)}
      </dt>
      <dd>
        {translations[`${itemKey}.${itemValue}`] ??
          translations[`${itemKey}.migration.value`]}
      </dd>
    </>
  );
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
    <dl className="space-y-16 bg-white pt-32 pb-44 px-32">
      {Object.entries(sortedFieldsUserData).map(([itemKey, itemValue]) => (
        <MigrationItems
          key={itemKey}
          itemKey={itemKey}
          itemValue={itemValue as string}
          translations={translations}
        />
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
    </dl>
  );
}
