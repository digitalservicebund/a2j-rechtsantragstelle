import {
  CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { pkhFormularVereinfachteErklaerungPages } from "./pages";
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import {
  childLivesSeparately,
  frageVermoegen,
  hasEinnahmen,
  hasEinnahmenAndEmptyArray,
  hasVermoegen,
  hasVermoegenAndEmptyArray,
  unterhaltsOrAbstammungssachen,
  vermoegenUnder10000,
} from "./guards";

export const vereinfachteErklaerungFlowConfig = compileFlow({
  pages: pkhFormularVereinfachteErklaerungPages,
  initialStep: "kind",
  transitions: {
    kind: "zusammenleben",
    zusammenleben: [
      {
        guard: (context) => childLivesSeparately({ context }),
        target: "veUnterhalt",
      },
      { target: "minderjaehrig" },
    ],
    veUnterhalt: "minderjaehrig",
    minderjaehrig: "veGeburtsdatum",
    veGeburtsdatum: "worumGehts",
    worumGehts: [
      {
        guard: (context) => unterhaltsOrAbstammungssachen({ context }),
        target: "rechtlichesThema",
      },
      { target: "einnahmen" },
    ],
    rechtlichesThema: "einnahmen",
    einnahmenFrage: [
      {
        guard: (data) => hasEinnahmen({ context: data }),
        target: "einnahmenValue",
      },
      {
        guard: (data) => frageVermoegen({ context: data }),
        target: "vermoegenFrage",
      },
      {
        target: "hinweisWeiteresFormular",
      },
    ],

    einnahmenValue: "einnahmenUebersicht",

    einnahmenUebersicht: [
      {
        type: "addArrayItem",
        target: "einnahme",
      },
      {
        guard: (data) => hasEinnahmenAndEmptyArray({ context: data }),
        target: "einnahmenWarnung",
      },
      {
        guard: (data) => frageVermoegen({ context: data }),
        target: "vermoegenFrage",
      },
      {
        target: "hinweisWeiteresFormular",
      },
    ],

    einnahme: "einnahmenUebersicht",

    einnahmenWarnung: [
      {
        guard: (data) => frageVermoegen({ context: data }),
        target: "vermoegenFrage",
      },
      {
        target: "hinweisWeiteresFormular",
      },
    ],

    vermoegenFrage: [
      {
        guard: (data) => hasVermoegen({ context: data }),
        target: "vermoegenValue",
      },
      {
        target: "hinweisVereinfachteErklaerung",
      },
    ],

    vermoegenValue: [
      {
        guard: (data) => vermoegenUnder10000({ context: data }),
        target: "vermoegenUebersicht",
      },
      {
        target: "hinweisWeiteresFormular",
      },
    ],

    vermoegenUebersicht: [
      {
        type: "addArrayItem",
        target: "vermoegenEintrag",
      },
      {
        guard: (data) => hasVermoegenAndEmptyArray({ context: data }),
        target: "vermoegenWarnung",
      },
      {
        target: "hinweisVereinfachteErklaerung",
      },
    ],
    vermoegenEintrag: "vermoegenUebersicht",
    vermoegenWarnung: "hinweisVereinfachteErklaerung",
    hinweisWeiteresFormular: null,
    hinweisVereinfachteErklaerung: null,
    einnahmen: null,
    vermoegen: null,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
