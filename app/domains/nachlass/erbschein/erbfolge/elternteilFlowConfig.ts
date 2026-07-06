import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type NachlassErbfolgePages } from "./pages";

export const elternteilFlowConfig = {
  elternteilDaten: [
    {
      target: "elternteilHatteKinder",
      guard: ({ elternteile, pageData: { arrayIndexes } }) => {
        if (!elternteile || !arrayIndexes || arrayIndexes.length < 1)
          return false;
        if (elternteile.length <= arrayIndexes[0]) return false;
        return elternteile[arrayIndexes[0]].isAlive === "no";
      },
    },
    { target: "elternteilSummary", guard: () => true },
  ],
  elternteilHatteKinder: [
    {
      target: "elternteilKinderAnzahl",
      guard: ({ elternteile, pageData: { arrayIndexes } }) => {
        if (!elternteile || !arrayIndexes || arrayIndexes.length < 1)
          return false;
        if (elternteile.length <= arrayIndexes[0]) return false;
        const el = elternteile[arrayIndexes[0]];
        if (el.isAlive !== "no") return false;
        return el.hatteKinder === "yes";
      },
    },
    { target: "elternteilSummary", guard: () => true },
  ],
  elternteilKinderAnzahl: [
    { target: "elternteilKindDaten", type: "addArrayItem" },
    { target: "elternteilSummary" },
  ],
  elternteilKindDaten: [
    {
      target: "elternteilKindHatteKinder",
      guard: ({ elternteile, pageData: { arrayIndexes } }) => {
        if (!elternteile || !arrayIndexes || arrayIndexes.length < 2)
          return false;
        const el = elternteile[arrayIndexes[0]];
        if (el.isAlive !== "no" || el.hatteKinder !== "yes") return false;
        if (!el.kinder || el.kinder.length <= arrayIndexes[1]) return false;
        return el.kinder[arrayIndexes[1]].isAlive === "no";
      },
    },
    { target: "elternteilSummary", guard: () => true },
  ],
  elternteilKindHatteKinder: [
    {
      target: "elternteilKindKinderAnzahl",
      guard: ({ elternteile, pageData: { arrayIndexes } }) => {
        if (!elternteile || !arrayIndexes || arrayIndexes.length < 2)
          return false;
        const el = elternteile[arrayIndexes[0]];
        if (el.isAlive !== "no" || el.hatteKinder !== "yes") return false;
        if (!el.kinder || el.kinder.length <= arrayIndexes[1]) return false;
        const kind = el.kinder[arrayIndexes[1]];
        if (kind.isAlive !== "no") return false;
        return kind.hatteKinder === "yes";
      },
    },
    { target: "elternteilSummary", guard: () => true },
  ],
  elternteilKindKinderAnzahl: [
    { target: "elternteilKindKindDaten", type: "addArrayItem" },
    { target: "elternteilSummary" },
  ],
  elternteilKindKindDaten: "elternteilKindKinderAnzahl",

} satisfies Partial<TransitionConfigMap<NachlassErbfolgePages>>;
