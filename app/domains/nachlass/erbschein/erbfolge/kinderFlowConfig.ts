import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type NachlassErbfolgePages } from "./pages";

export const kinderFlowConfig = {
  kind1Summary: [
    { target: "kind1Daten", type: "addArrayItem" },
    { target: "elternteile" },
  ],
  kind1Daten: [
    {
      target: "kind1HatteKinder",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 1) return false;
        if (kinder.length <= arrayIndexes[0]) return false;
        return kinder[arrayIndexes[0]].isAlive === "no";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind1HatteKinder: [
    {
      target: "kind1KinderAnzahl",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 1) return false;
        if (kinder.length <= arrayIndexes[0]) return false;
        const kind = kinder[arrayIndexes[0]];
        if (kind.isAlive !== "no") return false;
        return kind.hatteKinder === "yes";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
  kind1KinderAnzahl: "kind2Summary",
  kind2Summary: [
    { target: "kind2Daten", type: "addArrayItem" },
    { target: "kind1Summary" },
  ],
  kind2Daten: [
    {
      target: "kind2HatteKinder",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 2) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
        if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1]) return false;
        return kind1.kinder[arrayIndexes[1]].isAlive === "no";
      },
    },
    { target: "kind2Summary", guard: () => true },
  ],
  kind2HatteKinder: [
    {
      target: "kind2KinderAnzahl",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 2) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
        if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1]) return false;
        const kind2 = kind1.kinder[arrayIndexes[1]];
        if (kind2.isAlive !== "no") return false;
        return kind2.hatteKinder === "yes";
      },
    },
    { target: "kind2Summary", guard: () => true },
  ],
  kind2KinderAnzahl: "kind3Summary",
  kind3Summary: [
    { target: "kind3Daten", type: "addArrayItem" },
    { target: "kind2Summary" },
  ],
  kind3Daten: [
    {
      target: "kind3HatteKinder",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 3) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
        if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1]) return false;
        const kind2 = kind1.kinder[arrayIndexes[1]];
        if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
        if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2]) return false;
        return kind2.kinder[arrayIndexes[2]].isAlive === "no";
      },
    },
    { target: "kind3Summary", guard: () => true },
  ],
  kind3HatteKinder: [
    {
      target: "kind3KinderAnzahl",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 3) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
        if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1]) return false;
        const kind2 = kind1.kinder[arrayIndexes[1]];
        if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
        if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2]) return false;
        const kind3 = kind2.kinder[arrayIndexes[2]];
        if (kind3.isAlive !== "no") return false;
        return kind3.hatteKinder === "yes";
      },
    },
    { target: "kind3Summary", guard: () => true },
  ],
  kind3KinderAnzahl: "kind4Summary",
  kind4Summary: [
    { target: "kind4Daten", type: "addArrayItem" },
    { target: "kind3Summary" },
  ],
  kind4Daten: [
    {
      target: "kind4HatteKinder",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 4) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
        if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1]) return false;
        const kind2 = kind1.kinder[arrayIndexes[1]];
        if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
        if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2]) return false;
        const kind3 = kind2.kinder[arrayIndexes[2]];
        if (kind3.isAlive !== "no" || kind3.hatteKinder !== "yes") return false;
        if (!kind3.kinder || kind3.kinder.length <= arrayIndexes[3]) return false;
        return kind3.kinder[arrayIndexes[3]].isAlive === "no";
      },
    },
    { target: "kind4Summary", guard: () => true },
  ],
  kind4HatteKinder: [
    {
      target: "kind4KinderAnzahl",
      guard: ({ kinder, pageData: { arrayIndexes } }) => {
        if (!kinder || !arrayIndexes || arrayIndexes.length < 4) return false;
        const kind1 = kinder[arrayIndexes[0]];
        if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
        if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1]) return false;
        const kind2 = kind1.kinder[arrayIndexes[1]];
        if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
        if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2]) return false;
        const kind3 = kind2.kinder[arrayIndexes[2]];
        if (kind3.isAlive !== "no" || kind3.hatteKinder !== "yes") return false;
        if (!kind3.kinder || kind3.kinder.length <= arrayIndexes[3]) return false;
        const kind4 = kind3.kinder[arrayIndexes[3]];
        if (kind4.isAlive !== "no") return false;
        return kind4.hatteKinder === "yes";
      },
    },
    { target: "kind4Summary", guard: () => true },
  ],
  kind4KinderAnzahl: "kind5Summary",
  kind5Summary: [
    { target: "kind5Daten", type: "addArrayItem" },
    { target: "kind4Summary" },
  ],
  kind5Daten: "kind5Summary",
} satisfies Partial<TransitionConfigMap<NachlassErbfolgePages>>;
