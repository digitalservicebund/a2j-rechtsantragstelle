import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasTriedFreeServices: YesNoAnswer });

export const freeServicesStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>
          Haben Sie schon versucht, in dieser Angelegenheit eine andere
          kostenfreie Beratung zu finden?
        </h3>
        <p>
          Haben Sie z.B. bei einem Mieterverein, einem Sozialverband, einer
          Gewerkschaft, Schuldnerberatung, oder ähnlichen Organisation versucht,
          sich beraten zu lassen?
        </p>
        <RadioGroup
          name={schema.keyof().Values.hasTriedFreeServices}
          options={[
            { label: "Nein", value: YesNoAnswer.Enum.no },
            { label: "Ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
