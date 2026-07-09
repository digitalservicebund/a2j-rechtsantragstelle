import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  datenFields,
  hatteKinderField,
  kinderAnzahlField,
  parentElternteilIndexSchema,
  personUnion,
} from "./pageSchemaHelpers";

// Deepest level — no further nesting
const elternteilGrandchildSchema = z.object({
  name: z.string(),
  isAlive: YesNoAnswer,
});

// parentElternteilIndex: which of the deceased's parents this sibling belongs to,
// a parent index ("0"/"1") or "both" (full sibling). Injected by the dynamic parent select.
type ElternteilKind =
  | {
      name: string;
      isAlive: "yes";
      parentElternteilIndex?: string;
    }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "no";
      parentElternteilIndex?: string;
    }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: Array<{ name: string; isAlive: "yes" | "no" }>;
      parentElternteilIndex?: string;
    };

const elternteilKindSchema: z.ZodType<ElternteilKind> = personUnion(
  elternteilGrandchildSchema,
  { parentElternteilIndex: z.string().optional() },
);

export type Elternteil =
  | { name: string; isAlive: "yes" }
  | { name: string; isAlive: "no"; hatteKinder: "no" }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: ElternteilKind[];
    };

const elternteilSchema: z.ZodType<Elternteil> = personUnion(
  elternteilKindSchema,
  {},
);

const elternteileArray = z.array(elternteilSchema);

export const elternteilePages = {
  elternteilSummary: {
    stepId: "/elternteile",
    arraySummary: { name: "elternteile", schema: elternteileArray },
  },
  elternteilDaten: {
    stepId: "/elternteile/#/daten",
    pageSchema: datenFields("elternteile#"),
  },
  elternteilHatteKinder: {
    stepId: "/elternteile/#/hatteKinder",
    pageSchema: hatteKinderField("elternteile#"),
  },
  elternteilKinderAnzahl: {
    stepId: "/elternteile/#/kinderAnzahl",
    pageSchema: kinderAnzahlField("elternteile#"),
  },
  elternteilKindDaten: {
    stepId: "/elternteile/#/kinder/#/daten",
    pageSchema: {
      "elternteile#kinder#parentElternteilIndex": parentElternteilIndexSchema,
      ...datenFields("elternteile#kinder#"),
    },
  },
  elternteilKindHatteKinder: {
    stepId: "/elternteile/#/kinder/#/hatteKinder",
    pageSchema: hatteKinderField("elternteile#kinder#"),
  },
  elternteilKindKinderAnzahl: {
    stepId: "/elternteile/#/kinder/#/kinderAnzahl",
    pageSchema: kinderAnzahlField("elternteile#kinder#"),
  },
  elternteilKindKindDaten: {
    stepId: "/elternteile/#/kinder/#/kinder/#/daten",
    pageSchema: datenFields("elternteile#kinder#kinder#"),
  },
} as const;
