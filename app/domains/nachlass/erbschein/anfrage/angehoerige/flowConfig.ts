import { elternteilFlowConfig } from "~/domains/nachlass/erbschein/anfrage/angehoerige/elternteil/elternteilFlowConfig";
import { kinderFlowConfig } from "~/domains/nachlass/erbschein/anfrage/angehoerige/kinder/kinderFlowConfig";
import { angehoerigeArray } from "~/domains/nachlass/erbschein/anfrage/angehoerige/pages";
import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";

export const angehoerigeFlowConfig = {
  ...kinderFlowConfig,
  ...elternteilFlowConfig,
  angehoerigeOverview: [
    { type: "addArrayItem", target: "angehoerigeName" },
    {
      guard: (data) => !angehoerigeArray.safeParse(data.angehoerige).success,
      target: "angehoerigeWarning",
    },
    {
      guard: (data) => angehoerigeArray.safeParse(data.angehoerige).success,
      target: "grundbesitz",
    },
  ],
  angehoerigeWarning: "angehoerigeOverview",
  angehoerigeName: "angehoerigeBirthday",
  angehoerigeBirthday: "angehoerigeIsAlive",
  angehoerigeIsAlive: [
    {
      guard: (data) => {
        const arrayIndex = firstArrayIndex(data.pageData);
        if (arrayIndex === undefined) return false;
        return data.angehoerige?.at(arrayIndex)?.isAlive === "yes";
      },
      target: "angehoerigeAddress",
    },
    {
      target: "angehoerigeSterbedatum",
    },
  ],
  angehoerigeAddress: "angehoerigeRelationship",
  angehoerigeRelationship: "angehoerigeOverview",
  angehoerigeSterbedatum: "angehoerigeOverview",
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
