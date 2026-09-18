import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../../pages";
import { hasAusgabenYesAndEmptyArray, hasZahlungsfristYes } from "../guards";

export const regelmaessigeAusgabenFlowConfig = {
  ausgabenFrage: [
    {
      guard: (context) => context.hasAusgaben === "yes",
      target: "ausgabenUebersicht",
    },
    { target: "ausgabenSituation" },
  ],
  ausgabenUebersicht: [
    { type: "addArrayItem", target: "ausgabenArt" },
    {
      guard: (context) => hasAusgabenYesAndEmptyArray({ context }),
      target: "ausgabenWarnung",
    },
    { target: "ausgabenSituation" },
  ],
  ausgabenWarnung: "ausgabenSituation",
  ausgabenSituation: "persoenlicheDatenStart",
  ausgabenArt: "ausgabenZahlungsinformation",
  ausgabenZahlungsinformation: "ausgabenLaufzeit",
  ausgabenLaufzeit: [
    {
      guard: (context) => hasZahlungsfristYes({ context }),
      target: "ausgabenZahlungsfrist",
    },
    { target: "ausgabenUebersicht" },
  ],
  ausgabenZahlungsfrist: "ausgabenUebersicht",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
