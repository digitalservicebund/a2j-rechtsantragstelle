import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import { arrayIsNonEmpty } from "~/util/array";

export const kinderFlowConfig = {
  kinderFrage: [
    {
      guard: (context) => context.hasKinder === "yes",
      target: "kinderUebersicht",
    },
    { target: "andereUnterhaltszahlungenFrage" },
  ],
  kinderUebersicht: [
    {
      type: "addArrayItem",
      target: "name",
    },
    {
      guard: (context) =>
        context.hasKinder === "yes" && !arrayIsNonEmpty(context.kinder),
      target: "kinderWarnung",
    },
    { target: "andereUnterhaltszahlungenFrage" },
  ],
  kinderWarnung: "andereUnterhaltszahlungenFrage",
  kinder: [
    
  ],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
