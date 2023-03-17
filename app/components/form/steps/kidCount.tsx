import { z } from "zod";
import Input from "~/components/Input";

const schema = z.object({
  kids6Below: z.coerce.number().min(0, "Ungültige Anzahl").default(0),
  kids7To14: z.coerce.number().min(0, "Ungültige Anzahl").default(0),
  kids15To18: z.coerce.number().min(0, "Ungültige Anzahl").default(0),
  kids18Above: z.coerce.number().min(0, "Ungültige Anzahl").default(0),
});
const varNames = schema.keyof().Values;

// TODO: empty input defaults to 0 - fill in 0? layout?

export const kidsCountStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>
          Wie viele Kinder leben mit Ihnen, für die Sie den Lebensunterhalt
          bezahlen?
        </h3>
        <Input
          name={varNames.kids6Below}
          label="0 - 6 Jahre"
          type="number"
          step="any" // decimals for partial custody
        />
        <Input
          name={varNames.kids7To14}
          label="7 - 14 Jahre"
          type="number"
          step="any"
        />
        <Input
          name={varNames.kids15To18}
          label="15 - 18 Jahre"
          type="number"
          step="any"
        />
        <Input
          name={varNames.kids18Above}
          label="Über 18 Jahre"
          type="number"
          step="any"
        />
      </div>
    );
  },
};
