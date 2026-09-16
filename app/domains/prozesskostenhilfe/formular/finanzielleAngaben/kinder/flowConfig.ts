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
      target: "kindName",
    },
    {
      guard: (context) =>
        context.hasKinder === "yes" && !arrayIsNonEmpty(context.kinder),
      target: "kinderWarnung",
    },
    { target: "andereUnterhaltszahlungenFrage" },
  ],
  kinderWarnung: "andereUnterhaltszahlungenFrage",
  kindName: "kindWohnort",
  kindWohnort: [
    {
      guard: (context) => kindWohnortBeiAntragstellerYes({ context }),
      target: "kindEigeneEinnahmenFrage",
    },
    {
      guard: (context) => kindWohnortBeiAntragstellerNo({ context }),
      target: "kindUnterhaltFrage",
    },
  ],
  kindEigeneEinnahmenFrage: [
    {
      guard: (context) => kindEigeneEinnahmenYes({ context }),
      target: "kindEigeneEinnahmen",
    },
    { target: "kinderUebersicht" },
  ],
  kindEigeneEinnahmen: "kinderUebersicht",
  kindUnterhaltFrage: [
    {
      guard: (context) => kindUnterhaltYes({ context }),
      target: "kindUnterhalt",
    },
    {
      guard: (context) => kindUnterhaltNo({ context }),
      target: "kindUnterhaltEnde",
    },
  ],
  kindUnterhalt: "kinderUebersicht",
  kindUnterhaltEnde: null,
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
