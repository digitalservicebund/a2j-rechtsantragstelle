import type { Context } from "~/flows/contexts";
import { type Translations } from "~/services/cms/index.server";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { lookupOrKey } from "~/util/lookupOrKey";
import Heading from "./Heading";

type MigrationDataProps = {
  readonly migrationData?: Context;
  readonly translations: Translations;
  readonly migrationOrderFields?: string[];
};

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

const getOrderFieldsData = (
  migrationData: Context,
  migrationOrderFields?: string[],
) => {
  if (typeof migrationOrderFields === "undefined") {
    return migrationData;
  }

  return migrationOrderFields.reduce((orderedData, key) => {
    if (key in migrationData) {
      orderedData[key] = migrationData[key];
    }
    return orderedData;
  }, {} as Context);
};

export default function MigrationDataOverview({
  translations,
  migrationData,
  migrationOrderFields,
}: MigrationDataProps) {
  if (!migrationData || Object.keys(migrationData).length === 0) return null;

  const data = getOrderFieldsData(migrationData, migrationOrderFields);

  return (
    <div className="space-y-16 bg-white pt-32 pb-44 px-32">
      {Object.entries(data).map(([itemKey, itemValue]) => (
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
    </div>
  );
}
