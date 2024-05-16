import { type Translations } from "~/services/cms/index.server";
import Background from "./Background";
import Box from "./Box";
import Container from "./Container";
import { lookupOrKey } from "../util/lookupOrKey";

type MigrationDataProps = {
  readonly migrationData?: Record<string, unknown>;
  readonly translations: Translations;
};

export default function MigrationDataOverview(props: MigrationDataProps) {
  if (!props.migrationData || Object.keys(props.migrationData).length === 0)
    return null;
  return (
    <Background backgroundColor="white">
      <Container>
        <Box
          content={{
            markdown: Object.entries(props.migrationData)
              .map(([key, value]) => {
                const formattedKey = `**${lookupOrKey(key, props.translations)}:**\n\n`;

                if (typeof value === "object" && value !== null) {
                  const objectProperties = Object.entries(value)
                    .map(
                      ([_, subValue]) =>
                        `${lookupOrKey(
                          subValue as string,
                          props.translations,
                        )}`,
                    )
                    .join("\n\n");

                  return `${formattedKey}\n\n${objectProperties}\n\n`;
                } else {
                  return `${formattedKey}${lookupOrKey(value as string, props.translations)}\n\n`;
                }
              })
              .join(""),
          }}
        />
      </Container>
    </Background>
  );
}
