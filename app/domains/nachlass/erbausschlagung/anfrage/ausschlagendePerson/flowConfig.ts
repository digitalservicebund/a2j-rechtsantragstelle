import { NachlassErbausschlagungAnfragePages } from "../pages";
import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { GenericGuard } from "~/domains/guards.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type NachlassErbausschlagungAnfrageDaten =
  GenericGuard<NachlassErbausschlagungAnfrageUserData>;

const hasFilledAusschlagendePerson: NachlassErbausschlagungAnfrageDaten = ({
  context,
}) => {
  return (
    context.pageData?.subflowDoneStates?.["/ausschlagende-person"] === true
  );
};

export const ausschlagendePersonFlowConfig = {
  awarenessDate: [
    {
      guard: (data) =>
        objectKeysNonEmpty(data.awarenessDate, ["day", "month", "year"]),
      target: "ausschlagendePersonName",
    },
  ],
  ausschlagendePersonName: "ausschlagendePersonPlz",
  ausschlagendePersonPlz: "ausschlagendePersonAdresse",
  ausschlagendePersonAdresse: "ausschlagendePersonContact",
  ausschlagendePersonContact: "ausschlagendePersonBirthday",
  ausschlagendePersonBirthday: "ausschlagendePersonRelationToErblasser",
  ausschlagendePersonRelationToErblasser: [
    {
      guard: (data) => hasFilledAusschlagendePerson({ context: data }),
      target: "kinderHasKid",
    },
  ],
} satisfies Partial<TransitionConfigMap<NachlassErbausschlagungAnfragePages>>;
