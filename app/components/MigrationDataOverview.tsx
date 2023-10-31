import Background from "./Background";
import Box from "./Box";
import Container from "./Container";

// TODO: Temporary, these values should actually be fetched from the CMS
const keyTranslations: Record<string, string> = {
  startAirport: "Startflughafen",
  endAirport: "Zielflughafen",
  fluggesellschaft: "Fluggesellschaft",
  bereich: "Problem",
};

const fieldTranslations: Record<string, string> = {
  lufthansa: "Deutsche Lufthansa AG",
  nichtbefoerderung: "Keine Beförderung",
  verspaetet: "Verspätete Beförderung",
  annulierung: "Annulierung",
  anderes: "Etwas anderes",
};

const lookupOrKey = (key: string, lookup: Record<string, string>) =>
  key in lookup ? lookup[key] : key;

type MigrationDataProps = { migrationData: Record<string, unknown> };

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
                  `**${lookupOrKey(key, keyTranslations)}:**\n\n${lookupOrKey(
                    field as string,
                    fieldTranslations,
                  )}\n\n`,
              )
              .join(""),
          }}
        />
      </Container>
    </Background>
  );
}
