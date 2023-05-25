import { z } from "zod";
import { BackgroundColorSchema } from "./BackgroundColor";
import { PaddingSchema } from "./Padding";

export const WrapperSchema = z.object({
  backgroundColor: BackgroundColorSchema.nullable(),
  paddingTop: PaddingSchema.nullable(),
  paddingBottom: PaddingSchema.nullable(),
});

export type Wrapper = z.infer<typeof WrapperSchema>;
