import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../../pages";
import {
  frageVermoegen,
  hasEinnahmen,
  hasEinnahmenAndEmptyArray,
  hasVermoegen,
  hasVermoegenAndEmptyArray,
  unterhaltsOrAbstammungssachen,
  vermoegenUnder10000,
} from "./guards";

export const vereinfachteErklaerungFlowConfig = {
  kind: "zusammenleben",
  zusammenleben: [
    {
      guard: (context) => context.livesTogether === "no",
      target: "veUnterhalt",
    },
    {
      target: "minderjaehrig",
    },
  ],
  veUnterhalt: "minderjaehrig",
  minderjaehrig: "veGeburtsdatum",
  veGeburtsdatum: "worumGehts",
  worumGehts: [
    {
      guard: (context) => unterhaltsOrAbstammungssachen({ context }),
      target: "rechtlichesThema",
    },
    { target: "einnahmenFrage" },
  ],
  rechtlichesThema: "einnahmenFrage",
  einnahmen: "einnahmenFrage",
  einnahmenFrage: [
    {
      guard: (context) => hasEinnahmen({ context }),
      target: "einnahmenValue",
    },
    {
      guard: (context) => frageVermoegen({ context }),
      target: "vermoegen",
    },
    { target: "hinweisWeiteresFormular" },
  ],
  einnahmenValue: "einnahmenUebersicht",
  einnahmenUebersicht: [
    { type: "addArrayItem", target: "einnahme" },
    {
      guard: (context) => hasEinnahmenAndEmptyArray({ context }),
      target: "einnahmenWarnung",
    },
    {
      guard: (context) => frageVermoegen({ context }),
      target: "vermoegenFrage",
    },
    { target: "hinweisWeiteresFormular" },
  ],
  einnahme: "einnahmenUebersicht",
  einnahmenWarnung: [
    {
      guard: (context) => frageVermoegen({ context }),
      target: "vermoegenFrage",
    },
    { target: "hinweisWeiteresFormular" },
  ],
  vermoegen: "vermoegenFrage",
  vermoegenFrage: [
    {
      guard: (context) => hasVermoegen({ context }),
      target: "vermoegenValue",
    },
    { target: "hinweisVereinfachteErklaerung" },
  ],
  vermoegenValue: [
    {
      guard: (context) => vermoegenUnder10000({ context }),
      target: "vermoegenUebersicht",
    },
    { target: "hinweisWeiteresFormular" },
  ],
  vermoegenUebersicht: [
    { type: "addArrayItem", target: "vermoegenEintrag" },
    {
      guard: (context) => hasVermoegenAndEmptyArray({ context }),
      target: "vermoegenWarnung",
    },
    { target: "hinweisVereinfachteErklaerung" },
  ],
  vermoegenEintrag: "vermoegenUebersicht",
  vermoegenWarnung: "hinweisVereinfachteErklaerung",
  hinweisWeiteresFormular: "unterhaltsanspruch",
  hinweisVereinfachteErklaerung: "unterhaltsanspruch",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
