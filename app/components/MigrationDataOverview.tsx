import { type Translations } from "~/services/cms/index.server";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import { lookupOrKey } from "~/util/lookupOrKey";
import Background from "./Background";
import Box from "./Box";
import Container from "./Container";

type MigrationDataProps = {
  readonly migrationData?: Record<string, unknown>;
  readonly translations: Translations;
};

const getMigrationValueTranslation = (
  translations: Translations,
  value: string,
  key: string,
) => {
  const translation = translations[value];

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
    <Background backgroundColor="white">
      <Container>
        <Box
          content={{
            markdown: Object.entries(migrationData)
              .map(([key, value]) => {
                const formattedKey = `**${getTranslationByKey(key, translations)}**\n\n`;

                if (typeof value === "object" && value !== null) {
                  const objectProperties = Object.entries(value)
                    .map(
                      ([_, subValue]) =>
                        `${lookupOrKey(subValue as string, translations)}`,
                    )
                    .join("\n\n");

                  return `${formattedKey}\n\n${objectProperties}\n\n`;
                }
                return `${formattedKey}${getMigrationValueTranslation(translations, value as string, key)}\n\n`;
              })
              .join(""),
          }}
        />
      </Container>
    </Background>
  );
}
