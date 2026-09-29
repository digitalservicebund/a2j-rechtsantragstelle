import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../../pages";
import {
  hasWeitereUnterhaltszahlungenYes,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
} from "../guards";

export const andereUnterhaltszahlungenFlowConfig = {
  andereUnterhaltszahlungenFrage: [
    {
      guard: (context) => hasWeitereUnterhaltszahlungenYes({ context }),
      target: "andereUnterhaltszahlungenUebersicht",
    },
    { target: "wohnsituation" },
  ],
  andereUnterhaltszahlungenUebersicht: [
    { type: "addArrayItem", target: "andereUnterhaltszahlungenPerson" },
    {
      guard: (context) =>
        hasWeitereUnterhaltszahlungenYesAndEmptyArray({ context }),
      target: "andereUnterhaltszahlungenWarnung",
    },
    { target: "wohnsituation" },
  ],
  andereUnterhaltszahlungenWarnung: "wohnsituation",
  andereUnterhaltszahlungenPerson: "andereUnterhaltszahlungenUebersicht",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
