import { z } from "zod";
import { WrapperSchema } from "./Wrapper";

export const BackgroundSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.background").optional(),
  })
  .merge(WrapperSchema);

export type Background = z.infer<typeof BackgroundSchema>;
