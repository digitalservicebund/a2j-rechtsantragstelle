import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type NachlassErbfolgePages } from "./pages";

export const kinderFlowConfig = {
  kind1Summary: [
    { target: "kind1Daten", type: "addArrayItem" },
    { target: null },
  ],
  kind1Daten: "kind1Enkelkinder",
  kind1Enkelkinder: [
    {
      target: "kind1EnkelkinderAnzahl",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 1) return false;
        if (kinder.length <= arrayIndexes[0]) return false;
        return kinder[arrayIndexes[0]].hatteKinder === "yes";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind1EnkelkinderAnzahl: "kind2Summary",
  kind2Summary: [
    { target: "kind2Daten", type: "addArrayItem" },
    { target: "kind1Summary" },
  ],
  kind2Daten: [
    {
      target: "kind3Summary",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 2) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (!("kinder" in kind1) || kind1.kinder.length <= arrayIndexes[1]) return false;
        return kind1.kinder[arrayIndexes[1]].isAlive === "yes";
      },
    },
    { target: "kind2Summary", guard: () => true },
  ],
  kind3Summary: [
    { target: "kind3Daten", type: "addArrayItem" },
    { target: "kind2Summary" },
  ],
  kind3Daten: [
    {
      target: "kind4Summary",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 3) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (!("kinder" in kind1)) return false;
        const kind2 = kind1.kinder[arrayIndexes[1]];
        if (!("kinder" in kind2) || kind2.kinder.length <= arrayIndexes[2]) return false;
        return kind2.kinder[arrayIndexes[2]].isAlive === "yes";
      },
    },
    { target: "kind3Summary", guard: () => true },
  ],
  kind4Summary: [
    { target: "kind4Daten", type: "addArrayItem" },
    { target: "kind3Summary" },
  ],
  kind4Daten: [
    {
      target: "kind5Summary",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 4) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (!("kinder" in kind1)) return false;
        const kind2 = kind1.kinder[arrayIndexes[1]];
        if (!("kinder" in kind2)) return false;
        const kind3 = kind2.kinder[arrayIndexes[2]];
        if (!("kinder" in kind3) || kind3.kinder.length <= arrayIndexes[3]) return false;
        return kind3.kinder[arrayIndexes[3]].isAlive === "yes";
      },
    },
    { target: "kind4Summary", guard: () => true },
  ],
  kind5Summary: [
    { target: "kind5Daten", type: "addArrayItem" },
    { target: "kind4Summary" },
  ],
  kind5Daten: "kind5Summary",
} satisfies Partial<TransitionConfigMap<NachlassErbfolgePages>>;
