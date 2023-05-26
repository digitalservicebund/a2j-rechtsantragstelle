import { z } from "zod";
import { HasIdSchema } from "./HasId";
import { WrapperSchema } from "./Wrapper";

export const BackgroundSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.background").optional(),
  })
  .merge(WrapperSchema)
  .merge(HasIdSchema)
  .strict();

export type Background = z.infer<typeof BackgroundSchema>;
