import { z } from "zod";
import { FooterSchema } from "./Footer";
import { NavigationSchema } from "./Navigation";

export const SingleComponentCmsSchema = z.union([
  FooterSchema,
  NavigationSchema,
]);

export type SingleComponentCms = z.infer<typeof SingleComponentCmsSchema>;
