import { type Translations } from "~/services/cms/index.server";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import { lookupOrKey } from "~/util/lookupOrKey";
import Heading from "./Heading";

type MigrationDataProps = {
  readonly migrationData?: Record<string, unknown>;
  readonly translations: Translations;
};

const renderMigrationValue = (
  translations: Translations,
  value: unknown,
  key: string,
) => {
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).map(([_, subValue]) => (
      <p key={subValue}>{lookupOrKey(subValue as string, translations)}</p>
    ));
  }

  const translation = translations[value as string];

  if (typeof translation === "undefined") {
    return translations[`${key}.value`];
  }

  return translation;
};

export default function MigrationDataOverview({
  translations,
  migrationData,
}: MigrationDataProps) {
  if (!migrationData || Object.keys(migrationData).length === 0) return null;

  return (
    <div className="space-y-16 bg-white pt-32 pb-44 px-32">
      {Object.entries(migrationData).map(([itemKey, itemValue]) => (
        <div key={itemKey} className="first:pt-0 scroll-my-40">
          <Heading
            text={getTranslationByKey(itemKey, translations)}
            tagName="p"
            look="ds-label-01-bold"
          />
          {renderMigrationValue(translations, itemValue, itemKey)}
        </div>
      ))}
    </div>
  );
}
