import type { StepInterface } from "../steps";
import { z } from "zod";
import { Select } from "~/components";

export const KlageEingereichtStep: StepInterface = {
  schema: z.object({
    hasKlageEingereicht: z.coerce.boolean(),
  }),
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Klage eingereicht</h3>
        <Select
          name="hasKlageEingereicht"
          label="Wurde bereits Klage eingereicht?"
          options={[
            { text: "Nein", value: "" },
            { text: "Ja", value: "true" },
          ]}
        />
      </div>
    );
  },
};
