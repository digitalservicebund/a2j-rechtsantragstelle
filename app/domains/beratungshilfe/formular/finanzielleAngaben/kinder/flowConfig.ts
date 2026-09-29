import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../../pages";
import {
  hasKinderYesAndEmptyArray,
  kindEigeneEinnahmenYes,
  kindUnterhaltNo,
  kindUnterhaltYes,
  kindWohnortBeiAntragstellerNo,
  kindWohnortBeiAntragstellerYes,
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
    { type: "addArrayItem", target: "kinderName" },
    {
      guard: (context) => hasKinderYesAndEmptyArray({ context }),
      target: "kinderWarnung",
    },
    { target: "andereUnterhaltszahlungenFrage" },
  ],
  kinderWarnung: "andereUnterhaltszahlungenFrage",
  kinderName: "kinderWohnort",
  kinderWohnort: [
    {
      guard: (context) => kindWohnortBeiAntragstellerYes({ context }),
      target: "kinderEigeneEinnahmenFrage",
    },
    {
      guard: (context) => kindWohnortBeiAntragstellerNo({ context }),
      target: "kinderUnterhaltFrage",
    },
    { target: "kinderUebersicht" },
  ],
  kinderEigeneEinnahmenFrage: [
    {
      guard: (context) => kindEigeneEinnahmenYes({ context }),
      target: "kinderEigeneEinnahmen",
    },
    { target: "kinderUebersicht" },
  ],
  kinderEigeneEinnahmen: "kinderUebersicht",
  kinderUnterhaltFrage: [
    {
      guard: (context) => kindUnterhaltYes({ context }),
      target: "kinderUnterhalt",
    },
    {
      guard: (context) => kindUnterhaltNo({ context }),
      target: "kinderUnterhaltEnde",
    },
    { target: "kinderUebersicht" },
  ],
  kinderUnterhalt: "kinderUebersicht",
  kinderUnterhaltEnde: "kinderUebersicht",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
