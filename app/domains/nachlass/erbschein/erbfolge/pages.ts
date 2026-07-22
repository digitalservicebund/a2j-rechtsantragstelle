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
  verstorbenePerson: {
    stepId: "/verstorbenePerson",
    pageSchema: { name: stringRequiredSchema },
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
    pageSchema: { ehepartnerName: stringRequiredSchema },
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
  ergebnis: {
    stepId: "/ergebnis/erbfolge",
  },
  nichtErmitteltWeitereGenerationen: {
    stepId: "/ergebnis/erbfolge-nicht-ermittelt-weitere-generationen",
  },
  nichtErmitteltWeitereOrdnungen: {
    stepId: "/ergebnis/erbfolge-nicht-ermittelt-weitere-ordnungen",
  },
} as const;

export const nachlassErbfolgePages = {
  ...topLevelPages,
  ...kinderPages,
  ...elternteilePages,
} as const;

export type NachlassErbfolgePages = typeof nachlassErbfolgePages;
