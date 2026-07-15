import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type NachlassErbscheinAnfragePages } from "../pages";

export const antragstellendePersonFlowConfig = {
  antragstellendePersonName: "antragstellendePersonGeburtsdatumOrt",
  antragstellendePersonGeburtsdatumOrt:
    "antragstellendePersonStaatsangehoerigkeit",
  antragstellendePersonStaatsangehoerigkeit:
    "antragstellendePersonZweiteStaatsangehoerigkeitFrage",
  antragstellendePersonZweiteStaatsangehoerigkeitFrage: [
    {
      guard: (data) => data.antragstellendePersonHasSecondNationality === "yes",
      target: "antragstellendePersonZweiteStaatsangehoerigkeit",
    },
    { target: "antragstellendePersonAnschrift" },
  ],
  antragstellendePersonZweiteStaatsangehoerigkeit:
    "antragstellendePersonDritteStaatsangehoerigkeitFrage",
  antragstellendePersonDritteStaatsangehoerigkeitFrage: [
    {
      guard: (data) => data.antragstellendePersonHasThirdNationality === "yes",
      target: "antragstellendePersonDritteStaatsangehoerigkeit",
    },
    { target: "antragstellendePersonAnschrift" },
  ],
  antragstellendePersonDritteStaatsangehoerigkeit:
    "antragstellendePersonAnschrift",
  antragstellendePersonAnschrift: "antragstellendePersonKontaktdaten",
  antragstellendePersonKontaktdaten: "testamentArt",
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
