import type { StepInterface } from "../steps";
import { z } from "zod";
import { Select } from "~/components";

export const HamburgOderBremenStep: StepInterface = {
  schema: z.object({
    isHamburgOderBremen: z.coerce.boolean(),
  }),
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wohnort</h3>
        <Select
          name="isHamburgOderBremen"
          label="Wohnst du in Hamburg oder Bremen?"
          options={[
            { text: "Nein", value: "" },
            { text: "Ja", value: "true" },
          ]}
        />
      </div>
    );
  },
};
