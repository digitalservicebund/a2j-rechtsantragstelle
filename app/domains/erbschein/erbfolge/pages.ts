import z from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

type Child = {
  name: string;
} & (
  | { isAlive: "yes"; hasChildren: "yes" | "no" }
  | { isAlive: "yes" | "no"; hasChildren: "no" }
  | { isAlive: "no"; hasChildren: "yes"; children: Child[] }
);

const nameSchema = z.string();

const aliveChildSchema = z.object({
  name: nameSchema,
  isAlive: z.literal("yes"),
  hasChildren: YesNoAnswer,
});

const deadChildlessChildSchema = z.object({
  name: nameSchema,
  isAlive: YesNoAnswer,
  hasChildren: z.literal("no"),
});

const childSchema: z.ZodType<Child> = z.lazy(() =>
  z.union([
    aliveChildSchema,
    deadChildlessChildSchema,
    z.object({
      name: nameSchema,
      isAlive: z.literal("no"),
      hasChildren: z.literal("yes"),
      children: z.array(childSchema),
    }),
  ]),
);

const childrenArray = z.array(childSchema);

export const erbfolgePages = {
  start: { stepId: "/start" },
  hasChildren: {
    stepId: "/kinder-vorhanden",
    pageSchema: { hasChildren: YesNoAnswer },
  },
  childrenArraySummary: {
    stepId: "/kinder",
    arraySchema: { children: childrenArray },
  },
  childInfo: {
    stepId: "/kinder/#/daten",
    pageSchema: {
      "children#name": nameSchema,
      "children#isAlive": YesNoAnswer,
      "children#hasChildren": YesNoAnswer,
    },
  },
  childChildrenSummary: {
    stepId: "/kinder/#/kinder",
    arraySchema: { "children#children": childrenArray },
  },
  childChildInfo: {
    stepId: "/kinder/#/kinder/#/daten",
    pageSchema: {
      "children#children#name": nameSchema,
      "children#children#isAlive": YesNoAnswer,
      "children#children#hasChildren": YesNoAnswer,
    },
  },
  childChildChildrenSummary: {
    stepId: "/kinder/#/kinder/#/kinder",
    arraySchema: { "children#children#children": childrenArray },
  },
  childChildChildInfo: {
    stepId: "/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: {
      "children#children#children#name": nameSchema,
      "children#children#children#isAlive": YesNoAnswer,
      "children#children#children#hasChildren": YesNoAnswer,
    },
  },
  end: { stepId: "/end" },
};
export type ErbfolgePages = typeof erbfolgePages;
