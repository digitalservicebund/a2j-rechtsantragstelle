import type { StepInterface } from "../StepInterface";
import { z } from "zod";
import { Input } from "~/components";

export const Step: StepInterface = {
  schema: z.object({
    age: z.coerce
      .number()
      .min(1, "Ungültiges Alter.")
      .max(150, "So alt kann aber echt niemand sein"),
  }),
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Age step header</h3>
        <p>Age step description paragraph</p>
        <Input name="age" label="Age" type="number" />
      </div>
    );
  },
};
