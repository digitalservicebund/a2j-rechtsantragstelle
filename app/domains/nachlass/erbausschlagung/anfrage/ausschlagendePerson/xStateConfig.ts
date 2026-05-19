import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

export const ausschlagendePersonXStateConfig = {
  id: "ausschlagende-person",
  initial: stepIds.ausschlagendePersonName.relative,
  states: {
    [stepIds.ausschlagendePersonName.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              objectKeysNonEmpty(context.dateOfReceipt, [
                "day",
                "month",
                "year",
              ]),
            target: stepIds.letterReceivedFromCourt.absolute,
          },
          stepIds.awarenessDate.absolute,
        ],
        SUBMIT: "",
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
