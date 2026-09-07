import {
  compileFlow,
  CompiledFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./pages";
import { hasWeitereUnterhaltszahlungenYesAndEmptyArray } from "../guards";

export const finanzielleAngabenAndereUnterhaltszahlungenFlowConfig =
  compileFlow({
    pages: pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages,
    initialStep: "andereUnterhaltszahlungenFrage",
    transitions: {
      andereUnterhaltszahlungenFrage: [
        {
          guard: (data) => data.hasWeitereUnterhaltszahlungen === "yes",
          target: "andereUnterhaltszahlungenUebersicht",
        },
        { target: null },
      ],
      andereUnterhaltszahlungenUebersicht: [
        {
          guard: (data) =>
            hasWeitereUnterhaltszahlungenYesAndEmptyArray({ context: data }),
          target: "andereUnterhaltszahlungenWarnung",
        },
        {
          target: null,
        },
      ],
      andereUnterhaltszahlungenWarnung: null,
      andereUnterhaltszahlungenPerson: "andereUnterhaltszahlungenUebersicht",
    },
    pruningStrategy: "cascading",
  }) as CompiledFlow<PageConfigMap>;
