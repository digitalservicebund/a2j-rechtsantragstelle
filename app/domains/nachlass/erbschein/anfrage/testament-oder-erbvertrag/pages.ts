import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";

export const testamentOderErbvertragPages = {
  testamentArt: {
    stepId: "/testament-oder-erbvertrag/art",
    pageSchema: {
      testamentArt: z.enum(["none", "handwritten", "notarized", "erbvertrag"]),
    },
  },
} satisfies PagesConfig;
