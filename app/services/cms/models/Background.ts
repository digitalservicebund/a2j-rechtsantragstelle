import { z } from "zod";
import { WrapperSchema } from "./Wrapper";

export const BackgroundSchema = WrapperSchema.merge(
  z.object({
    id: z.number(),
    __component: z.literal("meta.background"),
  })
);

export type Background = z.infer<typeof WrapperSchema>;
