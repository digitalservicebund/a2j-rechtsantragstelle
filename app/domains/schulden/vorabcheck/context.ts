import { z } from "zod";
export const context = {
  zwangsvollstreckung: z.boolean(),
} as const;

const _contextObject = z.object(context).partial();
export type schuldenZwangsvollstreckungContext = z.infer<typeof _contextObject>;
