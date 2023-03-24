import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ isPayingForKids: YesNoAnswer });

export const kidsStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>
          Haben Sie Kinder, die bei Ihnen leben, und für die Sie den Alltag
          bezahlen?
        </h3>
        <p>
          Das können Ihre eigenen Kinder sein, oder Kinder von jemand anderem,
          mit denen Sie zusammenleben.
        </p>
        <RadioGroup
          name={schema.keyof().Values.isPayingForKids}
          options={[
            { text: "Nein", value: YesNoAnswer.Enum.no },
            { text: "Ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
