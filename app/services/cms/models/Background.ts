import { z } from "zod";
import { WrapperSchema } from "./Wrapper";

export const BackgroundSchema = WrapperSchema.merge(
  z.object({
    id: z.number(),
    __component: z.literal("meta.background").optional(),
  })
);

export type Background = z.infer<typeof BackgroundSchema>;
