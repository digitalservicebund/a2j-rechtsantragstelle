import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasRechtschutzversicherung: YesNoAnswer });
const varNames = schema.keyof().Values;

export const rechtSchutzVersicherungStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Haben Sie eine Rechtsschutzversicherung?</h3>
        <p>
          <a href=".">Was ist eine Rechtsschutzversicherung?</a>
        </p>
        <RadioGroup
          name={varNames.hasRechtschutzversicherung}
          options={[
            { label: "nein", value: YesNoAnswer.enum.no },
            { label: "ja", value: YesNoAnswer.enum.yes },
          ]}
        />
      </div>
    );
  },
};
