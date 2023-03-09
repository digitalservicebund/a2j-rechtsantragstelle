import { z } from "zod";
import { Input } from "~/components";

// TODO: Should this be the same income as einkommenSingle?
const schema = z.object({
  einkommenFamilie: z.coerce.number().min(0, "Ungültiges Einkommen"),
});
const varNames = schema.keyof().Values;

export const einkommenPartnerStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wie hoch ist Ihr monatliches Netto-Einkommen als Familie?</h3>
        <p>
          Es zählt Ihr eigenes Einkommen, das Einkommen ihres Partners, sowie
          alle sozialen Unterstützungen wie Kindergeld, Wohngeld oder private
          Zuschüsse.
        </p>
        <p>Wie viel Geld landet jeden Monat auf Ihrem Konto?</p>
        <p>
          <a href=".">Was ist das Netto-Einkommen?</a>
        </p>
        <Input
          name={varNames.einkommenFamilie}
          type="number"
          label="Netto Einkommen"
        />
      </div>
    );
  },
};
