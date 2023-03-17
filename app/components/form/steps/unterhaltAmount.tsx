import { z } from "zod";
import { Input } from "~/components";

const schema = z.object({
  unterhalt: z.coerce.number().min(0, "Ungültige Summe"),
});

export const unterhaltAmountStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wie viel Unterhalt zahlen Sie pro Monat?</h3>
        <p>
          Falls Sie für mehrere Personen Unterhalt zahlen, geben Sie die Summe
          an.
        </p>
        <Input
          name={schema.keyof().Values.unterhalt}
          type="number"
          step="any"
          label="Summe Unterhaltszahlungen"
        />
      </div>
    );
  },
};
