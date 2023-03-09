import { z } from "zod";
import { RadioGroup } from "~/components";

export const vermoegenOptions = z.enum(["below_10k", "above_10k", "unknown"]);
export type VermoegenOptions = z.infer<typeof vermoegenOptions>;
const schema = z.object({ vermoegen: vermoegenOptions });
const varNames = schema.keyof().Values;

export const vermoegenStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wie viel sind Ihre Ersparnisse und Wertgegenstände wert?</h3>
        <p>
          Vermögen ist das Geld, dass Sie auf dem Konto haben. Es kann auch Geld
          aus Bausparkonten, Wertpapieren, oder Lebensversicherungen dazu
          zählen. Auch Wertgegestände wie z.B. Grundeigentum oder ein teueres
          Auto gelten als Vermögen.
        </p>
        <p>
          <a href=".">Was gilt genau als Vermögen oder Wertgegenstand?</a>
        </p>
        <RadioGroup
          name={varNames.vermoegen}
          options={[
            {
              label: "weniger als 10.000 €",
              value: vermoegenOptions.Enum.below_10k,
            },
            {
              label: "mehr als 10.000 €",
              value: vermoegenOptions.Enum.above_10k,
            },
            {
              label: "Ich weiß es nicht",
              value: vermoegenOptions.Enum.unknown,
            },
          ]}
        />
      </div>
    );
  },
};
