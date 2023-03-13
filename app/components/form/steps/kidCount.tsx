import { z } from "zod";
import Input from "~/components/Input";

const schema = z.object({
  kids6Below: z.coerce
    .number()
    .min(0, "Ungültige Anzahl")
    .max(8, "Ungültige Anzahl"),
  kids7To14: z.coerce
    .number()
    .min(0, "Ungültige Anzahl")
    .max(8, "Ungültige Anzahl"),
  kids15To18: z.coerce
    .number()
    .min(0, "Ungültige Anzahl")
    .max(8, "Ungültige Anzahl"),
  kids18Above: z.coerce
    .number()
    .min(0, "Ungültige Anzahl")
    .max(8, "Ungültige Anzahl"),
});
const varNames = schema.keyof().Values;

// TODO: empty input defaults to 0 - fill in 0? Need max number for each prop? layout?

export const kidsCountStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wie viele Kinder haben Sie?</h3>
        <Input name={varNames.kids6Below} label="0 - 6 Jahre" type="number" />
        <Input name={varNames.kids7To14} label="7 - 14 Jahre" type="number" />
        <Input name={varNames.kids15To18} label="15 - 18 Jahre" type="number" />
        <Input
          name={varNames.kids18Above}
          label="Aelter als 18 Jahre"
          type="number"
        />
      </div>
    );
  },
};
