import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../pages";

export const rechtsproblemFlowConfig = {
  rechtsproblemStart: "bereich",
  bereich: "situationBeschreibung",
  situationBeschreibung: "einkommenStart",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
