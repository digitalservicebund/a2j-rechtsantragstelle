import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

type NachlassErbausschlagungAnfrageDaten =
  GenericGuard<NachlassErbausschlagungAnfrageUserData>;

const hasFilledAusschlagendePerson: NachlassErbausschlagungAnfrageDaten = ({
  context,
}) => {
  return (
    context.pageData?.subflowDoneStates?.["/ausschlagende-person"] === true
  );
};

export const ausschlagendePersonXStateConfig = {
  id: "ausschlagende-person",
  initial: stepIds.awarenessDate.relative,
  states: {
    [stepIds.awarenessDate.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              context.verstorbeneLebensmittelpunkt === "ausland",
            target: stepIds.verstorbeneAuslaendischeAdresse.absolute,
          },
          stepIds.verstorbeneAdresse.absolute,
        ],
        SUBMIT: {
          guard: ({ context }) =>
            objectKeysNonEmpty(context.awarenessDate, ["day", "month", "year"]),
          target: stepIds.ausschlagendePersonName.relative,
        },
      },
    },
    [stepIds.ausschlagendePersonName.relative]: {
      on: {
        BACK: stepIds.awarenessDate.relative,
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
        SUBMIT: {
          target: "#kinder",
          guard: hasFilledAusschlagendePerson,
        },
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
