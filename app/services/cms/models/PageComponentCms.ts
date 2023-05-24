import { z } from "zod";
import { InfoBoxSchema } from "./InfoBox";
import { HeaderSchema } from "./Header";
import { BoxSchema } from "./Box";

export const PageComponentCmsSchema = z.union([
  BoxSchema,
  HeaderSchema,
  InfoBoxSchema,
]);

export type PageComponentCms = z.infer<typeof PageComponentCmsSchema>;
