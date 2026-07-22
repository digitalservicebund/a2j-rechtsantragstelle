import { angehoerigeArray } from "~/domains/nachlass/erbschein/anfrage/angehoerige/pages";
import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";

export const angehoerigeFlowConfig = {
  angehoerigeOverview: [
    { type: "addArrayItem", target: "angehoerigeName" },
    {
      guard: (data) => angehoerigeArray.safeParse(data.angehoerige).success,
      target: "grundbesitz",
    },
  ],
  angehoerigeName: "angehoerigeBirthday",
  angehoerigeBirthday: "angehoerigeIsAlive",
  angehoerigeIsAlive: [
    {
      guard: (data) => {
        const arrayIndex = firstArrayIndex(data.pageData);
        if (arrayIndex === undefined) return false;
        const aliveStatus = data.angehoerige?.at(arrayIndex)?.isAlive;
        return (
          aliveStatus === "yes" || aliveStatus === "noButAliveWhenErblasserDied"
        );
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
