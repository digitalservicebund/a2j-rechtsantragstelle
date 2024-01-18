import { type Translations } from "~/services/cms/index.server";
import Background from "./Background";
import Box from "./Box";
import Container from "./Container";

const lookupOrKey = (key: string, lookup: Record<string, string>) =>
  key in lookup ? lookup[key] : key;

type MigrationDataProps = {
  readonly migrationData: Record<string, unknown>;
  readonly translations: Translations;
};

export default function MigrationDataOverview(props: MigrationDataProps) {
  if (Object.keys(props.migrationData).length == 0) return false;
  return (
    <Background backgroundColor="white">
      <Container>
        <Box
          content={{
            markdown: Object.entries(props.migrationData)
              .map(
                ([key, field]) =>
                  `**${lookupOrKey(key, props.translations)}:**\n\n${lookupOrKey(
                    field as string,
                    props.translations,
                  )}\n\n`,
              )
              .join(""),
          }}
        />
      </Container>
    </Background>
  );
}
