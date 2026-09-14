import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import { arrayIsNonEmpty } from "~/util/array";
import {
  kindEigeneEinnahmenYes,
  kindWohnortBeiAntragstellerNo,
  kindWohnortBeiAntragstellerYes,
  kindUnterhaltYes,
  kindUnterhaltNo,
} from "../guards";

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
  name: "wohnort",
  wohnort: [
    {
      guard: (context) => kindWohnortBeiAntragstellerYes({ context }),
      target: "kind-eigene-einnahmen-frage",
    },
    {
      guard: (context) => kindWohnortBeiAntragstellerNo({ context }),
      target: "kind-unterhalt-frage",
    },
  ],
  "kind-eigene-einnahmen-frage": [
    {
      guard: (context) => kindEigeneEinnahmenYes({ context }),
      target: "kind-eigene-einnahmen",
    },
    { target: "kinderUebersicht" },
  ],
  "kind-eigene-einnahmen": "kinderUebersicht",
  "kind-unterhalt-frage": [
    {
      guard: (context) => kindUnterhaltYes({ context }),
      target: "kind-unterhalt",
    },
    {
      guard: (context) => kindUnterhaltNo({ context }),
      target: "kind-unterhalt-ende",
    },
  ],
  "kind-unterhalt": "kinderUebersicht",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
