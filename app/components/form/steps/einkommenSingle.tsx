import { z } from "zod";
import { Input } from "~/components";

const schema = z.object({
  einkommenSingle: z.coerce.number().min(0, "Ungültiges Einkommen"),
});

export const einkommenSingleStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wie hoch ist Ihr monatliches Netto-Einkommen?</h3>
        <p>
          Es zählt Ihr Einkommen und alle sozialen Unterstützungen wie
          Kindergeld, Wohngeld oder private Zuschüsse.
        </p>
        <p>Wie viel Geld landet jeden Monat auf Ihrem Konto?</p>
        <p>
          <a href=".">Was ist das Netto-Einkommen?</a>
        </p>
        <Input
          name={schema.keyof().Values.einkommenSingle}
          type="number"
          label="Netto Einkommen"
        />
      </div>
    );
  },
};
