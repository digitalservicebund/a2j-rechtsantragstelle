import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

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
              context.letterReceivedFromNachlassgericht === "yes" ||
              context.testament === "erbvertrag" ||
              context.testament === "notarized",
            target: stepIds.letterReceivedFromCourt.absolute,
          },
          stepIds.awarenessDate.absolute,
        ],
        SUBMIT: stepIds.ausschlagendePersonPlz.relative,
      },
    },
    [stepIds.ausschlagendePersonPlz.relative]: {
      on: {
        BACK: stepIds.ausschlagendePersonName.relative,
        SUBMIT: stepIds.ausschlagendePersonAdresse.relative,
      },
    },
    [stepIds.ausschlagendePersonAdresse.relative]: {
      on: {
        BACK: stepIds.ausschlagendePersonPlz.relative,
        SUBMIT: stepIds.ausschlagendePersonContact.relative,
      },
    },
    [stepIds.ausschlagendePersonContact.relative]: {
      on: {
        BACK: stepIds.ausschlagendePersonAdresse.relative,
        SUBMIT: stepIds.ausschlagendePersonBirthday.relative,
      },
    },
    [stepIds.ausschlagendePersonBirthday.relative]: {
      on: {
        BACK: stepIds.ausschlagendePersonContact.relative,
        SUBMIT: stepIds.ausschlagendePersonRelationToErblasser.relative,
      },
    },
    [stepIds.ausschlagendePersonRelationToErblasser.relative]: {
      on: {
        BACK: stepIds.ausschlagendePersonBirthday.relative,
        SUBMIT: stepIds.kinderHasKid.absolute,
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
