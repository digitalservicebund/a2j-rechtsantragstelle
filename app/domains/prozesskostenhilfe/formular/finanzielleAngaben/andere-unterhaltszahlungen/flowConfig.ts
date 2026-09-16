import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import { hasWeitereUnterhaltszahlungenYesAndEmptyArray } from "../guards";

export const andereUnterhaltszahlungenFlowConfig = {
  andereUnterhaltszahlungenFrage: [
    {
      guard: (context) => context.hasWeitereUnterhaltszahlungen === "yes",
      target: "andereUnterhaltszahlungenUebersicht",
    },
    { target: "wohnungAlleineZusammen" },
  ],
  andereUnterhaltszahlungenUebersicht: [
    {
      type: "addArrayItem",
      target: "andereUnterhaltszahlungenPerson",
    },
    {
      guard: (context) =>
        hasWeitereUnterhaltszahlungenYesAndEmptyArray({ context }),
      target: "andereUnterhaltszahlungenWarnung",
    },
    { target: "wohnungAlleineZusammen" },
  ],
  andereUnterhaltszahlungenWarnung: "wohnungAlleineZusammen",
  andereUnterhaltszahlungenPerson: "andereUnterhaltszahlungenUebersicht",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
