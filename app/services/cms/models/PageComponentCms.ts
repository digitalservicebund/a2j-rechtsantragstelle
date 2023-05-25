import { z } from "zod";
import { InfoBoxSchema } from "./InfoBox";
import { HeaderSchema } from "./Header";
import { BoxSchema } from "./Box";

export const PageComponentCmsSchema = z.discriminatedUnion("__component", [
  BoxSchema.merge(
    z.object({
      __component: z.literal("page.box"),
    })
  ),
  HeaderSchema.merge(
    z.object({
      __component: z.literal("page.header"),
    })
  ),
  InfoBoxSchema.merge(
    z.object({
      __component: z.literal("page.info-box"),
    })
  ),
]);

export type PageComponentCms = z.infer<typeof PageComponentCmsSchema>;
