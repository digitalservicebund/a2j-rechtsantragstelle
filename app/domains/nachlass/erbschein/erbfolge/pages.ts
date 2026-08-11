import { z } from "zod";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { elternteilePages } from "./elternteilePages";
import { kinderPages } from "./kinderPages";

export type { Kind } from "./kinderPages";
export type { Elternteil } from "./elternteilePages";

const gueterstandSchema = z.enum([
  "communityOfAcquisitions",
  "separationOfProperty",
  "communityOfProperty",
  "other",
  "unknown",
]);
export type Gueterstand = z.infer<typeof gueterstandSchema>;

const topLevelPages = {
  start: { stepId: "/start" },
  testamentOderErbvertrag: {
    stepId: "/testamentOderErbvertrag",
    pageSchema: {
      testamentArt: z.enum(["none", "handwritten", "notarized", "erbvertrag"]),
    },
  },
  verstorbenePerson: {
    stepId: "/verstorbenePerson",
    pageSchema: {
      verstorbeneVorname: stringRequiredSchema,
      verstorbeneNachname: stringRequiredSchema,
    },
  },
  familienstand: {
    stepId: "/familienstand",
    pageSchema: {
      familienstand: z.enum([
        "ledig",
        "verheiratet",
        "geschieden",
        "verwitwet",
      ]),
    },
  },
  ehepartner: {
    stepId: "/ehepartner",
    pageSchema: {
      ehepartnerVorname: stringRequiredSchema,
      ehepartnerNachname: stringRequiredSchema,
    },
  },
  ehepartnerStaatsangehoerigkeit: {
    stepId: "/ehepartnerStaatsangehoerigkeit",
    pageSchema: {
      ehepartnerStaatsangehoerigkeit: z.enum([
        "nurDeutsch",
        "deutschUndWeitere",
        "keineDeutsch",
      ]),
    },
  },
  auslandsbezug: {
    stepId: "/ergebnis/auslandsbezug",
  },
  inDeutschlandGeheiratet: {
    stepId: "/inDeutschlandGeheiratet",
    pageSchema: { inDeutschlandGeheiratet: YesNoAnswer },
  },
  ehevertrag: {
    stepId: "/ehevertrag",
    pageSchema: {
      ehevertrag: z.enum(["yes", "no", "unknown"]),
    },
  },
  gueterstand: {
    stepId: "/gueterstand",
    pageSchema: {
      gueterstand: gueterstandSchema,
    },
  },
  grosseltern: {
    stepId: "/grosseltern",
    pageSchema: {
      grosselternLeben: YesNoAnswer,
    },
  },
  ergebnis: {
    stepId: "/ergebnis/erbfolge",
  },
  nichtErmitteltWeitereGenerationen: {
    stepId: "/ergebnis/erbfolge-nicht-ermittelt-weitere-generationen",
  },
  nichtErmitteltWeitereOrdnungen: {
    stepId: "/ergebnis/erbfolge-nicht-ermittelt-weitere-ordnungen",
  },
  kinderFehlen: {
    stepId: "/kinder-fehlen",
  },
  keineGesetzlicheErbfolge: {
    stepId: "/ergebnis/keine-gesetzliche-erbfolge",
  },
} as const;

export const nachlassErbfolgePages = {
  ...topLevelPages,
  ...kinderPages,
  ...elternteilePages,
} as const;

export type NachlassErbfolgePages = typeof nachlassErbfolgePages;
