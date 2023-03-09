import { z } from "zod";
import { RadioGroup } from "~/components";

export const staatlicheLeistungen = z.enum([
  "Grundsicherung",
  "Asylbewerberleistungen",
  "Bürgergeld",
  "Keine",
]);
export type StaatlicheLeistungen = z.infer<typeof staatlicheLeistungen>;
const schema = z.object({ beziehtStaatlicheLeistungen: staatlicheLeistungen });
const varNames = schema.keyof().Values;

export const sozialleistungStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid green 1px", padding: "1rem" }}>
        <h2>Erhalten Sie aktuell eine der folgenden staatlichen Leistungen?</h2>
        <RadioGroup
          name={varNames.beziehtStaatlicheLeistungen}
          options={[
            {
              label: "Grundsicherung oder Sozialhilfe",
              value: staatlicheLeistungen.Enum.Grundsicherung,
            },
            {
              label: "Leistungen nach Asylbewerberleistungsgesetz",
              value: staatlicheLeistungen.Enum.Asylbewerberleistungen,
            },
            {
              label: "Bürgergeld (früher 'Hartz 4' oder 'Arbeitslosengeld 2')",
              value: staatlicheLeistungen.Enum.Bürgergeld,
            },
            {
              label: "Nein, ich erhalte keine dieser Leistungen.",
              value: staatlicheLeistungen.Enum.Keine,
            },
          ]}
        />
      </div>
    );
  },
};
