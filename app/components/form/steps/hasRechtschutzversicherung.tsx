import type { StepInterface } from "../steps";
import { z } from "zod";
import { Select } from "~/components";

export const RechtSchutzVersicherungStep: StepInterface = {
  schema: z.object({
    hasRechtschutzversicherung: z.coerce.boolean(),
  }),
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Rechtschutzversicherung</h3>
        <Select
          name="hasRechtschutzversicherung"
          label="Hast du eine Rechtsschutzversicherung?"
          options={[
            { text: "Nein", value: "" }, // empty string is the only falsy string
            { text: "Ja", value: "true" },
          ]}
        />
      </div>
    );
  },
};
