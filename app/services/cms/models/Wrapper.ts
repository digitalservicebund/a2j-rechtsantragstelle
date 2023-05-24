import { z } from "zod";
import { BackgroundColorSchema } from "./BackgroundColor";
import { PaddingSchema } from "./Padding";

export const WrapperSchema = z.object({
  backgroundColor: BackgroundColorSchema.optional(),
  paddingTop: PaddingSchema.optional(),
  paddingBottom: PaddingSchema.optional(),
});

export type Wrapper = z.infer<typeof WrapperSchema>;
